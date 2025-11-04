import { MetadataRoute } from "next";
import { supabase } from "lib/supabase/supabase";

export const revalidate = 86400; // Régénérer le sitemap toutes les 24h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}`;

  // Récupérer tous les mots depuis Supabase
  const { data: words } = await supabase.from("_word").select("word");

  // URLs des mots
  const wordUrls: MetadataRoute.Sitemap =
    words?.map((item) => ({
      url: `${baseUrl}/${item.word}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  // URLs des lettres du dictionnaire (A-Z)
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const dictionaryUrls: MetadataRoute.Sitemap = letters.map((letter) => ({
    url: `${baseUrl}/dictionnaire/${letter}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // URLs statiques
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cgu`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...dictionaryUrls, ...wordUrls];
}
