import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import getRandomWord from "lib/supabase/queries/get-random-word";
import getPage from "lib/supabase/queries/get-page-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      throw new Error("Missing word parameter");
    }
    const page = await getPage(slug);
    return NextResponse.json(page, { status: 201 });
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
