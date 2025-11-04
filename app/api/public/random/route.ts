import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import getRandomWord from "lib/supabase/queries/get-random-word";

export async function GET(req: NextRequest) {
  try {
    const word = await getRandomWord("definition_processed", false);
    return NextResponse.json(
      {
        success: true,
        data: word,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
