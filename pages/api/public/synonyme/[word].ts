import { NextApiResponse, NextApiRequest } from "next";
import getErrorMessage from "lib/openai/get-error-msg";
import synonymes from "lib/openai/get-synonymes";
import format from "utils/format";
import upsertWords from "lib/supabase/mutations/upsert-words";
import upsertSynonymes from "lib/supabase/mutations/upsert-synonymes";
import getWord from "lib/supabase/queries/get-word";
import setDone from "lib/supabase/mutations/set-done";

interface RequestNext extends NextApiRequest {
  query: {
    word: string;
  };
}

export default async function handler(req: RequestNext, res: NextApiResponse) {
  try {
    if (!req.query.word) {
      throw new Error("Missing word parameter");
    }
    const word = await getWord(req.query.word);
    const response = await synonymes(word.word);
    const [{ text: outcome }] = response.data.choices;
    const answer = format(outcome);
    const { data: words } = await upsertWords(answer);
    const { data: result } = await upsertSynonymes(word.id, words as IParams[]);
    await setDone(word.id, { synonyme_processed: true });
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
