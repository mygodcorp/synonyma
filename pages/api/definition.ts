// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "lib/supabase/supabase";
import { openai } from "lib/openai/openai";
import { prompts } from "lib/openai/prompts";

function match(word: string | undefined) {
  return word?.match(/\[(.*?)\]/)![1];
}

type WordT = {
  done: boolean;
  word: string;
  id: string;
};

type Data = {};

async function getWord(): Promise<WordT> {
  const { data } = await supabase
    .from("_word")
    .select("*")
    .eq("definition_processed", false)
    .limit(1)
    .single();
  return data;
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

async function insert(id: string, definition: string | undefined) {
  return await supabase
    .from("_word")
    .update({ definition: definition, definition_processed: true })
    .eq("id", id)
    .select();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word, id } = await getWord();
  const definition = await getDefintion(word);
  const result = await insert(id, definition);

  res.status(200).json(result);
}
