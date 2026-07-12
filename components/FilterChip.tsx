import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColorClass?: string; // e.g. "bg-ufo/20 border-ufo text-ufo"
};

export default function FilterChip({
  label,
  active,
  onPress,
  activeColorClass = "bg-acid/20 border-acid",
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full border mr-2 mb-2 ${
        active ? activeColorClass : "bg-void-light/50 border-white/15"
      }`}
    >
      <Text className={`text-sm font-semibold ${active ? "text-white" : "text-white/60"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
