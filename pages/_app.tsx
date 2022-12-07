import "styles/reset.css";
import "styles/globals.css";
import type { AppProps } from "next/app";
import { Fragment, useEffect, useState } from "react";
import Script from "next/script";
import { DefaultSeo } from "next-seo";
import * as gtag from "utils/gtag";
import config from "website.config";
import { useRouter } from "next/router";
import Footer from "components/footer";
import Header from "components/header";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

declare global {
  interface Window {
    gtag: any;
  }
}

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
    <Fragment>
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
    </Fragment>
  );
}
