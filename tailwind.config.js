/** @type {import('tailwindcss').Config} */
module.exports = {
  // "class" (not the default "media") avoids a crash on web: Expo's
  // userInterfaceStyle: "dark" forces the color scheme imperatively on
  // startup, which throws unless darkMode is "class". We don't use any
  // dark: variants — Cosmic Crawl is always dark-themed — this just lets
  // the imperative set() call succeed instead of throwing.
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ~~ Cosmic Crawl palette: deep space + glowing shroom neon ~~
        void: {
          DEFAULT: "#0B0033",
          light: "#1A0B4D",
          dark: "#050019",
        },
        nebula: {
          DEFAULT: "#7B2FF7",
          light: "#A45CFF",
          dark: "#5A1FC9",
        },
        plasma: {
          DEFAULT: "#FF2E9F",
          light: "#FF6FC0",
          dark: "#D6127E",
        },
        acid: {
          DEFAULT: "#B4FF39",
          light: "#D2FF8C",
          dark: "#8FDB12",
        },
        ufo: {
          DEFAULT: "#00F0FF",
          light: "#7CFBFF",
          dark: "#00B8C4",
        },
        starlight: "#FFD23F",
        cap: "#FF6B35",
      },
      fontFamily: {
        display: ["System"],
      },
    },
  },
  plugins: [],
};
