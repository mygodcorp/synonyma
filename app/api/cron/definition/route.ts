import { NextRequest, NextResponse } from "next/server";
import definition from "lib/openai/get-definition";
import getErrorMessage from "lib/openai/get-error-msg";
import { match } from "utils/format";
import getRandomWord from "lib/supabase/queries/get-random-word";
import setDone from "lib/supabase/mutations/set-done";

export async function GET(req: NextRequest) {
  try {
    const word = await getRandomWord("definition_processed", false);
    const response = await definition(word.word);
    const [{ text: outcome }] = response.data.choices;
    const words = match(outcome);
    await setDone(word.id, { definition_processed: true });
    return NextResponse.json(
      {
        success: true,
        data: words,
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
