import { supabase } from "lib/supabase/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const _word = await supabase
    .from("_word")
    .select(`*, synonymes:_synonyme!word_id(item:synm_id(*))`);
  res.status(200).json({ _word });
}

/**
 *   const _synonyme = await supabase.from("_synonyme").select(`
    *,
    word:word_id(*),
    synonym:synm_id(*)
  `);

 */
