import slugify from "slugify";
import { supabase } from "lib/supabase/supabase";

const upsertDefintion = async (id: string, definition: string) => {
  return await supabase
    .from("_word")
    .update({ definition: definition })
    .match({ id: id })
    .select();
};

export default upsertDefintion;
