import { NextApiResponse, NextApiRequest } from "next";
import definition from "lib/openai/get-definition";
import getErrorMessage from "lib/openai/get-error-msg";
import { match } from "utils/format";
import getRandomWord from "lib/supabase/queries/get-random-word";
import setDone from "lib/supabase/mutations/set-done";

interface RequestNext extends NextApiRequest {
  query: {
    word: string;
  };
}

export default async function handler(req: RequestNext, res: NextApiResponse) {
  try {
    const word = await getRandomWord("definition_processed", false);
    const response = await definition(word.word);
    const [{ text: outcome }] = response.data.choices;
    const words = match(outcome);
    await setDone(word.id, { definition_processed: true });
    return res.status(201).json({
      success: true,
      data: words,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
