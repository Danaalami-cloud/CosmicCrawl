import React, { useEffect, useState } from "react";
import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import ThemeBackground from "../components/ThemeBackground";
import { getAgeVerified, setAgeVerified } from "../services/storage";

export default function AgeGate() {
  const [checking, setChecking] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const verified = await getAgeVerified();
      if (verified) {
        router.replace("/onboarding");
      } else {
        setChecking(false);
      }
    })();
  }, []);

  const confirm = async () => {
    await setAgeVerified(true);
    router.replace("/onboarding");
  };

  if (checking) {
    return (
      <ThemeBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B4FF39" />
        </View>
      </ThemeBackground>
    );
  }

  if (denied) {
    return (
      <ThemeBackground>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">🛸</Text>
          <Text className="text-white text-xl font-bold text-center">
            Cosmic Crawl is for adults 18+ only.
          </Text>
          <Text className="text-white/60 text-center mt-2">
            Come back when you've cleared orbit on your 18th birthday.
          </Text>
        </View>
      </ThemeBackground>
    );
  }

  return (
    <ThemeBackground>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-6xl mb-6">🍄🛸✨</Text>
        <Text className="text-white text-3xl font-extrabold text-center">
          Cosmic Crawl
        </Text>
        <Text className="text-white/60 text-center mt-3 mb-10">
          A decade-themed pub crawl planner with adult party games,
          for grown-ups only. 18+, R-rated content ahead.
        </Text>

        <Pressable
          onPress={confirm}
          className="bg-acid rounded-full px-8 py-4 w-full items-center mb-3"
        >
          <Text className="text-void font-extrabold text-base">
            I'm 18 or older — Let's go 🚀
          </Text>
        </Pressable>

        <Pressable onPress={() => setDenied(true)} className="py-3">
          <Text className="text-white/40 text-sm">I'm under 18</Text>
        </Pressable>
      </View>
    </ThemeBackground>
  );
}
