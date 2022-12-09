import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const word = searchParams.get("word");

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "sans-serif",
          display: "flex",
          fontSize: 60,
          color: "black",
          fontWeight: "800",
          letterSpacing: "-3px",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>{word?.toUpperCase()}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
