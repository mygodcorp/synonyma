import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Metadata } from "next";
import DictionaryClient from "./dictionary-client";
import getDictionary from "lib/supabase/queries/get-dictionary";

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
  return {
    title: `Lettre ${letter.toUpperCase()} : Mots et Synonymes qui commencent par la lettre ${letter.toUpperCase()}`,
    description: `Synonymes des mots de la lettre ${letter.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
    alternates: {
      canonical: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/dictionnaire/${letter}`,
    },
    openGraph: {
      title: `Lettre ${letter.toUpperCase()} : Mots et Synonymes qui commencent par la lettre ${letter.toUpperCase()}`,
      type: "article",
      images: [
        {
          url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${letter}`,
        },
      ],
      description: `Synonymes des mots de la lettre ${letter.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
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
      <HydrationBoundary state={dehydratedState}>
        <DictionaryClient letter={letter} />
      </HydrationBoundary>
    );
  } catch (e) {
    return null;
  }
}
