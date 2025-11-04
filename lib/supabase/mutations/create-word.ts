import slugify from "slugify";
import { supabase } from "lib/supabase/supabase";

/**
 * Create a new word in the database with all processing flags set to false
 */
const createWord = async (word: string) => {
  const { data, error } = await supabase
    .from("_word")
    .insert({
      word: word.toLocaleLowerCase(),
      slug: slugify(word),
      synonyme_processed: false,
      antonyme_processed: false,
      definition_processed: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Failed to create word");

  return data;
};

export default createWord;
