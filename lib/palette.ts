// Cloth-binding colours for the book spines and covers.
const COLORS: { c: string; t?: string }[] = [
  { c: "#1d1d1f" }, { c: "#e8e4da", t: "#3b3b3b" }, { c: "#13233f" }, { c: "#efe6d2", t: "#3b3b3b" },
  { c: "#7b6a9a" }, { c: "#3a3a3a" }, { c: "#0f2a44" }, { c: "#173a2c" }, { c: "#f0e2bf", t: "#4a3b22" },
  { c: "#b8481e" }, { c: "#e8732a" }, { c: "#2f4b63" }, { c: "#2c7fc0" }, { c: "#4b4a2c" },
  { c: "#d98b78" }, { c: "#b9ab92", t: "#2f2a22" }, { c: "#1b2b44" }, { c: "#1e4434" }, { c: "#5e1414" },
  { c: "#6f7f6a" }, { c: "#173d49" }, { c: "#5a1a28" }, { c: "#3b2a59" }, { c: "#2c6aa6" },
  { c: "#7d6a55" }, { c: "#3a1a2c" }, { c: "#4a2a20" }, { c: "#9aa38a", t: "#22281c" }, { c: "#6d3a12" },
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function bookColor(word: string) {
  return COLORS[hash(word) % COLORS.length];
}

/** Deep cover colours only (light text stays readable). */
const COVERS = ["#13233f", "#173a2c", "#5e1414", "#3b2a59", "#173d49", "#1d1d1f", "#4a2a20", "#2f4b63"];
export function coverColor(word: string) {
  return COVERS[hash(word) % COVERS.length];
}

export function spineSize(word: string) {
  const h = hash(word + "#");
  return { w: 30 + (h % 12), h: 150 + ((h >> 4) % 40) };
}
