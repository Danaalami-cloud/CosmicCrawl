// Server-only route: POST /places
// Holds the Google Places API key server-side (process.env.GOOGLE_PLACES_API_KEY,
// NOT prefixed with EXPO_PUBLIC_) so it never ships inside the client bundle.
// The client (services/placesService.ts) POSTs its search filters here instead
// of calling Google directly.

type Intensity = "mild" | "spicy" | "wild";

type ThemeOption = {
  id: string;
  label: string;
  emoji: string;
  searchKeywords: string[];
};

type CrawlFilters = {
  preferOutdoor: boolean;
  stopCount: number;
  maxWalkMeters: number;
  intensity: Intensity;
};

type SearchRequestBody = {
  filters: CrawlFilters;
  theme: ThemeOption | null;
  coords: { latitude: number; longitude: number } | null;
  cityText?: string;
};

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.currentOpeningHours.openNow",
  "places.photos",
  "places.outdoorSeating",
  "places.googleMapsUri",
].join(",");

function buildTextQuery(theme: ThemeOption | null, outdoorOnly: boolean, cityText?: string) {
  const keyword =
    theme && theme.searchKeywords.length > 0
      ? theme.searchKeywords[Math.floor(Math.random() * theme.searchKeywords.length)]
      : "bar";
  const outdoorPart = outdoorOnly ? " with outdoor seating" : "";
  const locationPart = cityText ? ` in ${cityText}` : "";
  return `${keyword}${outdoorPart}${locationPart}`.trim();
}

export async function POST(request: Request) {
  // .trim() guards against a common copy/paste gotcha: a trailing newline or
  // stray space in .env making the key non-empty but invalid.
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "[places+api] Missing GOOGLE_PLACES_API_KEY. Checked process.env — got:",
      JSON.stringify(process.env.GOOGLE_PLACES_API_KEY)
    );
    return Response.json(
      {
        error:
          "Server is missing GOOGLE_PLACES_API_KEY. Set it as a server-side env var (no EXPO_PUBLIC_ prefix) in .env, then fully restart `npx expo start` — env vars are only read at server startup.",
      },
      { status: 500 }
    );
  }

  let body: Partial<SearchRequestBody> = {};
  try {
    body = (await request.json()) ?? {};
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const theme = body.theme ?? null;
  const coords = body.coords ?? null;
  const cityText = body.cityText;
  const filters: CrawlFilters = {
    preferOutdoor: body.filters?.preferOutdoor ?? false,
    stopCount: body.filters?.stopCount ?? 4,
    maxWalkMeters: body.filters?.maxWalkMeters ?? 1500,
    intensity: body.filters?.intensity ?? "spicy",
  };
  const origin = new URL(request.url).origin;

  const googleBody: Record<string, unknown> = {
    textQuery: buildTextQuery(theme, filters.preferOutdoor, cityText),
    includedType: "bar",
    maxResultCount: 20,
    minRating: 3.5,
  };

  if (coords) {
    googleBody.locationBias = {
      circle: {
        center: { latitude: coords.latitude, longitude: coords.longitude },
        radius: Math.max(filters.maxWalkMeters, 500),
      },
    };
  }

  let googleRes: Response;
  try {
    googleRes = await fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(googleBody),
    });
  } catch {
    return Response.json({ error: "Could not reach Google Places API." }, { status: 502 });
  }

  if (!googleRes.ok) {
    const errText = await googleRes.text().catch(() => "");
    console.error(
      `[places+api] Google Places API error (${googleRes.status}):`,
      errText || googleRes.statusText
    );
    return Response.json(
      { error: `Places API error (${googleRes.status}): ${errText || googleRes.statusText}` },
      { status: 502 }
    );
  }

  const data = await googleRes.json();
  const places: any[] = data.places ?? [];

  let stops = places.map((p) => ({
    id: p.id,
    name: p.displayName?.text ?? "Unnamed Bar",
    address: p.formattedAddress ?? "",
    rating: p.rating ?? null,
    userRatingCount: p.userRatingCount ?? null,
    outdoorSeating: p.outdoorSeating ?? null,
    priceLevel: p.priceLevel ?? null,
    lat: p.location?.latitude ?? 0,
    lng: p.location?.longitude ?? 0,
    // Never expose the raw Google photo URL (it embeds the API key) — route
    // it through our own /places/photo proxy instead.
    photoUrl:
      p.photos && p.photos.length > 0
        ? `${origin}/places/photo?ref=${encodeURIComponent(p.photos[0].name)}&w=500`
        : null,
    isOpenNow: p.currentOpeningHours?.openNow ?? null,
    mapsUri: p.googleMapsUri ?? null,
  }));

  if (filters.preferOutdoor) {
    const knownOutdoor = stops.filter((s) => s.outdoorSeating === true);
    // If Google just didn't populate the field for most results, don't nuke
    // the list — fall back to all results and let outdoor preference be a bonus.
    stops = knownOutdoor.length > 0 ? knownOutdoor : stops;
  }

  return Response.json({ stops: stops.slice(0, filters.stopCount) });
}