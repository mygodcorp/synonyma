import { dehydrate, QueryClient } from "@tanstack/react-query";
import getMostSearchedWord from "lib/supabase/queries/get-most-searched";
import HomeClient from "./home-client";
import { HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

export const revalidate = 10000;

export const metadata: Metadata = {
  title: "SYNONYMA - Dictionnaire de synonymes et antonymes en français",
  description:
    "Découvrez le dictionnaire de synonymes et antonymes le plus complet en français. Recherchez parmi des milliers de mots pour enrichir votre vocabulaire. Service gratuit et rapide.",
  keywords: [
    "dictionnaire synonymes",
    "synonymes français",
    "antonymes",
    "vocabulaire",
    "langue française",
    "enrichir vocabulaire",
    "chercher synonyme",
  ],
  openGraph: {
    title: "SYNONYMA - Dictionnaire de synonymes et antonymes en français",
    description:
      "Découvrez le dictionnaire de synonymes et antonymes le plus complet en français. Recherchez parmi des milliers de mots pour enrichir votre vocabulaire.",
    type: "website",
    url: "https://synonyma.fr",
    images: [
      {
        url: "https://synonyma.fr/api/image/og?word=synonyma",
        width: 1200,
        height: 630,
        alt: "Synonyma.fr - Dictionnaire de synonymes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SYNONYMA - Dictionnaire de synonymes et antonymes en français",
    description:
      "Découvrez le dictionnaire de synonymes et antonymes le plus complet en français. Recherchez parmi des milliers de mots.",
    images: ["https://synonyma.fr/api/image/og?word=synonyma"],
  },
  alternates: {
    canonical: "https://synonyma.fr",
  },
};

export default async function Home() {
  const queryClient = new QueryClient();
  
  await queryClient.fetchQuery({
    queryKey: ["homepage"],
    queryFn: () => getMostSearchedWord(10),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeClient limit={10} />
    </HydrationBoundary>
  );
}
