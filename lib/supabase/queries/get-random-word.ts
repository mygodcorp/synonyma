import { supabase } from "lib/supabase/supabase";

export default async function getRandomWord(column: string, value: any) {
  const { data, error } = await supabase
    .from("_word")
    .select("*")
    .eq(column, value)
    .limit(1)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
}
