import "styles/reset.css";
import "styles/globals.css";
import Script from "next/script";
import config from "website.config";
import localFont from "next/font/local";
import { Header } from "components/header";
import { Footer } from "components/footer/footer";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Providers } from "./providers";
import {
  WebSiteJsonLd,
  OrganizationJsonLd,
} from "components/structured-data";

declare global {
  interface Window {
    gtag: any;
  }
}

const myFont = localFont({
  src: [
    {
      path: "../fonts/HelveticaNowDisplay-Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "../fonts/HelveticaNowDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: {
    template: config.site.title,
    default: "synonyma.fr - synonymes",
  },
  description:
    "Synonyma.fr est le dictionnaire de synonymes et antonymes en ligne le plus complet. Trouvez rapidement tous les synonymes et antonymes de n'importe quel mot français. Gratuit et facile à utiliser.",
  keywords: [
    "synonymes",
    "antonymes",
    "dictionnaire",
    "français",
    "mots",
    "vocabulaire",
    "langue française",
    "synonyme en ligne",
    "dictionnaire de synonymes",
    "antonyme en ligne",
  ],
  authors: [{ name: "Synonyma.fr" }],
  creator: "Synonyma.fr",
  publisher: "Synonyma.fr",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: config.site.name,
    locale: config.site.locale,
    url: config.site.url,
    title: "SYNONYMA - Dictionnaire de synonymes et antonymes gratuit",
    description:
      "Synonyma.fr est le dictionnaire de synonymes et antonymes en ligne le plus complet. Trouvez rapidement tous les synonymes et antonymes de n'importe quel mot français.",
    images: [
      {
        url: `${config.site.url}/api/image/og?word=synonyma`,
        width: 1200,
        height: 630,
        alt: "Synonyma.fr - Dictionnaire de synonymes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SYNONYMA - Dictionnaire de synonymes et antonymes gratuit",
    description:
      "Trouvez rapidement tous les synonymes et antonymes de n'importe quel mot français. Gratuit et facile à utiliser.",
    images: [`${config.site.url}/api/image/og?word=synonyma`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <WebSiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className={myFont.className}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="g-analytics">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
    });
  `}
        </Script>
        <Header />
        <Providers>{children}</Providers>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
