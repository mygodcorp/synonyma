import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import synonymes from "lib/openai/get-synonymes";
import format from "utils/format";
import upsertWords from "lib/supabase/mutations/upsert-words";
import upsertSynonymes from "lib/supabase/mutations/upsert-synonymes";
import getWord from "lib/supabase/queries/get-word";
import setDone from "lib/supabase/mutations/set-done";
import antonymes from "lib/openai/get-antonymes";
import upsertAntonymes from "lib/supabase/mutations/upsert-antonymes";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) {
  try {
    const { word } = await params;
    const decodedWord = decodeURIComponent(word);

    if (!decodedWord) {
      throw new Error("Missing word parameter");
    }
    const wordData = await getWord(decodedWord);
    const response = await antonymes(wordData.word);
    const [{ text: outcome }] = response.data.choices;
    const answer = format(outcome);
    const { data: words } = await upsertWords(answer);
    await upsertAntonymes(wordData.id, words as IParams[]);
    await setDone(wordData.id, { antonyme_processed: true });
    return NextResponse.json(
      {
        success: true,
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
