import { supabase } from "lib/supabase/supabase";

export default async function getWord(word: string) {
  // Normalize Unicode to NFC to match database encoding
  const normalizedWord = word.normalize('NFC');

  const { data, error } = await supabase
    .from("_word")
    .select("*")
    .eq("word", normalizedWord)
    .limit(1);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Not found");

  // Return the first result if there are duplicates
  return data[0];
}
