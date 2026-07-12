import React from "react";
import { Pressable, Text, View } from "react-native";
import { Occasion } from "../types";

type Props = {
  occasion: Occasion;
  selected: boolean;
  onPress: () => void;
};

export default function OccasionCard({ occasion, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-[47%] mb-3 rounded-2xl border p-4 ${
        selected
          ? "bg-plasma/20 border-plasma"
          : "bg-void-light/60 border-nebula/30"
      }`}
    >
      <Text className="text-3xl mb-1">{occasion.emoji}</Text>
      <Text
        className={`text-base font-bold ${
          selected ? "text-plasma-light" : "text-white"
        }`}
      >
        {occasion.label}
      </Text>
      <Text className="text-xs text-white/60 mt-1">{occasion.blurb}</Text>
    </Pressable>
  );
}
