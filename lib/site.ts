export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://synonyma.fr",
  description:
    "Synonymes, antonymes et définitions de 130 000 mots français. Dictionnaire ouvert et sans publicité, d’après le Wiktionnaire.",
};

/** Open Graph block for pages without their own image: reuse the site card. */
export function og(path: string) {
  return { url: path, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Synonyma" }] };
}
