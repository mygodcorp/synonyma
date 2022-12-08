import { supabase } from "lib/supabase/supabase";

const upsertAntonymes = async (id: string, antonymes: Array<IParams>) => {
  const options = {
    onConflict: "word_id, antnm_id",
    ignoreDuplicates: false,
  };
  return await supabase
    .from("_antonyme")
    .upsert(
      antonymes?.map((item) => ({
        word_id: id,
        antnm_id: item.id,
      })),
      options
    )
    .select("*");
};

export default upsertAntonymes;
