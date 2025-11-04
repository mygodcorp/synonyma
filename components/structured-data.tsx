/**
 * Composant pour insérer des données structurées JSON-LD
 * Sécurisé contre les attaques XSS en utilisant dangerouslySetInnerHTML
 * avec sanitization des caractères dangereux
 */

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  // Sécurisation contre XSS: remplacer < par son équivalent unicode
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

/**
 * Génère les données structurées pour le site web (WebSite schema)
 */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Synonyma",
    alternateName: "Synonyma.fr",
    url: "https://synonyma.fr",
    description:
      "Dictionnaire de synonymes et antonymes en ligne gratuit en français. Trouvez rapidement tous les synonymes et antonymes de n'importe quel mot.",
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://synonyma.fr/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Synonyma",
      url: "https://synonyma.fr",
      logo: {
        "@type": "ImageObject",
        url: "https://synonyma.fr/api/image/og?word=synonyma",
      },
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Génère les données structurées pour l'organisation (Organization schema)
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Synonyma",
    url: "https://synonyma.fr",
    logo: "https://synonyma.fr/api/image/og?word=synonyma",
    description:
      "Le dictionnaire de synonymes et antonymes en ligne le plus complet en français.",
    sameAs: [],
  };

  return <JsonLd data={data} />;
}

/**
 * Génère les données structurées pour un fil d'Ariane (BreadcrumbList schema)
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * Génère les données structurées pour une définition de terme (DefinedTerm schema)
 */
interface DefinedTermJsonLdProps {
  word: string;
  definition?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export function DefinedTermJsonLd({
  word,
  definition,
  synonyms = [],
  antonyms = [],
}: DefinedTermJsonLdProps) {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: word,
    inLanguage: "fr-FR",
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Synonyma Dictionary",
      description: "Dictionnaire français de synonymes et antonymes",
    },
  };

  if (definition) {
    data.description = definition;
  }

  // Ajouter les relations sémantiques pour les AI
  if (synonyms.length > 0 || antonyms.length > 0) {
    data.alternateName = synonyms;
  }

  // Schema.org ne supporte pas directement les antonymes,
  // mais on peut les inclure dans la description pour les AI
  if (definition && antonyms.length > 0) {
    data.description = `${definition} Antonymes: ${antonyms.join(", ")}`;
  }

  return <JsonLd data={data} />;
}

/**
 * Génère les données structurées pour une page de collection (CollectionPage schema)
 */
interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function CollectionPageJsonLd({
  name,
  description,
  url,
}: CollectionPageJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Synonyma",
      url: "https://synonyma.fr",
    },
    inLanguage: "fr-FR",
  };

  return <JsonLd data={data} />;
}
