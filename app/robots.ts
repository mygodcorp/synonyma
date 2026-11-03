import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/data";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const n = Math.ceil(getIndex().length / 40_000);
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/hasard"] },
      // Generative engines are welcome: the content is open data and cited with its sources.
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "MistralAI-User"],
        allow: ["/", "/llms.txt"],
        disallow: ["/api/", "/hasard"],
      },
    ],
    sitemap: Array.from({ length: n + 1 }, (_, i) => `${SITE.url}/sitemap/${i}.xml`),
  };
}
