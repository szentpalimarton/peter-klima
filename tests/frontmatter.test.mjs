import { test } from 'node:test';
import assert from 'node:assert/strict';
import { szetszed } from '../tools/lib/frontmatter.mjs';

test('szétszedi a fejlécet és a törzset', () => {
  const r = szetszed('---\ntitle: "Cím"\nfaq:\n  - q: "K?"\n    a: "V."\n---\n\nTörzs.\n');
  assert.equal(r.fejlec.title, 'Cím');
  assert.equal(r.fejlec.faq[0].q, 'K?');
  assert.equal(r.torzs.trim(), 'Törzs.');
});

test('hibát dob fejléc nélkül', () => {
  assert.throws(() => szetszed('Nincs fejléc.'), /fejléc/);
});
