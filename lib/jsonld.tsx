import { DATA_STATS } from "./data";
import { SITE } from "./site";

export const abs = (path: string) => (path.startsWith("http") ? path : SITE.url + path);

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: "Synonyma",
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  sameAs: ["https://github.com/mygodcorp/synonyma"],
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: "https://github.com/mygodcorp/synonyma/issues", availableLanguage: "French" },
};

export const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: "Synonyma",
  url: SITE.url,
  inLanguage: "fr-FR",
  publisher: { "@id": ORGANIZATION["@id"] },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/{search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export const DATASET_LICENSES = DATA_STATS.sources.map((s) => ({
  "@type": "CreativeWork",
  name: s.name,
  url: s.url,
  license: s.license,
}));

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const graph = { "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
