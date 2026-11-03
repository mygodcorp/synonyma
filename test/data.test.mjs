// Data integrity checks: run with `npm test` (node --test, no extra deps).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { fold, shardOf, SHARDS } from "../lib/keys.mjs";

const shard = (w) =>
  JSON.parse(gunzipSync(readFileSync(`data/entries/${shardOf(w).toString(16).padStart(3, "0")}.json.gz`)));
const page = (w) => shard(w)[w];
const synCount = (p) =>
  new Set([
    ...p.entries.flatMap((e) => (e.syn || []).map((s) => s.w)),
    ...(p.rs || []),
    ...(p.th || []).flatMap((g) => g.w.map((x) => x.w)),
  ]).size;

test("fold strips accents, ligatures and case", () => {
  assert.equal(fold("Œuvre d’Été"), "oeuvre d'ete");
  assert.equal(fold("ÇA"), "ca");
});

test("every shard file exists and words are stored in their own shard", () => {
  const files = readdirSync("data/entries");
  assert.equal(files.length, SHARDS);
  const s = JSON.parse(gunzipSync(readFileSync("data/entries/" + files[7])));
  for (const w of Object.keys(s).slice(0, 50)) assert.equal(shardOf(w), 7);
});

test("index is sorted on the folded key and matches stats", () => {
  const index = JSON.parse(gunzipSync(readFileSync("data/index.json.gz")));
  const stats = JSON.parse(readFileSync("data/stats.json", "utf8"));
  assert.equal(index.length, stats.words);
  for (let i = 1; i < index.length; i++) assert.ok(index[i - 1][1] <= index[i][1], `unsorted at ${i}`);
});

test("featured words all have a page with at least 3 synonyms", () => {
  const src = readFileSync("lib/featured.ts", "utf8");
  const words = [...src.matchAll(/^\s+("[^\n]+),?$/gm)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
  const lists = [...src.matchAll(/=\s*\[([^\]]+)\]/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
  const all = [...new Set([...words, ...lists])];
  assert.ok(all.length > 50, "parsed featured lists");
  const bad = all.filter((w) => !page(w) || synCount(page(w)) < 3);
  assert.deepEqual(bad, []);
});

test("links (l: 1) only point to words that have a page", () => {
  const p = page("manger");
  const linked = p.entries.flatMap((e) => (e.syn || []).filter((s) => s.l).map((s) => s.w));
  assert.ok(linked.length > 5);
  for (const w of linked) assert.ok(page(w), w);
});

test("manger has Wiktionary definitions and synonyms", () => {
  const p = page("manger");
  const verbe = p.entries.find((e) => e.p === "Verbe");
  assert.ok(verbe.senses[0].g.startsWith("Mâcher et avaler"));
  assert.ok(synCount(p) >= 15);
});
