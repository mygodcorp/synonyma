# Synonyma

Dictionnaire ouvert des synonymes et antonymes français : [synonyma.fr](https://synonyma.fr).

- **130 000+ mots**, synonymes, antonymes, définitions, exemples, prononciation et étymologie.
- Données libres, figées au build : **aucune base de données, aucune clé d’API, aucun appel IA** à l’exécution.
- Next.js 16 (App Router), pages générées à la demande puis mises en cache (ISR).

## Données

| Source | Contenu | Licence |
| --- | --- | --- |
| [Wiktionnaire](https://fr.wiktionary.org), extrait par [kaikki.org](https://kaikki.org/frwiktionary/) | définitions, exemples, API, étymologie, synonymes, antonymes | CC BY-SA 4.0 |
| [Thésaurus Dicollecte](https://grammalecte.net) (LibreOffice `thes_fr.dat`) | groupes de synonymes | LGPL 2.1+ |

Le jeu de données compilé est versionné dans `data/` (~30 Mo) :

- `data/entries/000…3ff.json.gz` : 1 024 fragments, un mot va dans le fragment `fnv1a(mot) % 1024` (`lib/keys.mjs`).
- `data/index.json.gz` : `[mot, mot sans accents, nb synonymes, nb antonymes]` trié, pour la recherche et le dictionnaire A–Z.
- `data/stats.json` : compteurs et date de build.

Un mot a une page s’il a au moins un synonyme ou un antonyme (direct, inverse ou issu du thésaurus).

### Mettre à jour les données

```bash
npm run data:extract   # télécharge ~3 Go (Wiktionnaire) en streaming + le thésaurus, écrit .cache/
npm run data:build     # régénère data/
npm test               # contrôles d’intégrité
```

## Développement

```bash
npm install
npm run dev
npm run typecheck && npm test && npm run build
```

Variable d’environnement optionnelle : `NEXT_PUBLIC_SITE_URL` (défaut `https://synonyma.fr`).

## Structure

- `app/[word]` : fiche d’un mot (`/manger`). Les variantes (`/Manger`, `/ecole`) redirigent en 308 vers la forme canonique.
- `app/api/search` : autocomplétion par préfixe, insensible aux accents.
- `app/dictionnaire/[letter]` : index alphabétique paginé.
- `app/hasard` : redirection vers un mot au hasard.
- `app/sitemap.ts` : sitemaps découpés par tranches de 40 000 URL.

Design inspiré de grokipedia.com (Newsreader + Inter, tokens clair/sombre).
