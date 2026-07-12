const DEFAULT_ALLOWED_ORIGINS = [
  "https://7ya.io",
  "https://igor-7ya-digital-museum.igor-vepretski.chatgpt.site",
];

const MAX_MESSAGE_LENGTH = 4000;

function allowedOrigins() {
  const configured = String(process.env.FRONTEND_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set(configured.length ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function requestOrigin(event) {
  return event.headers?.origin || event.headers?.Origin || "";
}

function corsHeaders(origin, origins) {
  return {
    ...(origin && origins.has(origin)
      ? { "Access-Control-Allow-Origin": origin }
      : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(statusCode, payload, origin, origins, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin, origins),
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  };
}

export const handler = async (event) => {
  const origins = allowedOrigins();
  const origin = requestOrigin(event);

  if (origin && !origins.has(origin)) {
    return jsonResponse(403, { error: "Origin Not Allowed" }, origin, origins);
  }

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(origin, origins),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(
      405,
      { error: "Method Not Allowed" },
      origin,
      origins,
      { Allow: "POST, OPTIONS" },
    );
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON payload" }, origin, origins);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return jsonResponse(
      422,
      { error: "message must be a non-empty string" },
      origin,
      origins,
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      413,
      { error: `message must be at most ${MAX_MESSAGE_LENGTH} characters` },
      origin,
      origins,
    );
  }

  // Never log or echo the full message. Production evidence stays metadata-only.
  console.log("Processing chat request", { messageLength: message.length });

  return jsonResponse(
    200,
    { ok: true, status: "success" },
    origin,
    origins,
  );
};
