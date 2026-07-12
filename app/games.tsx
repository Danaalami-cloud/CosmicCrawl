import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeBackground from "../components/ThemeBackground";
import GameCard from "../components/GameCard";
import FilterChip from "../components/FilterChip";
import { promptsByIntensity } from "../constants/gamePrompts";
import { useCrawl } from "../context/CrawlContext";
import { GamePrompt, Intensity } from "../types";

const INTENSITIES: { id: Intensity; label: string }[] = [
  { id: "mild", label: "Mild 🍃" },
  { id: "spicy", label: "Spicy 🌶️" },
  { id: "wild", label: "Wild 🔥" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Games() {
  const { filters, setFilters } = useCrawl();
  const [deck, setDeck] = useState<GamePrompt[]>(() =>
    shuffle(promptsByIntensity(filters.intensity))
  );
  const [index, setIndex] = useState(0);

  const current = deck[index % deck.length];

  const reshuffle = (intensity: Intensity) => {
    setFilters((f) => ({ ...f, intensity }));
    setDeck(shuffle(promptsByIntensity(intensity)));
    setIndex(0);
  };

  const next = () => {
    if (index + 1 >= deck.length) {
      setDeck(shuffle(promptsByIntensity(filters.intensity)));
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <ThemeBackground>
      <SafeAreaView className="flex-1 px-5">
        <View className="flex-row items-center justify-between pt-2 mb-2">
          <Pressable onPress={() => router.back()}>
            <Text className="text-white/60 text-2xl">←</Text>
          </Pressable>
          <Text className="text-white text-lg font-extrabold">🔞 On-The-Spot Games</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text className="text-white/50 mb-4">
          Adult party prompts. 18+ only. Play what your group's comfortable with — always consensual.
        </Text>

        <View className="flex-row flex-wrap mb-6">
          {INTENSITIES.map((i) => (
            <FilterChip
              key={i.id}
              label={i.label}
              active={filters.intensity === i.id}
              activeColorClass="bg-plasma/20 border-plasma"
              onPress={() => reshuffle(i.id)}
            />
          ))}
        </View>

        {current ? (
          <GameCard prompt={current} onNext={next} />
        ) : (
          <Text className="text-white/50">No prompts available.</Text>
        )}

        <Text className="text-white/30 text-xs mt-6 text-center">
          {index + 1} / {deck.length} in this deck · tap Next to keep going
        </Text>
      </SafeAreaView>
    </ThemeBackground>
  );
}
