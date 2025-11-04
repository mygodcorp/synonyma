import { NextRequest, NextResponse } from "next/server";
import getErrorMessage from "lib/openai/get-error-msg";
import getLookLike from "lib/supabase/queries/get-look-like";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ search: string }> }
) {
  try {
    const { search } = await params;
    
    if (!search) {
      throw new Error("Missing word parameter");
    }
    const result = await getLookLike(search);
    return NextResponse.json(
      {
        success: true,
        data: result,
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
