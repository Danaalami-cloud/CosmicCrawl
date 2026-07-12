import AsyncStorage from "@react-native-async-storage/async-storage";

// NOTE: There is intentionally no client-side Google Places API key storage
// here. The key lives only on the server (see app/places+api.ts), so it's
// never bundled into the app or visible to end users. See README.md for
// how to configure GOOGLE_PLACES_API_KEY for deployment.

const KEYS = {
  ageVerified: "cosmic-crawl:age-verified",
  lastFilters: "cosmic-crawl:last-filters",
};

export async function setAgeVerified(value: boolean) {
  await AsyncStorage.setItem(KEYS.ageVerified, value ? "1" : "0");
}

export async function getAgeVerified(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.ageVerified);
  return v === "1";
}

export async function saveLastFilters(filtersJson: string) {
  await AsyncStorage.setItem(KEYS.lastFilters, filtersJson);
}

export async function getLastFilters(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.lastFilters);
}
