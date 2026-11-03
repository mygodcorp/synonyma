import { NextResponse, type NextRequest } from "next/server";
import { search } from "@/lib/data";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").slice(0, 60);
  const results = search(q, 8).map(([w, , s, a]) => ({ w, s, a }));
  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
