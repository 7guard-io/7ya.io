import assert from "node:assert/strict";
import { handler } from "./netlify/functions/chat.js";

const post = await handler({
  httpMethod: "POST",
  headers: { origin: "https://7ya.io" },
  body: JSON.stringify({ message: "hello" }),
});
assert.equal(post.statusCode, 200);
assert.equal(post.headers["Access-Control-Allow-Origin"], "https://7ya.io");

const museumPost = await handler({
  httpMethod: "POST",
  headers: {
    origin: "https://igor-7ya-digital-museum.igor-vepretski.chatgpt.site",
  },
  body: JSON.stringify({ message: "hello" }),
});
assert.equal(museumPost.statusCode, 200);
assert.equal(
  museumPost.headers["Access-Control-Allow-Origin"],
  "https://igor-7ya-digital-museum.igor-vepretski.chatgpt.site",
);

const invalid = await handler({ httpMethod: "POST", body: "{" });
assert.equal(invalid.statusCode, 400);

const missing = await handler({
  httpMethod: "POST",
  body: JSON.stringify({ message: "" }),
});
assert.equal(missing.statusCode, 422);

const get = await handler({ httpMethod: "GET" });
assert.equal(get.statusCode, 405);
assert.equal(get.headers.Allow, "POST, OPTIONS");

const options = await handler({ httpMethod: "OPTIONS" });
assert.equal(options.statusCode, 204);

const forbidden = await handler({
  httpMethod: "OPTIONS",
  headers: { origin: "https://evil.example" },
});
assert.equal(forbidden.statusCode, 403);
assert.equal(forbidden.headers["Access-Control-Allow-Origin"], undefined);

console.log("7ya-api handler tests passed");
