import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function ogCard(title: string, kicker: string, line: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafafa",
          color: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontStyle: "italic" }}>Synonyma</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#666", fontFamily: "sans-serif" }}>{kicker}</div>
          <div style={{ display: "flex", fontSize: title.length > 18 ? 96 : 140, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#555", fontFamily: "sans-serif", borderTop: "1px solid #ddd", paddingTop: 24 }}>
          {line}
        </div>
      </div>
    ),
    size,
  );
}
