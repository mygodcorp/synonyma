// Shared by the data build script (Node) and the app (Next.js). Keep it dependency-free.

export const SHARDS = 1024;

/** Lowercase, strip accents and ligatures: "Œuvre d’art" -> "oeuvre d'art". */
export function fold(s) {
  return s
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[’ʼ]/g, "'")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** FNV-1a 32-bit hash of the exact word, bucketed into SHARDS files. */
export function shardOf(word) {
  let h = 0x811c9dc5;
  for (let i = 0; i < word.length; i++) {
    h ^= word.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % SHARDS;
}
