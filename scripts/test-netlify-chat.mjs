import assert from "node:assert/strict";
import { handler } from "../netlify/functions/chat.js";

const WEB_ORIGIN = "https://7ya.io";
const MUSEUM_ORIGIN =
  "https://igor-7ya-digital-museum.igor-vepretski.chatgpt.site";

function parseBody(response) {
  return response.body ? JSON.parse(response.body) : null;
}

const options = await handler({
  httpMethod: "OPTIONS",
  headers: {
    origin: WEB_ORIGIN,
    "access-control-request-method": "POST",
    "access-control-request-headers": "content-type",
  },
});
assert.equal(options.statusCode, 204);
assert.equal(options.body, "");
assert.equal(options.headers["Access-Control-Allow-Origin"], WEB_ORIGIN);
assert.match(options.headers["Access-Control-Allow-Methods"], /POST/);
assert.match(options.headers["Access-Control-Allow-Headers"], /content-type/i);
assert.equal(options.headers["Access-Control-Max-Age"], "86400");
assert.equal(options.headers.Vary, "Origin");

const message = "healthcheck-do-not-echo";
const post = await handler({
  httpMethod: "POST",
  headers: { origin: WEB_ORIGIN },
  body: JSON.stringify({ message }),
});
assert.equal(post.statusCode, 200);
assert.equal(post.headers["Access-Control-Allow-Origin"], WEB_ORIGIN);
assert.equal(post.headers["Cache-Control"], "no-store");
assert.deepEqual(parseBody(post), { ok: true, status: "success" });
assert.equal(post.body.includes(message), false);

const museumPost = await handler({
  httpMethod: "POST",
  headers: { origin: MUSEUM_ORIGIN },
  body: JSON.stringify({ message: "hello" }),
});
assert.equal(museumPost.statusCode, 200);
assert.equal(
  museumPost.headers["Access-Control-Allow-Origin"],
  MUSEUM_ORIGIN,
);

const serverToServer = await handler({
  httpMethod: "POST",
  headers: {},
  body: JSON.stringify({ message: "hello" }),
});
assert.equal(serverToServer.statusCode, 200);
assert.equal(serverToServer.headers["Access-Control-Allow-Origin"], undefined);

const invalid = await handler({ httpMethod: "POST", headers: {}, body: "{" });
assert.equal(invalid.statusCode, 400);

const missing = await handler({
  httpMethod: "POST",
  headers: {},
  body: JSON.stringify({ message: "" }),
});
assert.equal(missing.statusCode, 422);

const tooLong = await handler({
  httpMethod: "POST",
  headers: {},
  body: JSON.stringify({ message: "x".repeat(4001) }),
});
assert.equal(tooLong.statusCode, 413);

const get = await handler({ httpMethod: "GET", headers: {} });
assert.equal(get.statusCode, 405);
assert.equal(get.headers.Allow, "POST, OPTIONS");

const forbidden = await handler({
  httpMethod: "OPTIONS",
  headers: { origin: "https://evil.example" },
});
assert.equal(forbidden.statusCode, 403);
assert.equal(forbidden.headers["Access-Control-Allow-Origin"], undefined);

console.log("7ya-api handler contract: PASS");
