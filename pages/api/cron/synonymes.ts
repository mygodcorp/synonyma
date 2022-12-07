import { NextApiResponse, NextApiRequest } from "next";
import getErrorMessage from "lib/openai/get-error-msg";
import synonymes from "lib/openai/get-synonymes";
import format from "utils/format";
import upsertWords from "lib/supabase/mutations/upsert-words";
import upsertSynonymes from "lib/supabase/mutations/upsert-synonymes";
import setDone from "lib/supabase/mutations/set-done";
import getRandomWord from "lib/supabase/queries/get-random-word";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const word = await getRandomWord("synonyme_processed", false);
    const response = await synonymes(word.word);
    const [{ text: outcome }] = response.data.choices;
    const answer = format(outcome);
    const { data: words } = await upsertWords(answer);
    const { data: result } = await upsertSynonymes(word.id, words as IParams[]);
    await setDone(word.id, { synonyme_processed: true });
    return res.status(201).json({
      success: true,
      data: { words, result },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
