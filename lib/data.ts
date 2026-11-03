import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { cache } from "react";
import { fold, shardOf } from "./keys.mjs";
import stats from "@/data/stats.json";

export type Relation = { w: string; s?: string; t?: string[]; l?: 1 };
export type Sense = { g: string; e?: string; t?: string[] };
export type Entry = {
  p: string;
  ipa?: string;
  gen?: string;
  et?: string;
  senses: Sense[];
  syn?: Relation[];
  ant?: Relation[];
};
/** A thesaurus meaning cluster (no definition, optional part of speech). */
export type ThesGroup = { p?: string; w: Relation[] };
export type Page = { w: string; entries: Entry[]; rs?: string[]; ra?: string[]; th?: ThesGroup[] };
/** [word, folded word, synonym count, antonym count] sorted by folded word. */
export type IndexRow = [string, string, number, number];

export const DATA_STATS = stats as {
  words: number;
  relations: number;
  forms?: number;
  sources: { name: string; via?: string; url: string; license: string }[];
  builtAt: string;
};

const DATA_DIR = join(process.cwd(), "data");

const readShard = cache((n: number): Record<string, Page> => {
  const file = join(DATA_DIR, "entries", `${n.toString(16).padStart(3, "0")}.json.gz`);
  return JSON.parse(gunzipSync(readFileSync(file)).toString("utf8"));
});

let indexCache: IndexRow[] | null = null;
export function getIndex(): IndexRow[] {
  if (!indexCache) {
    indexCache = JSON.parse(gunzipSync(readFileSync(join(DATA_DIR, "index.json.gz"))).toString("utf8"));
  }
  return indexCache!;
}

let exactCache: Map<string, string[]> | null = null;
function byFolded(): Map<string, string[]> {
  if (!exactCache) {
    exactCache = new Map();
    for (const [w, f] of getIndex()) {
      const list = exactCache.get(f);
      if (list) list.push(w);
      else exactCache.set(f, [w]);
    }
  }
  return exactCache;
}

let richCache: Map<string, number> | null = null;
/** Synonyms + antonyms count of a headword: a cheap proxy for how common/central it is. */
export function richness(word: string): number {
  if (!richCache) richCache = new Map(getIndex().map((r) => [r[0], r[2] + r[3]]));
  return richCache.get(word) ?? 0;
}

export function getPage(word: string): Page | null {
  return readShard(shardOf(word))[word] ?? null;
}

let formsCache: Record<string, string> | null = null;
/** Lemma of an inflected form without its own page ("mangeons" -> "manger"), if known. */
export function lemmaOf(word: string): string | null {
  if (!formsCache) {
    try {
      formsCache = JSON.parse(gunzipSync(readFileSync(join(DATA_DIR, "forms.json.gz"))).toString("utf8"));
    } catch {
      formsCache = {};
    }
  }
  return formsCache![word] ?? formsCache![word.toLowerCase()] ?? null;
}

/** Static routes that shadow a headword of the same name: never list them as word URLs. */
export const RESERVED = new Set(["dictionnaire", "hasard", "cgu", "a-propos", "api", "llms.txt"]);

/**
 * Resolve what the visitor typed to a real headword.
 * "Ecole" -> "école", "MANGER" -> "manger". Returns null when nothing matches.
 */
export function resolveWord(raw: string): string | null {
  const word = raw.normalize("NFC").trim();
  if (!word) return null;
  if (getPage(word)) return word;
  const lower = word.toLowerCase();
  if (getPage(lower)) return lower;
  const lemma = lemmaOf(word);
  if (lemma) return lemma;
  const candidates = byFolded().get(fold(word));
  if (!candidates?.length) return null;
  return candidates.find((c) => c === lower) ?? candidates.find((c) => c.toLowerCase() === c) ?? candidates[0];
}

function lowerBound(rows: IndexRow[], key: string): number {
  let lo = 0;
  let hi = rows.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (rows[mid][1] < key) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Prefix search on the folded headword; exact match first, then richest pages. */
export function search(q: string, limit = 8): IndexRow[] {
  const key = fold(q.normalize("NFC").trim());
  if (!key) return [];
  const rows = getIndex();
  const out: IndexRow[] = [];
  for (let i = lowerBound(rows, key); i < rows.length && out.length < 400; i++) {
    if (!rows[i][1].startsWith(key)) break;
    out.push(rows[i]);
  }
  out.sort((a, b) => {
    const ea = a[1] === key ? 0 : 1;
    const eb = b[1] === key ? 0 : 1;
    if (ea !== eb) return ea - eb;
    const sa = a[0].includes(" ") ? 1 : 0;
    const sb = b[0].includes(" ") ? 1 : 0;
    if (sa !== sb) return sa - sb;
    return b[2] + b[3] - (a[2] + a[3]) || a[1].length - b[1].length;
  });
  return out.slice(0, limit);
}

export const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

export function wordsForLetter(letter: string): IndexRow[] {
  const rows = getIndex();
  const out: IndexRow[] = [];
  for (let i = lowerBound(rows, letter); i < rows.length && rows[i][1].startsWith(letter); i++) out.push(rows[i]);
  return out;
}

export function wordHref(word: string): string {
  return `/${encodeURIComponent(word)}`;
}

/** Day-stable pick, so "Mot du jour" changes once per day and every visitor sees the same one. */
export function dayIndex(length: number, date = new Date()): number {
  const day = Math.floor(date.getTime() / 86_400_000);
  return ((day * 2654435761) >>> 0) % length;
}

/** French number format with a regular no-break space (some fonts lack U+202F). */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n).replace(/\u202f/g, "\u00a0");
}
