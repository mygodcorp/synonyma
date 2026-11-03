import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
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
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
