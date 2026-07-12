// Netlify Function: GET /.netlify/functions/photo?ref=<google photo resource name>&w=<width>
// Streams a bar photo from Google Places back to the client without ever
// exposing GOOGLE_PLACES_API_KEY in a client-visible URL.

export const handler = async (event: any) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: "Server is missing GOOGLE_PLACES_API_KEY.",
    };
  }

  const ref = event.queryStringParameters?.ref;
  const width = event.queryStringParameters?.w ?? "500";

  if (!ref) {
    return {
      statusCode: 400,
      body: "Missing 'ref' query param.",
    };
  }

  const googleUrl = `https://places.googleapis.com/v1/${ref}/media?maxWidthPx=${encodeURIComponent(
    width
  )}&key=${apiKey}`;

  let googleRes: Response;
  try {
    googleRes = await fetch(googleUrl);
  } catch {
    return {
      statusCode: 502,
      body: "Could not reach Google Places API.",
    };
  }

  if (!googleRes.ok || !googleRes.body) {
    return {
      statusCode: googleRes.status || 502,
      body: "Photo not found.",
    };
  }

  // Convert ReadableStream to buffer for Netlify
  const buffer = await googleRes.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": googleRes.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
    body: base64,
    isBase64Encoded: true,
  };
};
