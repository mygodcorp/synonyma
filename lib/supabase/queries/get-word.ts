import { supabase } from "lib/supabase/supabase";

export default async function getWord(word: string) {
  const { data, error } = await supabase
    .from("_word")
    .select("*")
    .eq("word", word)
    .limit(1);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Not found");

  // Return the first result if there are duplicates
  return data[0];
}
