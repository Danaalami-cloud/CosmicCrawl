import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeBackground from "../components/ThemeBackground";
import OccasionCard from "../components/OccasionCard";
import ThemeCard from "../components/ThemeCard";
import FilterChip from "../components/FilterChip";
import { OCCASIONS } from "../constants/occasions";
import { THEMES, buildCustomTheme } from "../constants/themes";
import { useCrawl } from "../context/CrawlContext";
import { Intensity } from "../types";

const INTENSITIES: { id: Intensity; label: string }[] = [
  { id: "mild", label: "Mild 🍃" },
  { id: "spicy", label: "Spicy 🌶️" },
  { id: "wild", label: "Wild 🔥" },
];

const STOP_OPTIONS = [3, 4, 5, 6];
const GROUP_OPTIONS = [2, 4, 6, 8, 10];

export default function Onboarding() {
  const {
    filters,
    setFilters,
    selectedOccasion,
    setSelectedOccasion,
    selectedTheme,
    setSelectedTheme,
  } = useCrawl();

  const [customText, setCustomText] = useState(filters.customThemeText);

  const canGenerate = !!selectedOccasion && !!selectedTheme;

  const pickPresetTheme = (t: (typeof THEMES)[number]) => {
    setCustomText("");
    setSelectedTheme(t);
    setFilters((f) => ({ ...f, themeId: t.id, customThemeText: "" }));
  };

  const onCustomTextChange = (text: string) => {
    setCustomText(text);
    if (text.trim().length === 0) {
      setSelectedTheme(null);
      setFilters((f) => ({ ...f, themeId: null, customThemeText: "" }));
      return;
    }
    const theme = buildCustomTheme(text);
    setSelectedTheme(theme);
    setFilters((f) => ({ ...f, themeId: "custom", customThemeText: text }));
  };

  return (
    <ThemeBackground>
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 140, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-white text-2xl font-extrabold">
              Build your crawl 🛸
            </Text>
            <Pressable onPress={() => router.push("/settings")}>
              <Text className="text-white/40 text-xl">⚙️</Text>
            </Pressable>
          </View>
          <Text className="text-white/50 mb-6">
            Pick your reason to celebrate, a theme (any theme), and how spicy
            the games get.
          </Text>

          <Text className="text-ufo font-bold uppercase text-xs tracking-wider mb-3">
            What are we celebrating?
          </Text>
          <View className="flex-row flex-wrap justify-between mb-6">
            {OCCASIONS.map((o) => (
              <OccasionCard
                key={o.id}
                occasion={o}
                selected={selectedOccasion?.id === o.id}
                onPress={() => {
                  setSelectedOccasion(o);
                  setFilters((f) => ({ ...f, occasionId: o.id }));
                }}
              />
            ))}
          </View>

          <Text className="text-plasma-light font-bold uppercase text-xs tracking-wider mb-3">
            Pick a theme — or type your own
          </Text>
          <Text className="text-white/40 text-xs mb-3">
            Go with a decade, a vibe like "Fancy Wine Bar," or type anything —
            "classy pub crawl," "goth industrial," whatever you're feeling.
          </Text>

          <TextInput
            value={customText}
            onChangeText={onCustomTextChange}
            placeholder='Type your own theme, e.g. "classy wine bar crawl"'
            placeholderTextColor="#ffffff40"
            className={`rounded-xl border px-4 py-3 text-white mb-4 ${
              customText.trim().length > 0
                ? "bg-nebula/20 border-nebula"
                : "bg-void-light/70 border-nebula/30"
            }`}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {THEMES.map((t) => (
              <ThemeCard
                key={t.id}
                theme={t}
                selected={
                  customText.trim().length === 0 && selectedTheme?.id === t.id
                }
                onPress={() => pickPresetTheme(t)}
              />
            ))}
          </ScrollView>

          <Text className="text-acid font-bold uppercase text-xs tracking-wider mb-3">
            Seating
          </Text>
          <View className="flex-row flex-wrap mb-6">
            <FilterChip
              label="🌤️ Outdoor seating only"
              active={filters.outdoorOnly}
              onPress={() =>
                setFilters((f) => ({ ...f, outdoorOnly: !f.outdoorOnly }))
              }
            />
          </View>

          <Text className="text-starlight font-bold uppercase text-xs tracking-wider mb-3">
            Crawl length (stops)
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {STOP_OPTIONS.map((n) => (
              <FilterChip
                key={n}
                label={`${n} stops`}
                active={filters.stopCount === n}
                activeColorClass="bg-starlight/20 border-starlight"
                onPress={() => setFilters((f) => ({ ...f, stopCount: n }))}
              />
            ))}
          </View>

          <Text className="text-cap font-bold uppercase text-xs tracking-wider mb-3">
            Group size
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {GROUP_OPTIONS.map((n) => (
              <FilterChip
                key={n}
                label={`${n} people`}
                active={filters.groupSize === n}
                activeColorClass="bg-cap/20 border-cap"
                onPress={() => setFilters((f) => ({ ...f, groupSize: n }))}
              />
            ))}
          </View>

          <Text className="text-plasma font-bold uppercase text-xs tracking-wider mb-3">
            🔞 Game intensity (18+)
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {INTENSITIES.map((i) => (
              <FilterChip
                key={i.id}
                label={i.label}
                active={filters.intensity === i.id}
                activeColorClass="bg-plasma/20 border-plasma"
                onPress={() => setFilters((f) => ({ ...f, intensity: i.id }))}
              />
            ))}
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-void/90">
          <Pressable
            disabled={!canGenerate}
            onPress={() => router.push("/results")}
            className={`rounded-full py-4 items-center ${
              canGenerate ? "bg-acid" : "bg-white/10"
            }`}
          >
            <Text
              className={`font-extrabold text-base ${
                canGenerate ? "text-void" : "text-white/40"
              }`}
            >
              {canGenerate ? "Generate My Crawl 🚀" : "Pick an occasion + theme"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemeBackground>
  );
}
