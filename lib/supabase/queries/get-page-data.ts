import { supabase } from "lib/supabase/supabase";

const getPage = async (slug: string) => {
  const { data, error } = await supabase
    .from("_word")
    .select(
      `*, synonymes:_synonyme!word_id(item:synm_id(*)), antonymes:_antonyme!word_id(item:antnm_id(*))`
    )
    .eq("slug", `${slug}`)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
};

export default getPage;
