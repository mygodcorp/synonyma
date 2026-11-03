#!/usr/bin/env node
// Turns the compact Wiktionary extraction (scripts/extract-wiktionary.py output)
// and the LibreOffice/Dicollecte French thesaurus (thes_fr.dat, MyThes format)
// into the sharded, gzipped dataset served by the app (data/).
//
//   node scripts/build-data.mjs <fr-compact.jsonl> <thes_fr.dat>
//
// Only words that have at least one synonym or antonym (direct, reverse —
// another entry lists them — or from the thesaurus) get a page.
// Links point only to words that have a page.
import { createReadStream, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { fold, shardOf, SHARDS } from "../lib/keys.mjs";

const input = process.argv[2];
const thesPath = process.argv[3];
if (!input || !thesPath) {
  console.error("usage: node scripts/build-data.mjs <fr-compact.jsonl> <thes_fr.dat>");
  process.exit(1);
}
const OUT = join(process.cwd(), "data");
const MAX_SENSES = 8;
const MAX_REL = 60;

const byWord = new Map();
const rl = createInterface({ input: createReadStream(input), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line) continue;
  const d = JSON.parse(line);
  if (!d.w || d.w.length > 60) continue;
  if (!byWord.has(d.w)) byWord.set(d.w, []);
  byWord.get(d.w).push(d);
}
console.log("words read", byWord.size);

const clean = (list, self) => {
  const seen = new Set();
  const out = [];
  for (const r of list) {
    if (r.w === self || seen.has(r.w)) continue;
    seen.add(r.w);
    out.push(r);
  }
  return out.slice(0, MAX_REL);
};

// Direct relations, deduplicated per entry.
for (const [w, entries] of byWord) {
  for (const e of entries) {
    e.syn = clean(e.syn, w);
    e.ant = clean(e.ant, w);
  }
}

// Reverse relations (B is listed as synonym of A => A is shown on B's page).
const rsyn = new Map();
const rant = new Map();
const push = (m, k, v) => {
  if (!m.has(k)) m.set(k, new Set());
  m.get(k).add(v);
};
for (const [w, entries] of byWord) {
  for (const e of entries) {
    for (const s of e.syn) if (byWord.has(s.w)) push(rsyn, s.w, w);
    for (const s of e.ant) if (byWord.has(s.w)) push(rant, s.w, w);
  }
}

// Thesaurus: "word|n" followed by n lines "(Pos)|syn|syn|…" (one line per meaning cluster).
const THES_POS = {
  nom: "Nom", verbe: "Verbe", adjectif: "Adjectif", adj: "Adjectif", adverbe: "Adverbe",
  interjection: "Interjection", pronom: "Pronom", conjonction: "Conjonction", preposition: "Préposition",
  determinant: "Déterminant",
};
const thes = new Map();
{
  const lines = readFileSync(thesPath, "utf8").split("\n");
  for (let i = 1; i < lines.length; i++) {
    const m = /^([^|(]+)\|(\d+)$/.exec(lines[i]);
    if (!m) continue;
    const head = m[1].trim();
    const n = Number(m[2]);
    const groups = [];
    for (let k = 1; k <= n && i + k < lines.length; k++) {
      const [posRaw, ...syns] = lines[i + k].split("|");
      const pos = (posRaw.match(/\(([^)]*)\)/)?.[1] || "")
        .split(/\s+/)
        .map((p) => THES_POS[p.toLowerCase()])
        .filter(Boolean);
      const words = [...new Set(syns.map((s) => s.trim()).filter((s) => s && s !== head && s.length <= 60))];
      if (words.length) groups.push({ p: [...new Set(pos)].join(", ") || null, w: words.slice(0, MAX_REL) });
    }
    i += n;
    if (groups.length) thes.set(head, groups);
  }
}
console.log("thesaurus headwords", thes.size);

const hasPage = new Set();
for (const [w, entries] of byWord) {
  if (entries.some((e) => e.syn.length || e.ant.length) || rsyn.has(w) || rant.has(w)) {
    hasPage.add(w);
  }
}
for (const w of thes.keys()) hasPage.add(w);
console.log("pages", hasPage.size);

const posLabel = (p) => p.replace(/\s+\d+$/, "");
const rel = (list) =>
  list.map((r) => {
    const o = { w: r.w };
    if (r.s) o.s = r.s;
    if (r.t) o.t = r.t;
    if (hasPage.has(r.w)) o.l = 1;
    return o;
  });

const shards = Array.from({ length: SHARDS }, () => ({}));
const index = [];
let links = 0;
for (const w of hasPage) {
  const entries = (byWord.get(w) || []).map((e) => {
    const o = { p: posLabel(e.p), senses: e.senses.slice(0, MAX_SENSES).map((s) => {
      const so = { g: s.g };
      if (s.e) so.e = s.e;
      if (s.t) so.t = s.t;
      return so;
    }) };
    if (e.ipa) o.ipa = e.ipa;
    if (e.gen) o.gen = e.gen;
    if (e.et) o.et = e.et.length > 400 ? e.et.slice(0, 400) + "…" : e.et;
    if (e.syn.length) o.syn = rel(e.syn);
    if (e.ant.length) o.ant = rel(e.ant);
    return o;
  });
  const direct = new Set(entries.flatMap((e) => (e.syn || []).map((s) => s.w)));
  const directA = new Set(entries.flatMap((e) => (e.ant || []).map((s) => s.w)));
  const rs = [...(rsyn.get(w) || [])].filter((x) => !direct.has(x) && x !== w).sort((a, b) => a.localeCompare(b, "fr")).slice(0, MAX_REL);
  const ra = [...(rant.get(w) || [])].filter((x) => !directA.has(x) && x !== w).sort((a, b) => a.localeCompare(b, "fr")).slice(0, MAX_REL);
  const th = (thes.get(w) || []).map((g) => {
    const o = { w: g.w.map((x) => (hasPage.has(x) ? { w: x, l: 1 } : { w: x })) };
    if (g.p) o.p = g.p;
    return o;
  });
  const all = new Set([...direct, ...rs, ...th.flatMap((g) => g.w.map((x) => x.w))]);
  const nSyn = all.size;
  const nAnt = directA.size + ra.length;
  links += nSyn + nAnt;
  const page = { w, entries };
  if (rs.length) page.rs = rs;
  if (ra.length) page.ra = ra;
  if (th.length) page.th = th;
  shards[shardOf(w)][w] = page;
  index.push([w, fold(w), nSyn, nAnt]);
}

index.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[0].localeCompare(b[0], "fr")));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "entries"), { recursive: true });
let bytes = 0;
shards.forEach((s, i) => {
  const buf = gzipSync(JSON.stringify(s), { level: 9 });
  bytes += buf.length;
  writeFileSync(join(OUT, "entries", `${i.toString(16).padStart(3, "0")}.json.gz`), buf);
});
const idx = gzipSync(JSON.stringify(index), { level: 9 });
writeFileSync(join(OUT, "index.json.gz"), idx);
writeFileSync(
  join(OUT, "stats.json"),
  JSON.stringify(
    {
      words: index.length,
      relations: links,
      sources: [
        { name: "Wiktionnaire", via: "kaikki.org", url: "https://fr.wiktionary.org", license: "CC BY-SA 4.0" },
        { name: "Thésaurus français Dicollecte (LibreOffice)", url: "https://grammalecte.net", license: "LGPL 2.1+" },
      ],
      builtAt: new Date().toISOString().slice(0, 10),
    },
    null,
    2,
  ) + "\n",
);
console.log(`shards ${(bytes / 1e6).toFixed(1)} MB, index ${(idx.length / 1e6).toFixed(1)} MB, relations ${links}`);
