import { dehydrate, QueryClient } from "@tanstack/react-query";
import getPage from "lib/supabase/queries/get-page-data";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import WordClient from "./word-client";
import { HydrationBoundary } from "@tanstack/react-query";
import {
  DefinedTermJsonLd,
  BreadcrumbJsonLd,
} from "components/structured-data";

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
  const decodedWord = decodeURIComponent(word);

  try {
    const page = await getPage(decodedWord);

    if (!page) {
      return {
        title: "Page non trouvée",
      };
    }

    const synonymeCount = page.synonymes?.length || 0;
    const antonymeCount = page.antonymes?.length || 0;

    return {
      title: `${page.word.toUpperCase()} Synonymes: Synonymes & Antonymes de ${page.word.toUpperCase()}`,
      description: `Découvrez ${synonymeCount} synonymes et ${antonymeCount} antonymes du mot "${page.word}". ${page.definition || `Trouvez le mot parfait pour enrichir votre vocabulaire.`}`,
      keywords: [
        `synonyme ${page.word}`,
        `antonyme ${page.word}`,
        page.word,
        "dictionnaire français",
        "vocabulaire",
      ],
      alternates: {
        canonical: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/${encodeURIComponent(page.word)}`,
      },
      openGraph: {
        title: `${page.word} Synonymes: Synonymes & Antonymes de ${page.word.toUpperCase()}`,
        type: "article",
        url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/${encodeURIComponent(page.word)}`,
        siteName: "Synonyma",
        locale: "fr_FR",
        images: [
          {
            url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${encodeURIComponent(page.word)}`,
            width: 1200,
            height: 630,
            alt: `Synonymes de ${page.word}`,
          },
        ],
        description: `Découvrez ${synonymeCount} synonymes et ${antonymeCount} antonymes du mot "${page.word}". ${page.definition || `Trouvez le mot parfait pour enrichir votre vocabulaire.`}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${page.word.toUpperCase()} - Synonymes et Antonymes`,
        description: `${synonymeCount} synonymes, ${antonymeCount} antonymes pour "${page.word}"`,
        images: [
          `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${encodeURIComponent(page.word)}`,
        ],
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
  const decodedWord = decodeURIComponent(word);
  const queryClient = new QueryClient();

  try {
    const pageData = await queryClient.fetchQuery({
      queryKey: ["word", decodedWord],
      queryFn: () => getPage(decodedWord),
    });

    const dehydratedState = dehydrate(queryClient);

    // Extraire les synonymes et antonymes pour le JSON-LD
    const synonyms =
      pageData?.synonymes?.map((s: any) => s.item?.word || s.word) || [];
    const antonyms =
      pageData?.antonymes?.map((a: any) => a.item?.word || a.word) || [];

    return (
      <>
        <DefinedTermJsonLd
          word={decodedWord}
          definition={pageData?.definition || undefined}
          synonyms={synonyms.slice(0, 10)} // Limiter à 10 pour ne pas surcharger
          antonyms={antonyms.slice(0, 10)}
        />
        <BreadcrumbJsonLd
          items={[
            { name: "Accueil", url: "https://synonyma.fr" },
            {
              name: decodedWord,
              url: `https://synonyma.fr/${encodeURIComponent(decodedWord)}`,
            },
          ]}
        />
        <HydrationBoundary state={dehydratedState}>
          <WordClient word={decodedWord} />
        </HydrationBoundary>
      </>
    );
  } catch (e) {
    notFound();
  }
}
