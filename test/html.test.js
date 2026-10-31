import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchHtml } from '../lib/ufc/html.js';

test('fetchHtml spaces requests out and dedupes ones in flight', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push({ url, at: Date.now() });
    return new Response(url.endsWith('missing') ? 'nope' : `<p>${url}</p>`, {
      status: url.endsWith('missing') ? 404 : 200,
    });
  });

  const [a, aAgain, b] = await Promise.all([fetchHtml('/a'), fetchHtml('/a'), fetchHtml('/missing')]);

  assert.equal(a, '<p>https://www.ufc.com/a</p>');
  assert.equal(aAgain, a);
  assert.equal(b, null); // 404 → null
  assert.deepEqual(calls.map((c) => c.url), ['https://www.ufc.com/a', 'https://www.ufc.com/missing']);
  assert.ok(calls[1].at - calls[0].at >= 2_900, `requests ${calls[1].at - calls[0].at}ms apart`);
});
