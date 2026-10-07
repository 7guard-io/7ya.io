import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost, onRequestGet } from '../functions/api/guide.js';
const messages = [
  { role: 'user', content: 'את העסק שלי לסוכנויות' },
  { role: 'assistant', content: 'מה תרצה לשפר בעסק מול הסוכנויות?' },
  { role: 'user', content: 'מכירות' },
];
let testClient = 0;
const request = body => new Request('https://7ya.io/api/guide', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': 'test-' + (++testClient) }, body: JSON.stringify(body) });
const body = { message: 'מכירות', messages, locale: 'he', mode: 'guide' };
test('short sales follow-up reaches AI with prior question and business context', async () => {
  let received;
  const env = { AI: { run: async (model, input) => {
    received = input;
    return { response: JSON.stringify({ reply: 'במכירות לסוכנויות, התחילו מהצעה אחת ברורה ומפיילוט עם סוכנות אחת. איזה שירות העסק מוכר?', actions: [] }) };
  } } };
  const response = await onRequestPost({ request: request(body), env });
  assert.equal(response.status, 200);
  assert.deepEqual(received.messages.slice(1), messages);
  const data = await response.json();
  assert.equal(data.provider, 'cloudflare-ai');
  assert.match(data.answer, /סוכנויות/);
  assert.equal(data.release, '7ya-chat-20261007-v4');
});
test('missing provider is an explicit 503, never a fake AI template', async () => {
  const response = await onRequestPost({ request: request(body), env: {} });
  assert.equal(response.status, 503);
  const data = await response.json();
  assert.equal(data.error, 'chat_unavailable');
  assert.equal(data.answer, undefined);
});
test('NVIDIA authorization failure falls back to Workers AI with same conversation', async () => {
  const originalFetch = globalThis.fetch;
  let received;
  globalThis.fetch = async () => new Response('{}', { status: 401 });
  try {
    const env = { NVIDIA_API_KEY: 'test-only', AI: { run: async (_, input) => { received = input; return { response: '{"reply":"תוכנית מכירות לסוכנויות"}' }; } } };
    const response = await onRequestPost({ request: request(body), env });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).provider, 'cloudflare-ai');
    assert.deepEqual(received.messages.slice(1), messages);
  } finally { globalThis.fetch = originalFetch; }
});
test('health canary cannot pass by returning deterministic creator fields', async () => {
  const request = new Request('https://7ya.io/api/guide?probe=1');
  const response = await onRequestGet({ request, env: {} });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).visitor_path_ready, false);
});
test('provider failure and malformed/oversized requests remain truthful', async () => {
  const env = { AI: { run: async () => { throw new Error('quota'); } } };
  assert.equal((await onRequestPost({ request: request(body), env })).status, 503);
  for (const value of [null, [], { message: 'a'.repeat(1601) }]) {
    assert.equal((await onRequestPost({ request: request(value), env })).status, 422);
  }
});

test('Workers AI structured response is parsed without object coercion', async () => {
  const env = { AI: { run: async () => ({ response: { reply: 'מכירות לסוכנויות: נבנה הצעה ממוקדת.', actions: [] } }) } };
  const response = await onRequestPost({ request: request(body), env });
  assert.equal(response.status, 200);
  assert.match((await response.json()).answer, /מכירות לסוכנויות/);
});
test('malformed provider reply cannot pass chat readiness', async () => {
  const env = { AI: { run: async () => ({ response: { reply: { text: 'wrong shape' } } }) } };
  assert.equal((await onRequestPost({ request: request(body), env })).status, 503);
});

test('burst limit returns 429 before another model invocation', async () => {
  let calls = 0;
  const env = { AI: { run: async () => { calls++; return { response: { reply: 'תשובה' } }; } } };
  for (let i = 0; i < 7; i++) {
    const req = request(body); req.headers.set('cf-connecting-ip', 'burst-regression-client');
    const response = await onRequestPost({ request: req, env });
    if (i < 6) assert.equal(response.status, 200);
    else { assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '60'); }
  }
  assert.equal(calls, 6);
});
