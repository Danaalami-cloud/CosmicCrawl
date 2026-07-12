import React from "react";
import { Pressable, Text } from "react-native";
import { ThemeOption } from "../types";

type Props = {
  theme: ThemeOption;
  selected: boolean;
  onPress: () => void;
};

export default function ThemeCard({ theme, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-3 rounded-2xl border px-4 py-3 items-center ${
        selected ? "bg-acid/15 border-acid" : "bg-void-light/60 border-ufo/20"
      }`}
      style={{ minWidth: 128 }}
    >
      <Text className="text-3xl mb-1">{theme.emoji}</Text>
      <Text
        className={`text-sm font-bold text-center ${
          selected ? "text-acid" : "text-white"
        }`}
      >
        {theme.label}
      </Text>
      <Text className="text-[10px] text-white/50 mt-1 text-center">
        {theme.styleHint}
      </Text>
    </Pressable>
  );
}
