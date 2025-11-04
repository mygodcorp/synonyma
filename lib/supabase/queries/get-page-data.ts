import { supabase } from "lib/supabase/supabase";

const getPage = async (word: string) => {
  const { data, error } = await supabase
    .from("_word")
    .select(
      `*, synonymes:_synonyme!word_id(item:synm_id(*)), antonymes:_antonyme!word_id(item:antnm_id(*))`
    )
    .eq("word", `${word}`)
    .limit(1);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Not found");

  // Return the first result if there are duplicates
  return data[0];
};

export default getPage;
