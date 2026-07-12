// Server-only route: GET /places/photo?ref=<google photo resource name>&w=<width>
// Streams a bar photo from Google Places back to the client without ever
// exposing GOOGLE_PLACES_API_KEY in a client-visible URL.

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return new Response("Server is missing GOOGLE_PLACES_API_KEY.", { status: 500 });
  }

  const url = new URL(request.url);
  const ref = url.searchParams.get("ref");
  const width = url.searchParams.get("w") ?? "500";

  if (!ref) {
    return new Response("Missing 'ref' query param.", { status: 400 });
  }

  const googleUrl = `https://places.googleapis.com/v1/${ref}/media?maxWidthPx=${encodeURIComponent(
    width
  )}&key=${apiKey}`;

  let googleRes: Response;
  try {
    googleRes = await fetch(googleUrl);
  } catch {
    return new Response("Could not reach Google Places API.", { status: 502 });
  }

  if (!googleRes.ok || !googleRes.body) {
    return new Response("Photo not found.", { status: googleRes.status || 502 });
  }

  return new Response(googleRes.body, {
    headers: {
      "Content-Type": googleRes.headers.get("content-type") ?? "image/jpeg",
      // Photos are static Google-hosted assets — safe to cache for a day.
      "Cache-Control": "public, max-age=86400",
    },
  });
}
