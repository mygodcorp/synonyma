// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "lib/supabase";
import { openai } from "lib/openai";
import { prompts } from "prompts";
import cuid from "cuid";
import slugify from "slugify";

function match(word: string | undefined) {
  return word?.match(/\[(.*?)\]/)![1];
}

function format(word: string | undefined) {
  if (match(word)) {
    return match(word)!
      .split(",")
      .map((item) => item.trim())
      .filter((item) => {
        if (item.match(/\s/)) return;
        return item;
      });
  }
  return [];
}

type WordT = {
  done: boolean;
  word: string;
  id: string;
};

type Data = {};

async function getWord(): Promise<WordT> {
  const { data } = await supabase
    .from("words")
    .select("*")
    .eq("processed", false)
    .limit(1)
    .single();
  return data;
}

async function setDone(id: string) {
  return await supabase
    .from("words")
    .update({ processed: true })
    .eq("id", id)
    .select();
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

async function getFamiliers(word: string) {
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompts.familiers(word),
    temperature: 0,
    max_tokens: 1860,
    top_p: 1,
    frequency_penalty: 2,
    presence_penalty: 2,
  });
  const [{ text: familiers }] = res.data.choices;
  return format(familiers);
}

async function getAntonymes(word: string) {
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompts.antonymes(word),
    temperature: 0,
    max_tokens: 1860,
    top_p: 1,
    frequency_penalty: 2,
    presence_penalty: 2,
  });
  const [{ text: antonymes }] = res.data.choices;
  return format(antonymes);
}

async function getDefintion(word: string) {
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompts.definition(word),
    temperature: 0,
    max_tokens: 1860,
    top_p: 1,
    frequency_penalty: 2,
    presence_penalty: 2,
  });
  const [{ text: definition }] = res.data.choices;
  return match(definition);
}

async function insert(word: string) {
  return await supabase
    .from("_word")
    .upsert(
      { word, slug: slugify(word) },
      { onConflict: "word", ignoreDuplicates: false }
    )
    .select();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word, id } = await getWord();
  const result = await insert(word);
  await setDone(id);
  res.status(200).json(result);
}

/** const definition = await getDefintion(word);
  const synonymes = await getSynonymes(word);
  const antonymes = await getAntonymes(word);
  const familiers = await getFamiliers(word);
  await insert(word, synonymes, antonymes, familiers, definition);
  await setDone(id); */
