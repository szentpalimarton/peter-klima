import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// A tools/codex-kor.sh minden kilépési útja Codex nélkül: hamis pingpong-skill
// (codex-bin, diff-keszit, codex-review) és egy ideiglenes git-repó a cikkel.
const SZKRIPT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../tools/codex-kor.sh');

function hamisSkill(dir) {
  const s = path.join(dir, 'skill/scripts');
  fs.mkdirSync(s, { recursive: true });
  fs.writeFileSync(path.join(dir, 'codex'), '#!/usr/bin/env bash\n[ "$1 $2" = "login status" ] && exit "${FAKE_LOGIN:-0}"\nexit 0\n', { mode: 0o755 });
  fs.writeFileSync(path.join(s, 'codex-bin.sh'), `#!/usr/bin/env bash\necho "${path.join(dir, 'codex')}"\n`);
  fs.writeFileSync(path.join(s, 'diff-keszit.sh'), '#!/usr/bin/env bash\nprintf "%s" "$FAKE_DIFF" > "$1"\necho "$1"\necho "bázis: $2, fájlok: ${FAKE_FAJLOK:-1}, sorok: 3"\n');
  fs.writeFileSync(path.join(s, 'codex-review.sh'), '#!/usr/bin/env bash\nprintf "%s" "$FAKE_REVIEW" > "$3"\n');
  return path.join(dir, 'skill');
}

function hamisRepo(dir, { cikk = true } = {}) {
  const r = path.join(dir, 'repo');
  fs.mkdirSync(path.join(r, 'docs/cikk-kor'), { recursive: true });
  fs.mkdirSync(path.join(r, 'src/content/tudastar'), { recursive: true });
  fs.writeFileSync(path.join(r, 'docs/cikk-kor/iras-utasitas.md'), '# utasítás\n');
  if (cikk) fs.writeFileSync(path.join(r, 'src/content/tudastar/proba.md'), '---\ntitle: x\n---\n');
  spawnSync('git', ['init', '-q'], { cwd: r });
  return r;
}

const JO_DIFF = 'diff --git a/src/content/tudastar/proba.md b/src/content/tudastar/proba.md\n+uj\n';
const JO_REVIEW = '## Verdikt\n\nMEHET – rendben.\n\n## P0 – blokkolók\n\nnincs\n';

function futtat(env = {}, { cikk = true, slug = 'proba' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-kor-'));
  try {
    const skill = hamisSkill(dir);
    const repo = hamisRepo(dir, { cikk });
    const ki = path.join(dir, 'ki');
    const r = spawnSync('bash', [SZKRIPT, slug, ki, 'main'], {
      cwd: repo,
      encoding: 'utf8',
      env: { ...process.env, PINGPONG_SKILL: skill, FAKE_DIFF: JO_DIFF, FAKE_REVIEW: JO_REVIEW, ...env },
    });
    return { kod: r.status, ki: r.stdout, hiba: r.stderr };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('sikeres kör: 0, kiírja a verdiktet', () => {
  const r = futtat();
  assert.equal(r.kod, 0, r.hiba);
  assert.match(r.ki, /verdikt: MEHET – rendben\./);
  assert.match(r.ki, /review: .*proba-codex-1\.md/);
});

test('JAVÍTANDÓ és ÚJRAÍRANDÓ is érvényes verdikt', () => {
  for (const v of ['JAVÍTANDÓ – két pont.', 'ÚJRAÍRANDÓ – rossz irány.']) {
    const r = futtat({ FAKE_REVIEW: `## Verdikt\n\n${v}\n` });
    assert.equal(r.kod, 0, r.hiba);
  }
});

test('hibás hívás: 2', () => {
  assert.equal(futtat({}, { slug: 'Rossz Slug' }).kod, 2);
  assert.equal(futtat({}, { cikk: false }).kod, 2);
});

test('a Codex nincs bejelentkezve vagy nincs skill: 3', () => {
  assert.equal(futtat({ FAKE_LOGIN: '1' }).kod, 3);
  assert.equal(futtat({ PINGPONG_SKILL: '/nincs-ilyen-skill' }).kod, 3);
});

test('üres diff, vagy a cikk nincs a diffben: 4', () => {
  assert.equal(futtat({ FAKE_FAJLOK: '0' }).kod, 4);
  const r = futtat({ FAKE_DIFF: 'diff --git a/src/data/tema-sor.json b/src/data/tema-sor.json\n+x\n' });
  assert.equal(r.kod, 4);
  assert.match(r.hiba, /nem szerepel a diffben/);
});

test('érvényes verdikt nélküli vagy üres review: 4', () => {
  const r = futtat({ FAKE_REVIEW: 'Nem tudtam elvégezni a review-t.\n' });
  assert.equal(r.kod, 4);
  assert.match(r.hiba, /nincs érvényes verdikt/);
  assert.equal(futtat({ FAKE_REVIEW: '' }).kod, 4);
});
