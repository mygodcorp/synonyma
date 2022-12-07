import { supabase } from "lib/supabase/supabase";

export default async function getRandomWord() {
  const { data, error } = await supabase
    .from("_word")
    .select("*")
    .eq("synonyme_processed", false)
    .limit(1)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
}
