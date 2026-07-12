import { ThemeOption } from "../types";

// Curated theme presets. "decade" themes give the crawl an era vibe;
// "vibe" themes are venue-style aesthetics unrelated to any decade.
// Users can also skip all of these and type their own custom theme —
// see the "custom" builder at the bottom of this file.
export const THEMES: ThemeOption[] = [
  // ---- Decades ----
  {
    id: "60s",
    label: "Groovy 60s",
    emoji: "☮️",
    category: "decade",
    accent: "acid",
    vibe: "Psychedelic, peace-and-love, flower power lounges.",
    searchKeywords: ["retro lounge", "tiki bar", "speakeasy"],
    styleHint: "Motown, psych-rock, soul",
  },
  {
    id: "70s",
    label: "Disco 70s",
    emoji: "🕺",
    category: "decade",
    accent: "plasma",
    vibe: "Mirror balls, velvet booths, disco fever.",
    searchKeywords: ["disco bar", "cocktail lounge", "dance bar"],
    styleHint: "Disco, funk, classic rock",
  },
  {
    id: "80s",
    label: "Neon 80s",
    emoji: "📼",
    category: "decade",
    accent: "ufo",
    vibe: "Synth-soaked, arcade-lit, neon-drenched dive bars.",
    searchKeywords: ["arcade bar", "dive bar", "karaoke bar"],
    styleHint: "Synth-pop, hair metal, new wave",
  },
  {
    id: "90s",
    label: "Grunge 90s",
    emoji: "📟",
    category: "decade",
    accent: "nebula",
    vibe: "Flannel, dive bars, jukebox grunge.",
    searchKeywords: ["dive bar", "pub", "sports bar"],
    styleHint: "Grunge, hip-hop, R&B",
  },
  {
    id: "2000s",
    label: "Y2K 2000s",
    emoji: "💿",
    category: "decade",
    accent: "starlight",
    vibe: "Glitter, low-rise, bling-era rooftop bars.",
    searchKeywords: ["rooftop bar", "lounge", "nightclub"],
    styleHint: "Pop-punk, bling-era hip-hop",
  },
  {
    id: "2010s",
    label: "Hipster 2010s",
    emoji: "🤳",
    category: "decade",
    accent: "cap",
    vibe: "Craft cocktails, exposed brick, Edison bulbs.",
    searchKeywords: ["craft cocktail bar", "gastropub", "brewery"],
    styleHint: "Indie, EDM, mumble rap",
  },

  // ---- Non-decade vibes ----
  {
    id: "wine-bar",
    label: "Fancy Wine Bar",
    emoji: "🍷",
    category: "vibe",
    accent: "cap",
    vibe: "Elevated, low-lit, swirl-and-sip sophistication.",
    searchKeywords: ["wine bar", "natural wine bar", "wine lounge"],
    styleHint: "Jazz, lounge, soft acoustic",
  },
  {
    id: "classy-pub",
    label: "Classy Pub",
    emoji: "🍺",
    category: "vibe",
    accent: "starlight",
    vibe: "Dark wood, good whiskey, unpretentious charm.",
    searchKeywords: ["gastropub", "whiskey bar", "traditional pub"],
    styleHint: "Classic rock, folk",
  },
  {
    id: "speakeasy",
    label: "Secret Speakeasy",
    emoji: "🕵️",
    category: "vibe",
    accent: "nebula",
    vibe: "Hidden doors, candlelight, hush-hush cocktails.",
    searchKeywords: ["speakeasy", "hidden bar", "prohibition bar"],
    styleHint: "1920s jazz, swing",
  },
  {
    id: "tiki",
    label: "Tropical Tiki",
    emoji: "🌺",
    category: "vibe",
    accent: "acid",
    vibe: "Rum-forward, flaming garnishes, island escape.",
    searchKeywords: ["tiki bar", "rum bar", "tropical bar"],
    styleHint: "Surf rock, island vibes",
  },
  {
    id: "rooftop",
    label: "Rooftop & Views",
    emoji: "🌆",
    category: "vibe",
    accent: "ufo",
    vibe: "Skyline views, string lights, elevated cocktails.",
    searchKeywords: ["rooftop bar", "sky bar", "terrace bar"],
    styleHint: "Chill house, lounge",
  },
  {
    id: "dive-bar",
    label: "Classic Dive Bar",
    emoji: "🎱",
    category: "vibe",
    accent: "plasma",
    vibe: "Cheap beer, pool tables, zero pretension.",
    searchKeywords: ["dive bar", "pool hall bar", "neighborhood bar"],
    styleHint: "Jukebox classics",
  },
  {
    id: "brewery",
    label: "Craft Brewery Crawl",
    emoji: "🍻",
    category: "vibe",
    accent: "starlight",
    vibe: "Flights, hops, taproom picnic tables.",
    searchKeywords: ["craft brewery", "taproom", "beer garden"],
    styleHint: "Indie rock, easy listening",
  },
  {
    id: "karaoke",
    label: "Karaoke Night",
    emoji: "🎤",
    category: "vibe",
    accent: "plasma",
    vibe: "Mic in hand, liquid courage, main character energy.",
    searchKeywords: ["karaoke bar", "karaoke lounge"],
    styleHint: "Whatever's on the songbook",
  },
];

export const DECADE_THEMES = THEMES.filter((t) => t.category === "decade");
export const VIBE_THEMES = THEMES.filter((t) => t.category === "vibe");

/** Builds a ThemeOption on the fly from whatever the user typed. */
export function buildCustomTheme(rawText: string): ThemeOption {
  const text = rawText.trim();
  return {
    id: "custom",
    label: text || "Custom theme",
    emoji: "✨",
    category: "custom",
    accent: "nebula",
    vibe: text,
    searchKeywords: [text || "bar"],
    styleHint: "Whatever you typed",
  };
}
