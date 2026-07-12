# 🍄🛸 Cosmic Crawl

A theme-your-own-way, 18+ pub crawl planner built with **Expo (React Native)**
and **NativeWind (Tailwind CSS for RN)**. Pick an occasion (birthday, date
night, bachelorette, etc.), then pick *any* theme — a decade (60s–2010s), a
vibe preset (Fancy Wine Bar, Classy Pub, Speakeasy, Tiki, Rooftop, Dive Bar,
Brewery Crawl, Karaoke), or just type your own ("goth industrial," "classy
wine bar crawl," anything) — plus filters like outdoor seating and group size.
It builds a crawl of real nearby bars via the Google Places API. Includes an
18+ "on the spot" adult party/drinking game deck for between stops.

> **This app is for adults 18+.** It contains R-rated party game content
> (flirty truth/dare, spicy "never have I ever," etc.) gated behind an
> age-confirmation screen.

## Features

- **Age gate** — must confirm 18+ before entering the app.
- **Occasion picker** — birthday, bachelor/bachelorette, date night, girls'/guys'
  night, breakup rebound, promotion, graduation, or "just because."
- **Theme picker** — decade presets (60s Groovy, 70s Disco, 80s Neon, 90s
  Grunge, Y2K 2000s, Hipster 2010s), vibe presets (Fancy Wine Bar, Classy Pub,
  Speakeasy, Tiki, Rooftop, Dive Bar, Brewery Crawl, Karaoke), **or** a free
  text field to type absolutely any theme you want — it overrides the presets
  and drives the bar search directly.
- **Filters** — outdoor seating only, crawl length (3–6 stops), group size,
  and game intensity (Mild / Spicy / Wild).
- **Real bar data** via Google Places API (New) `searchText`, including rating,
  address, open-now status, photo, and outdoor seating flag — fetched through
  a small server endpoint bundled with the app, so the API key never ships
  inside the client (see "API key security" below).
- **Crawl + bar detail screens** — mark stops visited, open in Google Maps.
- **18+ games screen** — shuffled deck of adult party prompts (Never Have I
  Ever, Truth, Dare, Would You Rather, On-The-Spot group challenges) filterable
  by intensity.
- **Funky/spacey theme** — deep-space gradients, neon plasma pink, acid green,
  UFO cyan, starlight gold — all defined as Tailwind tokens via NativeWind.

## Tech stack

- Expo SDK 56 (React Native 0.85, React 19) + Expo Router (file-based navigation)
- NativeWind v4 (Tailwind CSS classes on React Native components)
- TypeScript
- Google Places API (New) for venue search
- expo-location, AsyncStorage, expo-linear-gradient

All native package versions in `package.json` are pinned to the exact set
Expo SDK 56 ships and tests together (per Expo's `bundledNativeModules.json`),
including the `react-native-reanimated` ↔ `react-native-worklets` pairing
that NativeWind's styling engine depends on internally. If you bump the Expo
SDK later, run `npx expo install --fix` to re-align everything, and re-check
that `react-native-reanimated` and `react-native-worklets` versions still
match each other (Reanimated pins an exact Worklets major/minor it expects —
mismatches there are the most common source of Metro/Babel errors in this
stack).

## API key security

The Google Places API key is **never** stored on-device and never shipped
inside the app bundle. It lives only in a server-side environment variable
(`GOOGLE_PLACES_API_KEY`, no `EXPO_PUBLIC_` prefix) that's read inside two
Expo Router [API routes](https://docs.expo.dev/router/web/api-routes/):

- `app/places+api.ts` — proxies bar search requests to Google.
- `app/places/photo+api.ts` — proxies/streams bar photos from Google.

The app (`services/placesService.ts`) only ever calls its own `/places`
endpoint. This works identically for the web build, and for iOS/Android once
the server is deployed and its URL is wired up (see "Deploying" below).

`EXPO_PUBLIC_`-prefixed env vars and anything saved via AsyncStorage/Settings
get compiled directly into the client bundle — readable by anyone who
inspects the app or intercepts its traffic. Don't put the Places key in
either of those for a real deployment.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   npx expo install --fix   # aligns native package versions with your Expo SDK
   ```

2. **Get a Google Places API key**

   - Go to [Google Cloud Console](https://console.cloud.google.com/), create/select
     a project, and enable **"Places API (New)"**.
   - Create an API key (restrict it to Places API for safety).
   - Copy `.env.example` to `.env` and paste your key into
     `GOOGLE_PLACES_API_KEY` (no `EXPO_PUBLIC_` prefix — see "API key
     security" above for why).

3. **Run it**

   ```bash
   npx expo start
   ```

   Scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a
   simulator, or `w` for web. In development, `/places` requests are
   automatically routed to your local dev server, so this works immediately
   with no extra config.

## Deploying

Because this app has server code (the API routes), you deploy a server
alongside the client — not just static files.

1. **Deploy the server first.** The simplest path is
   [EAS Hosting](https://docs.expo.dev/eas/hosting/get-started):

   ```bash
   npx expo export -p web
   eas deploy
   ```

   Set `GOOGLE_PLACES_API_KEY` as an environment variable on whatever host
   runs this server (EAS Hosting project settings, or your platform's env var
   config if using Express/Vercel/Netlify/Bun — see Expo's
   [hosting guide](https://docs.expo.dev/router/web/api-routes/#hosting-on-third-party-services)
   for adapters to those).

2. **Point native builds at that server.** For the iOS/Android app to reach
   `/places` in production (not just the web build), set the deployed
   server's URL as the `origin` in `app.json`:

   ```json
   {
     "plugins": [
       ["expo-router", { "origin": "https://your-deployed-url.example.com" }]
     ]
   }
   ```

   Or skip manual wiring entirely and let EAS auto-link a versioned deploy on
   every build by setting `EXPO_UNSTABLE_DEPLOY_SERVER=1` in `.env` and
   running `eas build` — see Expo's
   [native deployment docs](https://docs.expo.dev/router/web/api-routes/#native-deployment)
   for the full flow.

3. **Harden the endpoint before going fully public.** `/places` is reachable
   by anyone who finds the URL, not just your app — it'll burn through your
   Google API quota if scraped. Consider adding rate limiting, a shared
   secret header the app sends, or Google's
   [API key restrictions](https://developers.google.com/maps/api-security-best-practices)
   scoped to your server's IP, before shipping to real users at scale.

## Troubleshooting

**`Cannot manually set color scheme, as dark mode is type 'media'` (web only)**

This is a known NativeWind + Expo web issue: `app.json` sets
`userInterfaceStyle: "dark"` to force the app dark, which makes Expo call
`Appearance.setColorScheme('dark')` on startup — but NativeWind's web runtime
only allows that imperative call when `darkMode` is set to `"class"` in
`tailwind.config.js` (its default is `"media"`, which only supports the CSS
`prefers-color-scheme` query, not manual overrides). Already fixed here via
`darkMode: "class"` in `tailwind.config.js`. Cosmic Crawl doesn't use any
`dark:` variants, so this has no visual effect — it just stops the crash.

**`npm error ERESOLVE ... peer react-native@"X - Y" from react-native-worklets@Z`**

This means `react-native-worklets` (or `react-native-reanimated`) resolved to
a version that expects a different React Native version than what's pinned in
`package.json`. It usually happens if a dependency version was left
unpinned/wildcarded and npm grabbed whatever's newest on the registry instead
of the version Expo actually tested. Fix: run `npx expo install --fix`, which
re-resolves every native package to the exact version compatible with the
`expo` version in your `package.json`. If that still fails, delete
`node_modules` and `package-lock.json` and run `npm install` fresh.

**`[BABEL] ... Cannot find module 'react-native-worklets/plugin'`**

This means `react-native-reanimated` or NativeWind's `react-native-css-interop`
expects the separate `react-native-worklets` package but it isn't installed.
`react-native-worklets` is already listed in `package.json` here — if you
still hit this, run `npx expo install react-native-worklets` then
`npx expo start --clear`. Don't manually add `'react-native-reanimated/plugin'`
or `'react-native-worklets/plugin'` to `babel.config.js` — `babel-preset-expo`
already wires it up automatically, and a duplicate entry causes this same
error.

## Project structure

```
app/                 Expo Router screens (file-based routes)
  index.tsx           Age gate (18+)
  onboarding.tsx       Occasion + theme + filters picker
  results.tsx          Generated crawl (list of bars)
  bar/[id].tsx          Bar detail screen
  games.tsx            18+ party game deck
  settings.tsx          About / reset (no key entry — see below)
  places+api.ts          SERVER route: proxies bar search to Google
  places/photo+api.ts     SERVER route: proxies bar photos to Google
components/          Reusable UI (cards, chips, gradient background)
constants/           Theme tokens, occasions, theme presets, game prompt dataset
context/             React Context for shared crawl state
services/            Thin client for /places + AsyncStorage helpers (age gate, filters)
types/               Shared TypeScript types
tailwind.config.js   Custom "cosmic" color palette (void/nebula/plasma/acid/ufo/starlight)
```

Files ending in `+api.ts` are server-only: Expo Router strips them (and
anything they import) from the client bundle automatically, which is what
keeps `GOOGLE_PLACES_API_KEY` out of the app. See "API key security" above.

Note: `constants/decades.ts` and `components/DecadeCard.tsx` are thin
deprecated re-exports kept only for backwards compatibility — the real theme
system lives in `constants/themes.ts` and `components/ThemeCard.tsx`.

## Notes & limitations

- Google Places doesn't know a bar's "theme" — the app biases its search query
  with theme-flavored keywords (e.g. "arcade bar," "disco bar," "wine bar,"
  or literally whatever you typed, plus "with outdoor seating" if that filter
  is on) rather than guaranteeing an exact themed venue. Treat the theme pick
  as a vibe/skin for your night, and use your own judgment on which stops
  actually nail it.
- The `outdoorSeating` field isn't populated by Google for every venue. If a
  strict outdoor-only filter returns nothing, the app falls back to showing
  the keyword-biased results rather than an empty screen.
- This app does have a backend now: the two `+api.ts` server routes. Local
  dev and web both work out of the box; native (iOS/Android) production
  builds need the server deployed and `origin` configured — see "Deploying."
- This is a planning tool, not a delivery service — always drink responsibly,
  arrange safe transportation, and look out for your group.

## Customizing

- **Colors**: edit `tailwind.config.js` → `theme.extend.colors`.
- **Occasions**: edit `constants/occasions.ts`.
- **Theme presets / search keywords**: edit `constants/themes.ts` (add new
  decade or vibe entries — each needs `searchKeywords` used to bias the bar
  search).
- **Game prompts**: edit `constants/gamePrompts.ts` — add/remove lines per
  intensity and type.
