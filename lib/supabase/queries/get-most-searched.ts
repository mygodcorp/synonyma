import { supabase } from "lib/supabase/supabase";

export default async function getMostSearchedWord(limit: number) {
  const { data, error } = await supabase
    .from("_word")
    .select("*")
    .like("word", `b%`)
    .limit(limit);
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
}
