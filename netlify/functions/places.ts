// Netlify Function: POST /.netlify/functions/places
// Holds the Google Places API key server-side (process.env.GOOGLE_PLACES_API_KEY)
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

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "[places] Missing GOOGLE_PLACES_API_KEY. Set it in Netlify env vars (no EXPO_PUBLIC_ prefix)."
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server is missing GOOGLE_PLACES_API_KEY. Set it in Netlify environment variables.",
      }),
    };
  }

  let body: Partial<SearchRequestBody> = {};
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body." }),
    };
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
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Could not reach Google Places API." }),
    };
  }

  if (!googleRes.ok) {
    const errText = await googleRes.text().catch(() => "");
    console.error(
      `[places] Google Places API error (${googleRes.status}):`,
      errText || googleRes.statusText
    );
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: `Places API error (${googleRes.status}): ${errText || googleRes.statusText}`,
      }),
    };
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
    photoUrl:
      p.photos && p.photos.length > 0
        ? `https://cosmiccrawl.netlify.app/.netlify/functions/photo?ref=${encodeURIComponent(p.photos[0].name)}&w=500`
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

  return {
    statusCode: 200,
    body: JSON.stringify({ stops: stops.slice(0, filters.stopCount) }),
  };
};
