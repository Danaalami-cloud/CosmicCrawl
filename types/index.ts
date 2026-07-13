export type Occasion = {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
};

// A "theme" is the vibe/aesthetic for the crawl. It can be one of the curated
// presets (which include decades like 80s/90s AND non-decade vibes like a
// classy wine bar crawl) OR fully custom text typed by the user.
export type ThemeOption = {
  id: string;
  label: string;
  emoji: string;
  category: "decade" | "vibe" | "custom";
  accent: string; // tailwind color token e.g. 'plasma'
  vibe: string;
  searchKeywords: string[]; // biases Places text search toward this theme
  styleHint: string; // short descriptor shown in UI (music/décor/etc.)
};

export type Intensity = "mild" | "spicy" | "wild";

export type CrawlFilters = {
  occasionId: string | null;
  themeId: string | null; // preset id, or "custom" when using free text
  customThemeText: string; // raw text when the user types their own theme
  preferOutdoor: boolean; // prefer outdoor seating, but not required
  groupSize: number;
  stopCount: number; // number of bars in the crawl
  maxWalkMeters: number;
  intensity: Intensity;
  crawlLocation: string; // where user wants to start/stay (e.g., "Brooklyn", "Downtown")
};

export type BarStop = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  userRatingCount: number | null;
  outdoorSeating: boolean | null;
  priceLevel: string | null;
  lat: number;
  lng: number;
  photoUrl: string | null;
  isOpenNow: boolean | null;
  mapsUri: string | null;
};

export type GamePrompt = {
  id: string;
  type: "never-have-i-ever" | "truth" | "dare" | "would-you-rather" | "on-the-spot";
  intensity: Intensity;
  text: string;
};
