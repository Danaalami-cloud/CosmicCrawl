// import React from "react";
// import { Linking, Pressable, ScrollView, Text, View } from "react-native";
// import { router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import ThemeBackground from "../components/ThemeBackground";
// import { setAgeVerified } from "../services/storage";

// export default function Settings() {
//   return (
//     <ThemeBackground>
//       <SafeAreaView className="flex-1 px-5">
//         <View className="flex-row items-center justify-between pt-2 mb-6">
//           <Pressable onPress={() => router.back()}>
//             <Text className="text-white/60 text-2xl">←</Text>
//           </Pressable>
//           <Text className="text-white text-lg font-extrabold">Settings</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           <Text className="text-acid font-bold uppercase text-xs tracking-wider mb-2">
//             Bar data
//           </Text>
//           <Text className="text-white/50 text-xs mb-8">
//             Cosmic Crawl looks up real, nearby bars through a small server
//             endpoint bundled with this app (see app/places+api.ts). The
//             Google Places API key lives only on that server — never inside
//             the app itself — so there's nothing to configure here. If crawls
//             aren't loading, the person who deployed this app needs to check
//             the GOOGLE_PLACES_API_KEY environment variable on the server.
//           </Text>

//           <Pressable
//             onPress={() =>
//               Linking.openURL(
//                 "https://developers.google.com/maps/documentation/places/web-service/text-search"
//               )
//             }
//             className="mb-8"
//           >
//             <Text className="text-ufo text-sm">→ Places API (New) docs</Text>
//           </Pressable>

//           <Text className="text-plasma font-bold uppercase text-xs tracking-wider mb-2">
//             Reset
//           </Text>
//           <Pressable
//             onPress={async () => {
//               await setAgeVerified(false);
//               router.replace("/");
//             }}
//             className="bg-white/10 rounded-full py-3 items-center"
//           >
//             <Text className="text-white font-semibold">Reset age verification</Text>
//           </Pressable>
//         </ScrollView>
//       </SafeAreaView>
//     </ThemeBackground>
//   );
// }
