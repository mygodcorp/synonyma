import { supabase } from "lib/supabase/supabase";

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;
  return { from, to };
};

const getDictionary = async (
  letter: string | undefined,
  page: number
): Promise<PaginatedResponse> => {
  page = page || 0;
  if (!letter) throw new Error("Missing parameters");
  const { from, to } = getPagination(page, 20);
  const { data, error } = await supabase
    .from("_word")
    .select("*", { count: "estimated" })
    .like("word", `${letter}%`)
    .range(from, to)
    .order("word", { ascending: true });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return { data: data, page: page + 1, size: 20, total: data.length };
};

export default getDictionary;
