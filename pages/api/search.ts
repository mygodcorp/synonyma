import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase/supabase";
import { NextApiResponse, NextApiRequest } from "next";

type Data = {};

async function search(word: string): Promise<IParams[]> {
  const { data } = (await supabase
    .from("_word")
    .select("word, slug")
    .like("word", `${word}%`)
    .order("word", { ascending: true })) as PostgrestSingleResponse<IParams[]>;
  if (!data) return [];
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await search(req.query.q as string);
  return res.status(201).json(result);
}
