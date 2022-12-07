import { NextApiResponse, NextApiRequest } from "next";
import getErrorMessage from "lib/openai/get-error-msg";
import getRandomWord from "lib/supabase/queries/get-random-word";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const word = await getRandomWord("definition_processed", false);
    return res.status(201).json({
      success: true,
      data: word,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
