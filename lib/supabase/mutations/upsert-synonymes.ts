import slugify from "slugify";
import { supabase } from "lib/supabase/supabase";

const upsertSynonymes = async (id: string, synonymes: Array<IParams>) => {
  const options = {
    onConflict: "word_id,synm_id",
    ignoreDuplicates: false,
  };
  return await supabase
    .from("_synonyme")
    .upsert(
      synonymes?.map((item) => ({
        word_id: id,
        synm_id: item.id,
      })),
      options
    )
    .select("*");
};

export default upsertSynonymes;
