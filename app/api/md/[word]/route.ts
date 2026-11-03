import { getPage, resolveWord } from "@/lib/data";
import { pageToMarkdown } from "@/lib/markdown";

const HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=31536000",
  "X-Robots-Tag": "noindex",
};

export async function GET(req: Request, { params }: { params: Promise<{ word: string }> }) {
  let word = (await params).word;
  try {
    word = decodeURIComponent(word);
  } catch {}
  const page = getPage(word);
  if (!page) {
    const resolved = resolveWord(word);
    if (resolved) return Response.redirect(new URL(`/${encodeURIComponent(resolved)}.md`, req.url), 308);
    return new Response(`# Mot introuvable\n\n« ${word} » n’a pas de fiche dans Synonyma.\n`, { status: 404, headers: HEADERS });
  }
  return new Response(pageToMarkdown(page), {
    headers: { ...HEADERS, Link: `<https://synonyma.fr/${encodeURIComponent(page.w)}>; rel="canonical"` },
  });
}
