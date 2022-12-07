import { supabase } from "lib/supabase/supabase";

export default async function getWord(slug: string) {
  const { data, error } = await supabase
    .from("_word")
    .select("*")
    .eq("slug", slug)
    .single();
  console.log(slug);
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
}
