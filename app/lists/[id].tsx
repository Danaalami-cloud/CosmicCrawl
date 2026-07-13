import React, { useState } from "react";
import { Text, View, Pressable, ScrollView, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeBackground from "../../components/ThemeBackground";
import BarCard from "../../components/BarCard";
import { useCrawl } from "../../context/CrawlContext";

export default function ListDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { savedLists, removeBarFromList } = useCrawl();
  const list = savedLists.find((l) => l.id === id);

  if (!list) {
    return (
      <ThemeBackground>
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-center">List not found</Text>
          <Pressable onPress={() => router.back()} className="mt-6">
            <Text className="text-acid font-bold">← Back</Text>
          </Pressable>
        </SafeAreaView>
      </ThemeBackground>
    );
  }

  return (
    <ThemeBackground>
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4 pt-4">
            <Pressable onPress={() => router.back()}>
              <Text className="text-white/60 text-2xl">←</Text>
            </Pressable>
            <View className="flex-1 mx-4">
              <Text className="text-white text-xl font-extrabold text-center">{list.name}</Text>
              <Text className="text-white/50 text-xs text-center mt-1">
                {list.bars.length} {list.bars.length === 1 ? "bar" : "bars"}
              </Text>
            </View>
            <Pressable
              onPress={() => router.back()}
              className="w-8 h-8"
            >
              <Text className="text-white/40">✕</Text>
            </Pressable>
          </View>

          {/* Bars in list */}
          {list.bars.length === 0 ? (
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-5xl mb-4">🍸</Text>
              <Text className="text-white text-lg font-semibold">No bars yet</Text>
              <Text className="text-white/50 text-center mt-2">
                Add bars from your crawls!
              </Text>
            </View>
          ) : (
            <FlatList
              data={list.bars}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View className="relative mb-4">
                  <BarCard
                    bar={item}
                    index={index + 1}
                    onPress={() => {}}
                  />
                  <Pressable
                    onPress={() => removeBarFromList(list.id, item.id)}
                    className="absolute top-2 right-2 bg-plasma/80 rounded-full p-2 z-10"
                  >
                    <Text className="text-white text-sm">✕</Text>
                  </Pressable>
                </View>
              )}
            />
          )}
        </ScrollView>

        {/* Action buttons */}
        {list.bars.length > 0 && (
          <View className="absolute bottom-6 left-5 right-5">
            <Pressable
              onPress={() => router.push("/onboarding")}
              className="bg-ufo rounded-full py-4 items-center mb-3"
            >
              <Text className="text-white font-extrabold">🛸 Start new crawl</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              className="bg-white/10 rounded-full py-3 items-center border border-white/20"
            >
              <Text className="text-white/60 font-bold">Back to lists</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </ThemeBackground>
  );
}
