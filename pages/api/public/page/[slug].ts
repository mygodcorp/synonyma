import { NextApiResponse, NextApiRequest } from "next";
import getErrorMessage from "lib/openai/get-error-msg";
import getRandomWord from "lib/supabase/queries/get-random-word";
import getPage from "lib/supabase/queries/get-page-data";

interface RequestNext extends NextApiRequest {
  query: {
    slug: string;
  };
}

export default async function handler(req: RequestNext, res: NextApiResponse) {
  try {
    if (!req.query.slug) {
      throw new Error("Missing word parameter");
    }
    const page = await getPage(req.query.slug);
    return res.status(201).json(page);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
}
