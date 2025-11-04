import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import synonymes from "lib/openai/get-synonymes";
import antonymes from "lib/openai/get-antonymes";
import definition from "lib/openai/get-definition";
import format, { match } from "utils/format";
import createWord from "lib/supabase/mutations/create-word";
import upsertWords from "lib/supabase/mutations/upsert-words";
import upsertSynonymes from "lib/supabase/mutations/upsert-synonymes";
import upsertAntonymes from "lib/supabase/mutations/upsert-antonymes";
import upsertDefinition from "lib/supabase/mutations/add-definition";
import setDone from "lib/supabase/mutations/set-done";
import getWord from "lib/supabase/queries/get-word";

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();

    if (!word) {
      throw new Error("Missing word parameter");
    }

    const normalizedWord = word.toLocaleLowerCase().trim();

    // 1. Check if word already exists
    let wordData;
    try {
      wordData = await getWord(normalizedWord);
      // If word exists and is already fully processed, return success
      if (
        wordData.synonyme_processed &&
        wordData.antonyme_processed &&
        wordData.definition_processed
      ) {
        return NextResponse.json(
          {
            success: true,
            data: { word: wordData },
            message: "Word already exists and is fully processed",
          },
          { status: 200 }
        );
      }
    } catch (error) {
      // Word doesn't exist, create it
      wordData = await createWord(normalizedWord);
    }

    const newWord = wordData;

    // 2. Call OpenAI APIs in parallel for better performance
    const [synonymesResponse, antonymesResponse, definitionResponse] = await Promise.all([
      synonymes(normalizedWord),
      antonymes(normalizedWord),
      definition(normalizedWord),
    ]);

    // 3. Extract and format the results
    const synonymesContent = synonymesResponse.choices[0].message.content || "";
    const antonymesContent = antonymesResponse.choices[0].message.content || "";
    const definitionContent = definitionResponse.choices[0].message.content || "";

    const synonymesList = format(synonymesContent);
    const antonymesList = format(antonymesContent);
    const definitionText = match(definitionContent);

    // 4. Insert synonymes and antonymes in parallel
    const [synonymesWords, antonymesWords] = await Promise.all([
      upsertWords(synonymesList),
      upsertWords(antonymesList),
    ]);

    // 5. Create relationships and add definition in parallel
    await Promise.all([
      upsertSynonymes(newWord.id, synonymesWords.data as IParams[]),
      upsertAntonymes(newWord.id, antonymesWords.data as IParams[]),
      definitionText ? upsertDefinition(newWord.id, definitionText) : Promise.resolve(),
    ]);

    // 6. Mark all as processed
    await setDone(newWord.id, {
      synonyme_processed: true,
      antonyme_processed: true,
      definition_processed: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          word: newWord,
          synonymes: synonymesList,
          antonymes: antonymesList,
          definition: definitionText,
        },
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
