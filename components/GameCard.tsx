import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GamePrompt } from "../types";
import { GRADIENTS, INTENSITY_META } from "../constants/theme";

type Props = {
  prompt: GamePrompt;
  onNext: () => void;
};

const TYPE_LABEL: Record<GamePrompt["type"], string> = {
  "never-have-i-ever": "Never Have I Ever",
  truth: "Truth",
  dare: "Dare",
  "would-you-rather": "Would You Rather",
  "on-the-spot": "On The Spot",
};

export default function GameCard({ prompt, onNext }: Props) {
  const meta = INTENSITY_META[prompt.intensity];

  return (
    <View className="rounded-3xl overflow-hidden border border-nebula/40">
      <LinearGradient colors={GRADIENTS.card} style={{ padding: 24, minHeight: 260 }}>
        <View
          className="self-start rounded-full px-3 py-1 mb-4"
          style={{ backgroundColor: `${meta.color}25` }}
        >
          <Text style={{ color: meta.color }} className="text-xs font-bold uppercase tracking-wider">
            {TYPE_LABEL[prompt.type]} · {meta.label}
          </Text>
        </View>

        <Text className="text-white text-2xl font-extrabold leading-8">
          {prompt.text}
        </Text>

        <Pressable
          onPress={onNext}
          className="mt-8 self-start bg-plasma rounded-full px-6 py-3"
        >
          <Text className="text-white font-bold">Next prompt →</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}
