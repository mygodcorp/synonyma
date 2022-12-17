import { NextApiResponse, NextApiRequest } from "next";
import definition from "lib/openai/get-definition";
import getErrorMessage from "lib/openai/get-error-msg";
import { match } from "utils/format";
import getWord from "lib/supabase/queries/get-word";
import setDone from "lib/supabase/mutations/set-done";
import upsertDefintion from "lib/supabase/mutations/add-definition";

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
    const response = await definition(word.word);
    const [{ text: outcome }] = response.data.choices;
    const data = match(outcome);
    await upsertDefintion(word.id, data as string);
    await setDone(word.id, { definition_processed: true });
    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
