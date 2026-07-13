import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
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
  const { filters, selectedTheme, selectedOccasion, bars, setBars, setUserLocation, visitedIds, savedLists, createList, addBarToList, loadLists } =
    useCrawl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedBarForList, setSelectedBarForList] = useState<any>(null);
  const [newListName, setNewListName] = useState("");

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
          setUserLocation(coords);
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
          "No bars matched your filters nearby. Try turning off the outdoor seating preference or picking a different theme."
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
    loadLists();
  }, [fetchCrawl]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchBars({
        filters: { ...filters, stopCount: 10 },
        theme: null,
        coords: null,
        cityText: query,
      });
      setSearchResults(results);
    } catch (e) {
      console.error("Search error:", e);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [filters]);

  const addBarToCrawl = (bar: any) => {
    // Check if bar already exists
    if (!bars.find((b) => b.id === bar.id)) {
      setBars([...bars, bar]);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const handleAddBarToList = (bar: any) => {
    setSelectedBarForList(bar);
    setShowListModal(true);
    setNewListName("");
  };

  const handleSelectExistingList = async (listId: string) => {
    if (selectedBarForList) {
      await addBarToList(listId, selectedBarForList);
      setShowListModal(false);
      setSelectedBarForList(null);
    }
  };

  const handleCreateNewList = async () => {
    if (newListName.trim() && selectedBarForList) {
      const newList = await createList(newListName);
      await addBarToList(newList.id, selectedBarForList);
      setShowListModal(false);
      setSelectedBarForList(null);
      setNewListName("");
    }
  };

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
          <View className="flex-row gap-3">
            <Pressable onPress={fetchCrawl}>
              <Text className="text-acid text-sm font-bold">Shuffle</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/lists")}>
              <Text className="text-nebula text-lg">📋</Text>
            </Pressable>
          </View>
        </View>

        <Text className="text-white/50 mb-4">
          {selectedOccasion?.emoji} {selectedOccasion?.label} · {filters.groupSize} people ·{" "}
          {filters.preferOutdoor ? "Prefer outdoor seating" : "Any seating"}
        </Text>

        {/* Search bar toggle */}
        {!showSearch && (
          <Pressable
            onPress={() => setShowSearch(true)}
            className="mb-4 bg-nebula/20 rounded-full px-4 py-3 border border-nebula/50 flex-row items-center"
          >
            <Text className="text-nebula text-lg mr-2">🔍</Text>
            <Text className="text-white/60 flex-1">Add a bar manually...</Text>
          </Pressable>
        )}

        {/* Search panel */}
        {showSearch && (
          <View className="mb-4 bg-white/5 rounded-lg p-4 border border-white/10">
            <View className="flex-row items-center gap-2 mb-3">
              <TextInput
                placeholder="Search for a bar..."
                placeholderTextColor="#ffffff60"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  handleSearch(text);
                }}
                className="flex-1 bg-white/10 text-white px-4 py-2 rounded-full border border-white/20"
              />
              <Pressable onPress={() => { setShowSearch(false); setSearchResults([]); setSearchQuery(""); }}>
                <Text className="text-white/60 text-xl">✕</Text>
              </Pressable>
            </View>

            {/* Search results */}
            {searching && <ActivityIndicator color="#B4FF39" />}
            {searchResults.length > 0 && (
              <View className="max-h-80">
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={true}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => addBarToCrawl(item)}
                      className="bg-white/10 rounded-lg p-3 mb-2 flex-row justify-between items-center border border-white/20"
                    >
                      <View className="flex-1">
                        <Text className="text-white font-semibold">{item.name}</Text>
                        <Text className="text-white/50 text-xs">{item.address}</Text>
                        {item.rating && (
                          <Text className="text-acid text-xs mt-1">★ {item.rating.toFixed(1)}</Text>
                        )}
                      </View>
                      <Text className="text-ufo text-lg">+</Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
            {!searching && searchQuery.trim() && searchResults.length === 0 && (
              <Text className="text-white/50 text-sm text-center py-2">No bars found</Text>
            )}
          </View>
        )}

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
          <>
            {/* Visited places count + mini map preview */}
            {visitedIds.size > 0 && (
              <View className="mb-4 p-4 bg-plasma/10 rounded-lg border border-plasma/30">
                <Text className="text-plasma font-bold mb-2">
                  ✓ {visitedIds.size} / {bars.length} stops visited
                </Text>
                <View className="flex-row gap-2 flex-wrap">
                  {bars.map((bar, idx) => (
                    <View
                      key={bar.id}
                      className={`w-8 h-8 rounded-full items-center justify-center text-xs font-bold ${
                        visitedIds.has(bar.id)
                          ? "bg-ufo text-void"
                          : "bg-white/20 text-white/50"
                      }`}
                    >
                      <Text>{idx + 1}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Bars list */}
            <FlatList
              data={bars}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <BarCard
                  bar={item}
                  index={index}
                  onPress={() => router.push(`/bar/${item.id}`)}
                  onAddToList={handleAddBarToList}
                />
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {!loading && !error && bars.length > 0 && (
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
        )}

        {/* Save to list modal */}
        <Modal transparent animationType="fade" visible={showListModal}>
          <View className="flex-1 bg-black/50 items-center justify-center px-6">
            <View className="bg-void rounded-2xl p-6 w-full max-w-sm border border-white/10">
              <Text className="text-white text-xl font-bold mb-2">Save to list</Text>
              <Text className="text-white/50 text-sm mb-4">{selectedBarForList?.name}</Text>

              {/* Existing lists */}
              {savedLists.length > 0 && (
                <>
                  <Text className="text-white/70 text-xs font-semibold mb-2">Add to existing:</Text>
                  <FlatList
                    data={savedLists}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => handleSelectExistingList(item.id)}
                        className="bg-white/10 rounded-lg p-3 mb-2 border border-white/20"
                      >
                        <Text className="text-white font-semibold text-sm">{item.name}</Text>
                        <Text className="text-white/50 text-xs">{item.bars.length} bars</Text>
                      </Pressable>
                    )}
                  />
                  <View className="h-px bg-white/10 my-3" />
                </>
              )}

              {/* Create new list */}
              <Text className="text-white/70 text-xs font-semibold mb-2">Create new list:</Text>
              <TextInput
                placeholder="List name..."
                placeholderTextColor="#ffffff40"
                value={newListName}
                onChangeText={setNewListName}
                className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 mb-4"
              />

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => { setShowListModal(false); setSelectedBarForList(null); setNewListName(""); }}
                  className="flex-1 bg-white/10 rounded-full py-3 items-center"
                >
                  <Text className="text-white/60 font-bold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleCreateNewList}
                  disabled={!newListName.trim()}
                  className="flex-1 bg-ufo rounded-full py-3 items-center disabled:opacity-50"
                >
                  <Text className="text-void font-bold">Create & Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemeBackground>
  );
}