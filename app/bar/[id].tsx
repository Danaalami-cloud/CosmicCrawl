import React from "react";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeBackground from "../../components/ThemeBackground";
import { useCrawl } from "../../context/CrawlContext";

export default function BarDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bars, visitedIds, toggleVisited } = useCrawl();
  const bar = bars.find((b) => b.id === id);
  const currentIndex = bars.findIndex((b) => b.id === id);
  const prevBar = currentIndex > 0 ? bars[currentIndex - 1] : null;
  const nextBar = currentIndex < bars.length - 1 ? bars[currentIndex + 1] : null;

  if (!bar) {
    return (
      <ThemeBackground>
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-center">
            Couldn't find that bar. Go back and regenerate your crawl.
          </Text>
          <Pressable onPress={() => router.back()} className="mt-6">
            <Text className="text-acid font-bold">← Back</Text>
          </Pressable>
        </SafeAreaView>
      </ThemeBackground>
    );
  }

  const visited = visitedIds.has(bar.id);
  const visitedCount = visitedIds.size;
  const totalStops = bars.length;
  const stopNumber = currentIndex + 1;

  return (
    <ThemeBackground>
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {/* Header with back button and progress */}
          <View className="px-5 pt-2 flex-row items-center justify-between mb-4">
            <Pressable onPress={() => router.back()}>
              <Text className="text-white/60 text-2xl">←</Text>
            </Pressable>
            <Text className="text-white/60 text-sm font-semibold">
              Stop {stopNumber} of {totalStops} • {visitedCount} visited
            </Text>
            <View className="w-6" />
          </View>

          {/* Progress map - visual journey */}
          <View className="px-5 mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <View className="flex-row gap-1 items-center justify-center flex-wrap">
              {bars.map((b, idx) => (
                <React.Fragment key={b.id}>
                  <Pressable
                    onPress={() => router.push(`/bar/${b.id}`)}
                    className={`w-10 h-10 rounded-full items-center justify-center font-bold text-xs ${
                      b.id === bar.id
                        ? "bg-ufo ring-2 ring-ufo/50"
                        : visitedIds.has(b.id)
                        ? "bg-acid/30 border border-acid"
                        : "bg-white/20 border border-white/20"
                    }`}
                  >
                    <Text
                      className={`font-extrabold ${
                        b.id === bar.id
                          ? "text-void"
                          : visitedIds.has(b.id)
                          ? "text-acid"
                          : "text-white/60"
                      }`}
                    >
                      {idx + 1}
                    </Text>
                  </Pressable>
                  {idx < bars.length - 1 && (
                    <View
                      className={`h-0.5 w-3 ${
                        visitedIds.has(b.id) && visitedIds.has(bars[idx + 1].id)
                          ? "bg-acid"
                          : "bg-white/20"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {bar.photoUrl ? (
            <Image
              source={{ uri: bar.photoUrl }}
              className="w-full h-56 mt-3"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-56 mt-3 items-center justify-center bg-void-light">
              <Text className="text-5xl">🍸</Text>
            </View>
          )}

          <View className="px-5 pt-5">
            <Text className="text-white text-2xl font-extrabold">{bar.name}</Text>
            <Text className="text-white/60 mt-1">{bar.address}</Text>

            <View className="flex-row flex-wrap mt-4">
              {bar.rating != null && (
                <View className="bg-starlight/15 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-starlight text-xs font-semibold">
                    ★ {bar.rating.toFixed(1)} ({bar.userRatingCount ?? 0})
                  </Text>
                </View>
              )}
              {bar.outdoorSeating && (
                <View className="bg-acid/15 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-acid text-xs font-semibold">🌤️ Outdoor seating</Text>
                </View>
              )}
              {bar.isOpenNow != null && (
                <View
                  className={`rounded-full px-3 py-1 mr-2 mb-2 ${
                    bar.isOpenNow ? "bg-ufo/15" : "bg-white/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      bar.isOpenNow ? "text-ufo" : "text-white/50"
                    }`}
                  >
                    {bar.isOpenNow ? "Open now" : "Closed"}
                  </Text>
                </View>
              )}
            </View>

            <Pressable
              onPress={() => toggleVisited(bar.id)}
              className={`mt-6 rounded-full py-4 items-center border ${
                visited ? "bg-acid/20 border-acid" : "bg-transparent border-white/20"
              }`}
            >
              <Text className={`font-bold ${visited ? "text-acid" : "text-white"}`}>
                {visited ? "✓ Marked as visited" : "Mark this stop as visited"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => bar.mapsUri && Linking.openURL(bar.mapsUri)}
              className="mt-3 rounded-full py-4 items-center bg-nebula"
            >
              <Text className="text-white font-bold">Open in Google Maps</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/games")}
              className="mt-3 rounded-full py-4 items-center bg-plasma"
            >
              <Text className="text-white font-bold">🔞 Play a game here</Text>
            </Pressable>

            {/* Navigation buttons */}
            <View className="flex-row gap-3 mt-6">
              {prevBar ? (
                <Pressable
                  onPress={() => router.push(`/bar/${prevBar.id}`)}
                  className="flex-1 rounded-full py-4 items-center bg-white/10 border border-white/20"
                >
                  <Text className="text-white font-bold">← Previous</Text>
                </Pressable>
              ) : (
                <View className="flex-1" />
              )}
              {nextBar ? (
                <Pressable
                  onPress={() => router.push(`/bar/${nextBar.id}`)}
                  className="flex-1 rounded-full py-4 items-center bg-ufo"
                >
                  <Text className="text-white font-bold">Next →</Text>
                </Pressable>
              ) : (
                <View className="flex-1" />
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeBackground>
  );
}
