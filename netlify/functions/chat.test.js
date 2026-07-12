import test from "node:test";
import assert from "node:assert/strict";

import { handler } from "./chat.js";

const request = ({
  method = "POST",
  body = JSON.stringify({ message: "hello" }),
  origin = "https://7ya.io",
} = {}) => ({
  httpMethod: method,
  body,
  headers: origin ? { origin } : {},
});

test("OPTIONS returns 204 with browser CORS headers", async () => {
  const response = await handler(request({ method: "OPTIONS", body: null }));

  assert.equal(response.statusCode, 204);
  assert.equal(response.body, "");
  assert.equal(response.headers["Access-Control-Allow-Origin"], "https://7ya.io");
  assert.match(response.headers["Access-Control-Allow-Methods"], /POST/);
});

test("valid JSON POST returns 200", async () => {
  const response = await handler(request());
  const payload = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(payload.status, "success");
  assert.equal(payload.received.message, "hello");
});

test("invalid JSON returns 400", async () => {
  const response = await handler(request({ body: "{" }));

  assert.equal(response.statusCode, 400);
  assert.equal(JSON.parse(response.body).error, "Invalid JSON payload");
});

test("invalid message payload returns 422", async () => {
  const response = await handler(request({ body: JSON.stringify({ message: "" }) }));

  assert.equal(response.statusCode, 422);
  assert.equal(JSON.parse(response.body).error, "Invalid request payload");
});

test("GET returns 405 with Allow header", async () => {
  const response = await handler(request({ method: "GET", body: null }));

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "POST, OPTIONS");
});

test("unknown origins do not receive Access-Control-Allow-Origin", async () => {
  const response = await handler(request({ origin: "https://example.com" }));

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["Access-Control-Allow-Origin"], undefined);
});
