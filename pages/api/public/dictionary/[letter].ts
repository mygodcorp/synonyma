import { NextApiResponse, NextApiRequest } from "next";
import getErrorMessage from "lib/openai/get-error-msg";
import getRandomWord from "lib/supabase/queries/get-random-word";
import getPage from "lib/supabase/queries/get-page-data";
import getDictionary from "lib/supabase/queries/get-dictionary";

interface RequestNext extends NextApiRequest {
  query: {
    letter: string;
    page: string;
  };
}

export default async function handler(req: RequestNext, res: NextApiResponse) {
  try {
    if (!req.query.letter || !req.query.page) {
      throw new Error("Missing parameters");
    }
    const page = await getDictionary(req.query.letter, Number(req.query.page));
    return res.status(201).json(page);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
