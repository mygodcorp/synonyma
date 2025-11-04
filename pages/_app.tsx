import "styles/reset.css";
import "styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Script from "next/script";
import { DefaultSeo } from "next-seo";
import * as gtag from "utils/gtag";
import config from "website.config";
import { useRouter } from "next/router";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import localFont from "@next/font/local";
import { Header } from "components/header";
import { Footer } from "components/footer/footer";
import { Analytics } from "@vercel/analytics/react";

declare global {
  interface Window {
    gtag: any;
  }
}

// Font files can be colocated inside of `pages`
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

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <div className={myFont.className}>
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
      <DefaultSeo
        titleTemplate={config.site.title}
        canonical={`https://${process.env.NEXT_PUBLIC_WEBSITE_URL}`}
        defaultTitle="synonyma.fr - synonymes"
        description="synonyma.fr, tous les synonymes gratuits."
        openGraph={{ site_name: config.site.name, locale: config.site.locale }}
      />
      <Header />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
      <Footer />
      <Analytics />
    </div>
  );
}
