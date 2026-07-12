import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../constants/theme";

const { width, height } = Dimensions.get("window");
const DECOR = ["✦", "✧", "🍄", "👽", "🛸", "⭐️", "🌙", "✨"];

type Props = {
  children?: React.ReactNode;
  decorCount?: number;
};

export default function ThemeBackground({ children, decorCount = 14 }: Props) {
  const decor = useMemo(
    () =>
      Array.from({ length: decorCount }).map((_, i) => ({
        key: i,
        symbol: DECOR[i % DECOR.length],
        top: Math.random() * height,
        left: Math.random() * width,
        size: 10 + Math.random() * 18,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [decorCount]
  );

  return (
    <View className="flex-1">
      <LinearGradient
        colors={GRADIENTS.background}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {decor.map((d) => (
        <Text
          key={d.key}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            fontSize: d.size,
            opacity: d.opacity,
          }}
        >
          {d.symbol}
        </Text>
      ))}
      <View className="flex-1">{children}</View>
    </View>
  );
}
