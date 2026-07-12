import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeBackground from "../components/ThemeBackground";
import BarCard from "../components/BarCard";
import { useCrawl } from "../context/CrawlContext";
import { PlacesApiError, searchBars } from "../services/placesService";

export default function Results() {
  const { filters, selectedTheme, selectedOccasion, bars, setBars } =
    useCrawl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCrawl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Location is a nice-to-have (it biases search to nearby bars), not a
      // hard requirement — isolate it so a GPS/CoreLocation hiccup (common
      // on simulators with no location set, indoors, or a cold fix) doesn't
      // abort the whole crawl. On failure we just search without a location
      // bias instead of showing an error.
      let coords: { latitude: number; longitude: number } | null = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          // Try a fast last-known fix first; a fresh GPS fix can take a
          // while (or fail with kCLErrorLocationUnknown) if the last-known
          // one is missing or stale.
          const lastKnown = await Location.getLastKnownPositionAsync({
            maxAge: 5 * 60 * 1000,
          }).catch(() => null);

          const loc =
            lastKnown ??
            (await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            }));

          coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
        }
      } catch (locErr) {
        console.warn(
          "Location unavailable, searching without a location bias:",
          locErr
        );
      }

      const results = await searchBars({
        filters,
        theme: selectedTheme,
        coords,
      });

      if (results.length === 0) {
        setError(
          "No bars matched your filters nearby. Try turning off 'outdoor seating only' or picking a different theme."
        );
      }
      setBars(results);
    } catch (e) {
      setError(e instanceof PlacesApiError ? e.message : "Something went wrong finding bars.");
    } finally {
      setLoading(false);
    }
  }, [filters, selectedTheme]);

  useEffect(() => {
    fetchCrawl();
  }, [fetchCrawl]);

  return (
    <ThemeBackground>
      <SafeAreaView className="flex-1 px-5">
        <View className="flex-row items-center justify-between mb-4 pt-2">
          <Pressable onPress={() => router.back()}>
            <Text className="text-white/60 text-2xl">←</Text>
          </Pressable>
          <Text className="text-white text-lg font-extrabold" numberOfLines={1}>
            {selectedTheme?.emoji} {selectedTheme?.label} Crawl
          </Text>
          <Pressable onPress={fetchCrawl}>
            <Text className="text-acid text-sm font-bold">Shuffle</Text>
          </Pressable>
        </View>

        <Text className="text-white/50 mb-4">
          {selectedOccasion?.emoji} {selectedOccasion?.label} · {filters.groupSize} people ·{" "}
          {filters.outdoorOnly ? "Outdoor seating" : "Any seating"}
        </Text>

        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#B4FF39" size="large" />
            <Text className="text-white/50 mt-4">Scanning the galaxy for bars…</Text>
          </View>
        )}

        {!loading && error && (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-5xl mb-4">🛰️</Text>
            <Text className="text-white text-center mb-6">{error}</Text>
            <Pressable
              onPress={fetchCrawl}
              className="bg-nebula rounded-full px-6 py-3"
            >
              <Text className="text-white font-bold">Try again</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && (
          <FlatList
            data={bars}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <BarCard
                bar={item}
                index={index}
                onPress={() => router.push(`/bar/${item.id}`)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View className="absolute bottom-6 left-5 right-5">
          <Pressable
            onPress={() => router.push("/games")}
            className="bg-plasma rounded-full py-4 items-center"
          >
            <Text className="text-white font-extrabold text-base">
              🔞 Play a game at your next stop
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemeBackground>
  );
}