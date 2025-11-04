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
  title: {
    template: config.site.title,
    default: "synonyma.fr - synonymes",
  },
  description: "synonyma.fr, tous les synonymes gratuits.",
  openGraph: {
    siteName: config.site.name,
    locale: config.site.locale,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
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
