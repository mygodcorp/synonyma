import { NextApiResponse, NextApiRequest } from "next";
import definition from "lib/openai/get-definition";
import getErrorMessage from "lib/openai/get-error-msg";
import { match } from "utils/format";
import getWord from "lib/supabase/queries/get-word";

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
    const words = match(outcome);
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
