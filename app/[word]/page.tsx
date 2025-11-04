import { dehydrate, QueryClient } from "@tanstack/react-query";
import getPage from "lib/supabase/queries/get-page-data";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import WordClient from "./word-client";
import { HydrationBoundary } from "@tanstack/react-query";

// Permet la génération à la demande pour les pages non pré-générées
export const dynamicParams = true;

// Cache de 24h pour toutes les pages
export const revalidate = 86400;

export async function generateStaticParams() {
  const { supabase } = await import("lib/supabase/supabase");

  // Générer seulement les 1000 premiers mots pour accélérer le build
  // Les autres seront générés à la demande lors du crawl Google
  const { data } = await supabase
    .from("_word")
    .select("word")
    .order("word", { ascending: true })
    .limit(1000);

  if (!data) return [];

  return data.map((item) => ({
    word: item.word,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ word: string }>;
}): Promise<Metadata> {
  const { word } = await params;

  try {
    const page = await getPage(word);

    if (!page) {
      return {
        title: "Page non trouvée",
      };
    }

    return {
      title: `${page.word.toUpperCase()} Synonymes: Synonymes & Antonymes de ${page.word.toUpperCase()}`,
      description: `Synonymes de ${page.word} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
      alternates: {
        canonical: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/${page.word}`,
      },
      openGraph: {
        title: `${page.word} Synonymes: Synonymes & Antonymes de ${page.word.toUpperCase()}`,
        type: "article",
        images: [
          {
            url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${word}`,
          },
        ],
        description: `Synonymes de ${page.word.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
      },
    };
  } catch (e) {
    return {
      title: "Page non trouvée",
    };
  }
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ word: string }>;
}) {
  const { word } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["word", word],
      queryFn: () => getPage(word),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydratedState}>
        <WordClient word={word} />
      </HydrationBoundary>
    );
  } catch (e) {
    notFound();
  }
}
