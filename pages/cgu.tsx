import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Container } from "components/container/container";
import * as Grid from "components/grid";
import { LineBar } from "components/line-bar/line-bar";
import { List } from "components/list";
import { Spacer } from "components/spacer/spacer";
import { Text } from "components/text/text";
import { WordRow } from "components/word-row/word-row";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import getDictionary from "lib/supabase/queries/get-dictionary";
import getDictionaryClient from "utils/data/get-dictionary-client";
import { Box } from "components/box";
import { WordLoader } from "components/word-loader/word-loader";

function CGU() {
  return (
    <Fragment>
      <NextSeo
        title={`Conditions générales d'utilisation du site synonyma.fr`}
        description={`Conditions générales d'utilisation du site synonyma.fr`}
        defaultTitle={`Conditions générales d'utilisation du site synonyma.fr`}
        canonical={`https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/cgu`}
        openGraph={{
          title: `Conditions générales d'utilisation du site synonyma.fr`,
          description: `Conditions générales d'utilisation du site synonyma.fr`,
        }}
      />
      <Container as="main" py="PY-XL" px="PX-MD">
        <Spacer space="MD" />
        <Text as="h1" size="xlarge" transform="capitalize">
          CGU
        </Text>
        <Box as="article">
          <Text as="p" size="xs">
            Acceptation des conditions d'utilisation L'utilisation du site
            synonyma.fr implique l'acceptation pleine et entière des présentes
            conditions générales d'utilisation. En cas de non-acceptation de ces
            conditions, l'utilisateur est invité à ne pas utiliser le site.
          </Text>
          <Spacer space="SM" />
          <Text as="p" size="xs">
            Modification des conditions d'utilisation La société Dopamine se
            réserve le droit de modifier à tout moment et sans préavis les
            présentes conditions générales d'utilisation. L'utilisateur est donc
            invité à les consulter régulièrement.
          </Text>
          <Spacer space="SM" />
          <Text as="p" size="xs">
            Contenu du site Le site synonyma.fr propose une liste de synonymes
            pour des centaines de mots courants et spécialisés. La société
            Dopamine s'efforce de fournir des informations précises et à jour
            sur le site, mais ne peut garantir l'exactitude, la complétude ou
            l'actualité de son contenu. En conséquence, l'utilisateur reconnaît
            utiliser ces informations sous sa responsabilité exclusive.
          </Text>
          <Spacer space="SM" />
          <Text as="p" size="xs">
            Liens vers d'autres sites Le site synonyma.fr peut contenir des
            liens vers d'autres sites internet. La société Dopamine® ne dispose
            d'aucun contrôle sur ces sites et ne peut être tenue responsable de
            leur contenu. L'inclusion de ces liens ne signifie pas que la
            société Dopamine® approuve ou recommande ces sites.
          </Text>
          <Spacer space="SM" />
          <Text as="p" size="xs">
            Responsabilité de l'utilisateur L'utilisateur est seul responsable
            de l'utilisation qu'il fait du site synonyma.fr. La société
            Dopamine® ne pourra être tenue responsable de tout dommage direct ou
            indirect résultant de l'utilisation du site par l'utilisateur.
          </Text>
          <Spacer space="SM" />
          <Text as="p" size="xs">
            Propriété intellectuelle Le contenu du site synonyma.fr, comprenant
            notamment les textes, images, sons et vidéos, est protégé par le
            droit d'auteur et autres droits de propriété intellectuelle. Toute
            reproduction, représentation, modification, publication,
            transmission, dénaturation, totale ou partielle du contenu du site,
            par quelque procédé que ce soit, et sur quelque support que ce soit,
            est interdite, sauf autorisation expresse et préalable de la société
            Dopamine®.
          </Text>
          <Spacer space="SM" />
          <Text as="p" size="xs">
            Loi applicable et juridiction compétente Les présentes conditions
            générales d'utilisation sont régies et interprétées conformément à
            la loi française. Tout litige relatif à l'utilisation de celui-ci
            sera soumis aux tribunaux compétents de Versailles.
          </Text>
          <Spacer space="SM" />
          <Text as="p" size="xs">
            Contact Pour toute question ou suggestion concernant le site
            synonyma.fr, veuillez contacter la société Dopamine® par courriel à
            l'adresse bma@synonyma.fr. Ces conditions générales d'utilisation
            ont été mises à jour le 18/12/2022.
          </Text>
        </Box>
      </Container>
    </Fragment>
  );
}

export default CGU;
