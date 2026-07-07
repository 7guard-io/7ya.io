export function corsHeaders() {
  return {
    "access-control-allow-origin": process.env.FRONTEND_ORIGIN || "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-max-age": "86400"
  };
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...corsHeaders(),
      ...extraHeaders
    }
  });
}

export function empty(status = 204) {
  return new Response(null, {
    status,
    headers: corsHeaders()
  });
}

export async function readJson(req) {
  try {
    return await req.json();
  } catch {
    const err = new Error("Invalid JSON body");
    err.status = 400;
    throw err;
  }
}

export function requireMethod(req, allowed) {
  if (req.method === "OPTIONS") {
    return empty();
  }

  if (!allowed.includes(req.method)) {
    return json(
      {
        ok: false,
        error: "method_not_allowed"
      },
      405,
      {
        allow: allowed.join(", ")
      }
    );
  }

  return null;
}

export function handleError(error) {
  console.error(error);

  return json(
    {
      ok: false,
      error: error.publicMessage || "internal_error"
    },
    error.status || 500
  );
}
