import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Metadata } from "next";
import DictionaryClient from "./dictionary-client";
import getDictionary from "lib/supabase/queries/get-dictionary";
import {
  CollectionPageJsonLd,
  BreadcrumbJsonLd,
} from "components/structured-data";

export const revalidate = 10000;

export async function generateStaticParams() {
  return [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  ].map((item) => ({
    letter: item.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ letter: string }>;
}): Promise<Metadata> {
  const { letter } = await params;
  const upperLetter = letter.toUpperCase();
  return {
    title: `Lettre ${upperLetter} : Dictionnaire de Mots et Synonymes - Synonyma.fr`,
    description: `Découvrez tous les mots français commençant par ${upperLetter}. Explorez leurs synonymes et antonymes sur Synonyma.fr, le dictionnaire de référence pour enrichir votre vocabulaire.`,
    keywords: [
      `mots lettre ${upperLetter}`,
      `synonymes ${upperLetter}`,
      `dictionnaire ${upperLetter}`,
      "vocabulaire français",
      `mots commençant par ${upperLetter}`,
    ],
    alternates: {
      canonical: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/dictionnaire/${letter}`,
    },
    openGraph: {
      title: `Lettre ${upperLetter} : Dictionnaire de Mots et Synonymes`,
      type: "website",
      url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/dictionnaire/${letter}`,
      siteName: "Synonyma",
      locale: "fr_FR",
      images: [
        {
          url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${letter}`,
          width: 1200,
          height: 630,
          alt: `Dictionnaire lettre ${upperLetter}`,
        },
      ],
      description: `Découvrez tous les mots français commençant par ${upperLetter}. Explorez leurs synonymes et antonymes.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Lettre ${upperLetter} - Dictionnaire Synonyma`,
      description: `Tous les mots français commençant par ${upperLetter} avec leurs synonymes et antonymes`,
      images: [
        `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${letter}`,
      ],
    },
  };
}

export default async function Dictionnaire({
  params,
}: {
  params: Promise<{ letter: string }>;
}) {
  const { letter } = await params;
  const queryClient = new QueryClient();
  const upperLetter = letter.toUpperCase();

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["words", letter],
      queryFn: () => getDictionary(letter, 0),
      initialPageParam: 0,
      getNextPageParam: (lastPage: PaginatedResponse) => {
        return lastPage.page;
      },
    });

    const dehydratedState = JSON.parse(JSON.stringify(dehydrate(queryClient)));

    return (
      <>
        <CollectionPageJsonLd
          name={`Dictionnaire lettre ${upperLetter}`}
          description={`Collection complète des mots français commençant par la lettre ${upperLetter} avec leurs synonymes et antonymes`}
          url={`https://synonyma.fr/dictionnaire/${letter}`}
        />
        <BreadcrumbJsonLd
          items={[
            { name: "Accueil", url: "https://synonyma.fr" },
            { name: "Dictionnaire", url: "https://synonyma.fr/dictionnaire/a" },
            {
              name: `Lettre ${upperLetter}`,
              url: `https://synonyma.fr/dictionnaire/${letter}`,
            },
          ]}
        />
        <HydrationBoundary state={dehydratedState}>
          <DictionaryClient letter={letter} />
        </HydrationBoundary>
      </>
    );
  } catch (e) {
    return null;
  }
}
