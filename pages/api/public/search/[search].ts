import { NextApiResponse, NextApiRequest } from "next";
import getErrorMessage from "lib/openai/get-error-msg";
import getLookLike from "lib/supabase/queries/get-look-like";

interface RequestNext extends NextApiRequest {
  query: {
    search: string;
  };
}

export default async function handler(req: RequestNext, res: NextApiResponse) {
  try {
    if (!req.query.search) {
      throw new Error("Missing word parameter");
    }
    const result = await getLookLike(req.query.search);
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
