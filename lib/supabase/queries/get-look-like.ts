import { supabase } from "lib/supabase/supabase";

export default async function getLookLike(word: string) {
  const { data, error } = await supabase
    .from("_word")
    .select("*")
    .like(word, `%${word}%`)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
}
