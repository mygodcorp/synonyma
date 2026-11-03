// Wiktionary (via kaikki.org) normalises usage labels to English tags; French
// raw labels are kept as-is. Show French only, drop internal/technical tags.
const FR: Record<string, string> = {
  figuratively: "Figuré",
  familiar: "Familier",
  colloquial: "Familier",
  informal: "Familier",
  obsolete: "Désuet",
  dated: "Vieilli",
  archaic: "Archaïque",
  broadly: "Par extension",
  rare: "Rare",
  slang: "Argot",
  Anglicism: "Anglicisme",
  pejorative: "Péjoratif",
  analogy: "Par analogie",
  pronominal: "Pronominal",
  vulgar: "Vulgaire",
  metonymically: "Par métonymie",
  ellipsis: "Par ellipse",
  neologism: "Néologisme",
  ironic: "Ironique",
  literary: "Littéraire",
  intransitive: "Intransitif",
  transitive: "Transitif",
  formal: "Soutenu",
  literally: "Au sens propre",
  offensive: "Injurieux",
  hyperbole: "Par hyperbole",
  euphemism: "Euphémisme",
  poetic: "Poétique",
  childish: "Enfantin",
  especially: "En particulier",
  uncountable: "Indénombrable",
  Ancient: "Antiquité",
  Didactique: "Didactique",
  France: "France",
  Québec: "Québec",
  Canada: "Canada",
  Suisse: "Suisse",
  Belgique: "Belgique",
};

const DROP = new Set(["alt-of", "physical", "plural", "singular", "common", "collective", "toponymic", "Ancient-Greek", "rhetoric"]);

export function labels(tags?: string[]): string[] {
  if (!tags) return [];
  const out: string[] = [];
  for (const t of tags) {
    if (DROP.has(t)) continue;
    const fr = FR[t] ?? (/^[a-z-]+$/.test(t) ? null : t);
    if (fr && !out.includes(fr)) out.push(fr);
  }
  return out;
}

export function genderLabel(gen?: string): string | null {
  if (!gen) return null;
  if (gen === "masculine-feminine") return "Masculin et féminin";
  if (gen === "masculine") return "Masculin";
  if (gen === "feminine") return "Féminin";
  return null;
}
