import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQueryInput } from "querystring";

interface IParams extends ParsedUrlQueryInput {
  created_at: string;
  word: string;
  synonyme_processed: false;
  definition: string | null;
  slug: string;
  id: string;
  definition_processed: false;
}

function Synonyme(props: IParams[]) {
  console.log(props);
  return null;
}

export default Synonyme;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = (await supabase
    .from("_word")
    .select("*")) as PostgrestSingleResponse<IParams[]>;
  const paths = data!.map((item) => {
    return {
      params: { slug: item.slug },
    };
  });
  return { fallback: "blocking", paths };
};

export const getStaticProps: GetStaticProps<{
  words: IParams[] | null;
}> = async (context) => {
  const { data: words } = await supabase
    .from("_word")
    .select(`*, synonymes:_synonyme!word_id(item:synm_id(*))`)
    .eq("slug", `${context.params?.slug}`);
  return { props: { words }, revalidate: 10000 };
};
