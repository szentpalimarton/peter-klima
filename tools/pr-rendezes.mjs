#!/usr/bin/env node
// node tools/pr-rendezes.mjs [--proba]  – gh + élő ellenőrzés + téma-sor írása
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { rendez } from './lib/rendezes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://fejersolarclean.hu';
const proba = process.argv.includes('--proba');
const temaSorUt = path.join(ROOT, 'src/data/tema-sor.json');
const temaSor = JSON.parse(fs.readFileSync(temaSorUt, 'utf8'));

const gh = JSON.parse(execFileSync('gh', ['pr', 'list', '--label', 'cikk-kor', '--state', 'all', '--limit', '30', '--json', 'number,state,headRefName,createdAt,comments'], { cwd: ROOT, encoding: 'utf8' }));
// A záró komment a legutolsó, ami nem a kör saját emlékeztetője.
const zaro = (comments = []) => comments.map((c) => c.body?.trim()).filter((b) => b && !b.startsWith('Emlékeztető:')).at(-1) ?? null;
const prs = gh.map((p) => ({ number: p.number, state: p.state, headRefName: p.headRefName, createdAt: p.createdAt, zaroKomment: zaro(p.comments) }));
const agak = execFileSync('git', ['ls-remote', '--heads', 'origin', 'refs/heads/cikk/*'], { cwd: ROOT, encoding: 'utf8' })
  .split('\n').filter(Boolean).map((s) => s.split('refs/heads/')[1]);

async function el(slug) {
  try {
    const r = await fetch(`${SITE}/tudastar/${slug}/`, { method: 'HEAD' });
    if (r.status !== 200) return false;
    const sm = await (await fetch(`${SITE}/sitemap-0.xml`)).text();
    return sm.includes(`${SITE}/tudastar/${slug}/`);
  } catch { return false; }
}
const eloRendben = {};
for (const p of prs) if (p.state === 'MERGED') { const slug = p.headRefName.slice(5); eloRendben[slug] = await el(slug); }

const r = rendez(temaSor, { prs, agak, eloRendben, ma: new Date() });
// A fájl minden változáskor íródik (a draft-jelöléssel együtt), de a temaSorValtozott csak az
// érdemi változást (élő vagy kizárt téma) jelzi: a draft-jelölés magában nem nyit téma-sor PR-t.
const valtozott = JSON.stringify(r.temaSor.items) !== JSON.stringify(temaSor.items);
if (valtozott && !proba) fs.writeFileSync(temaSorUt, `${JSON.stringify(r.temaSor, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ nyitott: r.nyitott, irhat: r.irhat, temaSorValtozott: r.erdemiValtozas, teendok: r.teendok, proba }, null, 2)}\n`);
