import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import getRandomWord from "lib/supabase/queries/get-random-word";
import getPage from "lib/supabase/queries/get-page-data";
import getDictionary from "lib/supabase/queries/get-dictionary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ letter: string }> }
) {
  try {
    const { letter } = await params;
    const { searchParams } = req.nextUrl;
    const page = searchParams.get("page");
    
    if (!letter || !page) {
      throw new Error("Missing parameters");
    }
    const dictionaryPage = await getDictionary(letter, Number(page));
    return NextResponse.json(dictionaryPage, { status: 201 });
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
