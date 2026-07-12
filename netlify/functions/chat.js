const ALLOWED_ORIGINS = new Set([
  "https://7ya.io",
  "https://www.7ya.io",
]);

const buildHeaders = (origin) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
};

const jsonResponse = (statusCode, payload, headers) => ({
  statusCode,
  headers,
  body: JSON.stringify(payload),
});

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const headers = buildHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
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
    return jsonResponse(400, { error: "Invalid JSON payload" }, headers);
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.message !== "string" ||
    body.message.trim().length === 0 ||
    body.message.length > 4000
  ) {
    return jsonResponse(
      422,
      {
        error: "Invalid request payload",
        details: "message must be a non-empty string up to 4000 characters",
      },
      headers,
    );
  }

  try {
    console.log("Processing chat request", {
      messageLength: body.message.length,
      origin: origin || "direct",
    });

    return jsonResponse(
      200,
      {
        status: "success",
        received: {
          message: body.message,
        },
      },
      headers,
    );
  } catch (error) {
    console.error("Failed to process chat request", error);

    return jsonResponse(500, { error: "Failed to process request" }, headers);
  }
};
