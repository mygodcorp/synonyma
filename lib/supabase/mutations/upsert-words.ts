import slugify from "slugify";
import { supabase } from "lib/supabase/supabase";

const upsertWords = async (synonymes: Array<string>) => {
  const options = {
    onConflict: "word",
    ignoreDuplicates: false,
  };
  return await supabase
    .from("_word")
    .upsert(
      synonymes.map((item) => ({
        word: item,
        slug: slugify(item),
      })),
      options
    )
    .select();
};

export default upsertWords;
