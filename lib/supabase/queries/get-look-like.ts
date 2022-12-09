import { supabase } from "lib/supabase/supabase";

export default async function getLookLike(word: string) {
  const { data, error } = await supabase
    .from("_word")
    .select()
    .textSearch("fts", `'${word}'`, { config: "french", type: "plain" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
}
