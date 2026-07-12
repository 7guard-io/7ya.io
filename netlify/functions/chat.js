const allowedOrigins = new Set([
  "https://7ya.io",
  "https://igor-7ya-digital-museum.igor-vepretski.chatgpt.site",
]);

const getOrigin = (event) =>
  event.headers?.origin || event.headers?.Origin || "";

const jsonHeaders = (origin) => ({
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  ...(origin && allowedOrigins.has(origin)
    ? { "Access-Control-Allow-Origin": origin }
    : {}),
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

export const handler = async (event) => {
  const origin = getOrigin(event);
  const headers = jsonHeaders(origin);

  if (origin && !allowedOrigins.has(origin)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: "Origin Not Allowed" }),
    };
  }

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...headers, Allow: "POST, OPTIONS" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON payload" }),
    };
  }

  if (typeof body.message !== "string" || body.message.trim().length === 0) {
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ error: "message must be a non-empty string" }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: "success",
      received: { message: body.message.trim() },
    }),
  };
};
