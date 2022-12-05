import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { NextApiResponse, NextApiRequest } from "next";

type Data = {};

async function search(word: string): Promise<any> {
  return word;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await search(req.query.word as string);
  return res.status(201).json(result);
}
