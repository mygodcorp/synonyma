import { supabase } from "lib/supabase/supabase";

async function setDone(id: string, options: object) {
  return await supabase.from("_word").update(options).eq("id", id).select();
}

export default setDone;
