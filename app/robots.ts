import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
