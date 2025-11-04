import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import definition from "lib/openai/get-definition";
import { match } from "utils/format";
import getWord from "lib/supabase/queries/get-word";
import setDone from "lib/supabase/mutations/set-done";
import upsertDefinition from "lib/supabase/mutations/add-definition";

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
    const response = await definition(wordData.word);
    const outcome = response.choices[0].message.content || "";
    const definitionText = match(outcome);

    if (definitionText) {
      await upsertDefinition(wordData.id, definitionText);
    }

    await setDone(wordData.id, { definition_processed: true });

    return NextResponse.json(
      {
        success: true,
        data: definitionText,
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
