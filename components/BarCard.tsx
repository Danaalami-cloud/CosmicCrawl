import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { BarStop } from "../types";

type Props = {
  bar: BarStop;
  index: number;
  onPress: () => void;
};

export default function BarCard({ bar, index, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl overflow-hidden border border-nebula/30 bg-void-light/60 mb-4"
    >
      <View className="flex-row">
        <View className="w-10 items-center justify-center bg-plasma/20">
          <Text className="text-plasma-light font-extrabold text-lg">{index + 1}</Text>
        </View>

        {bar.photoUrl ? (
          <Image source={{ uri: bar.photoUrl }} className="w-24 h-24" resizeMode="cover" />
        ) : (
          <View className="w-24 h-24 items-center justify-center bg-void">
            <Text className="text-2xl">🍸</Text>
          </View>
        )}

        <View className="flex-1 px-3 py-2">
          <Text className="text-white font-bold text-base" numberOfLines={1}>
            {bar.name}
          </Text>
          <Text className="text-white/50 text-xs mt-0.5" numberOfLines={1}>
            {bar.address}
          </Text>

          <View className="flex-row items-center mt-2 flex-wrap">
            {bar.rating != null && (
              <View className="bg-starlight/15 rounded-full px-2 py-0.5 mr-1.5 mb-1">
                <Text className="text-starlight text-[11px] font-semibold">
                  ★ {bar.rating.toFixed(1)}
                </Text>
              </View>
            )}
            {bar.outdoorSeating && (
              <View className="bg-acid/15 rounded-full px-2 py-0.5 mr-1.5 mb-1">
                <Text className="text-acid text-[11px] font-semibold">🌤️ Outdoor</Text>
              </View>
            )}
            {bar.isOpenNow != null && (
              <View
                className={`rounded-full px-2 py-0.5 mr-1.5 mb-1 ${
                  bar.isOpenNow ? "bg-ufo/15" : "bg-white/10"
                }`}
              >
                <Text
                  className={`text-[11px] font-semibold ${
                    bar.isOpenNow ? "text-ufo" : "text-white/50"
                  }`}
                >
                  {bar.isOpenNow ? "Open now" : "Closed"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
