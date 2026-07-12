const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...jsonHeaders, Allow: "POST" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Invalid JSON payload" }),
    };
  }

  try {
    console.log("Processing chat request", {
      hasMessage: typeof body.message === "string",
    });

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ status: "success", received: body }),
    };
  } catch (error) {
    console.error("Failed to process chat request", error);

    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
};
