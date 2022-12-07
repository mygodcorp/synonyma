// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "lib/supabase/supabase";
import { openai } from "lib/openai/openai";
import { prompts } from "lib/openai/prompts";
import slugify from "slugify";
import format from "utils/format";

type WordT = {
  done: boolean;
  word: string;
  id: string;
};

type Data = {};

async function setDone(id: string) {
  return await supabase
    .from("_word")
    .update({ synonyme_processed: true })
    .eq("id", id)
    .select();
}

async function getWord(): Promise<WordT> {
  const { data } = await supabase
    .from("_word")
    .select("*")
    .eq("synonyme_processed", false)
    .limit(1)
    .single();
  return data;
}

async function getSynonymes(word: string) {
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompts.synonymes(word),
    temperature: 0,
    max_tokens: 1860,
    top_p: 1,
    frequency_penalty: 2,
    presence_penalty: 2,
  });
  const [{ text: synonymes }] = res.data.choices;
  return format(synonymes);
}

async function insert(id: string, synonymes: Array<string>) {
  // does theses words exist already?
  const { data } = await supabase
    .from("_word")
    .upsert(
      synonymes.map((item) => ({
        word: item,
        slug: slugify(item),
      })),
      {
        onConflict: "word",
        ignoreDuplicates: false,
      }
    )
    .select();
  const { data: res, error } = await supabase
    .from("_synonyme")
    .upsert(
      data?.map((item) => ({
        word_id: id,
        synm_id: item.id,
      })),
      {
        onConflict: "word_id,synm_id",
        ignoreDuplicates: false,
      }
    )
    .select("*");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word, id } = await getWord();
  const synonymes = await getSynonymes(word);
  await insert(id, synonymes);
  await setDone(id);

  res.status(200).json({ synonymes, word, id });
}
