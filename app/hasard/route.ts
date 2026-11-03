import { NextResponse, type NextRequest } from "next/server";
import { getIndex } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Redirects to a random single-word entry that has a few synonyms. */
export function GET(req: NextRequest) {
  const rows = getIndex();
  for (let tries = 0; tries < 50; tries++) {
    const r = rows[Math.floor(Math.random() * rows.length)];
    if (r[2] >= 3 && !r[0].includes(" ") && r[0] === r[0].toLowerCase()) {
      const res = NextResponse.redirect(new URL(`/${encodeURIComponent(r[0])}`, req.url), 307);
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
  }
  return NextResponse.redirect(new URL("/", req.url), 307);
}
