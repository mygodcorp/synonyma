import { NextApiResponse, NextApiRequest } from "next";
import getErrorMessage from "lib/openai/get-error-msg";
import synonymes from "lib/openai/get-synonymes";
import format from "utils/format";
import upsertWords from "lib/supabase/mutations/upsert-words";
import upsertSynonymes from "lib/supabase/mutations/upsert-synonymes";
import getWord from "lib/supabase/queries/get-word";
import setDone from "lib/supabase/mutations/set-done";
import antonymes from "lib/openai/get-antonymes";
import upsertAntonymes from "lib/supabase/mutations/upsert-antonymes";

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
    const response = await antonymes(word.word);
    const [{ text: outcome }] = response.data.choices;
    const answer = format(outcome);
    const { data: words } = await upsertWords(answer);
    await upsertAntonymes(word.id, words as IParams[]);
    await setDone(word.id, { antonyme_processed: true });
    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
