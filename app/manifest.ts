import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Synonyma - Dictionnaire de synonymes et antonymes",
    short_name: "Synonyma",
    description:
      "Dictionnaire de synonymes et antonymes en français. Trouvez rapidement tous les synonymes et antonymes de n'importe quel mot.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    lang: "fr",
    categories: ["education", "reference", "productivity"],
    icons: [
      {
        src: "/api/image/og?word=synonyma",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
