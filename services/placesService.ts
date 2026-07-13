import { BarStop, CrawlFilters, ThemeOption } from "../types";

// Thin client: all Google Places API access (and the API key) lives
// server-side in app/places+api.ts and app/places/photo+api.ts. This file
// just calls our own /places endpoint — nothing here ever touches a secret.

export class PlacesApiError extends Error {}

type SearchArgs = {
  filters: CrawlFilters;
  theme: ThemeOption | null;
  coords: { latitude: number; longitude: number } | null;
  cityText?: string; // fallback if no GPS coords / user typed a city
};

export async function searchBars({
  filters,
  theme,
  coords,
  cityText,
}: SearchArgs): Promise<BarStop[]> {
  let res: Response;
  try {
    // Call Netlify Function (same site, no CORS issues)
    // Detects environment: localhost for dev, production URL for live
    const apiUrl =
      typeof window === "undefined" || process.env.NODE_ENV === "development"
        ? "http://localhost:8888/.netlify/functions/places"
        : "https://cosmiccrawl.netlify.app/.netlify/functions/places";

    res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filters: {
          preferOutdoor: filters.preferOutdoor,
          stopCount: filters.stopCount,
          maxWalkMeters: filters.maxWalkMeters,
          intensity: filters.intensity,
        },
        theme: theme
          ? {
              id: theme.id,
              label: theme.label,
              emoji: theme.emoji,
              searchKeywords: theme.searchKeywords,
            }
          : null,
        coords,
        cityText,
      }),
    });
  } catch {
    throw new PlacesApiError(
      "Couldn't reach the crawl server. Check your connection and try again."
    );
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new PlacesApiError("The crawl server returned an unexpected response.");
  }

  if (!res.ok) {
    throw new PlacesApiError(data?.error ?? `Server error (${res.status}).`);
  }

  return (data.stops ?? []) as BarStop[];
}
