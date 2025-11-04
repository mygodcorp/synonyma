import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import synonymes from "lib/openai/get-synonymes";
import format from "utils/format";
import upsertWords from "lib/supabase/mutations/upsert-words";
import upsertSynonymes from "lib/supabase/mutations/upsert-synonymes";
import setDone from "lib/supabase/mutations/set-done";
import getRandomWord from "lib/supabase/queries/get-random-word";

export async function GET(req: NextRequest) {
  try {
    const word = await getRandomWord("synonyme_processed", false);
    const response = await synonymes(word.word);
    const outcome = response.choices[0].message.content || "";
    const answer = format(outcome);
    const { data: words } = await upsertWords(answer);
    const { data: result } = await upsertSynonymes(word.id, words as IParams[]);
    await setDone(word.id, { synonyme_processed: true });
    return NextResponse.json(
      {
        success: true,
        data: { words, result },
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
