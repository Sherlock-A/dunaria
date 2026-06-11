import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0F1A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Gold accent line */}
        <div
          style={{
            width: "72px",
            height: "2px",
            background: "#C8A45D",
            marginBottom: "36px",
          }}
        />
        {/* Brand name */}
        <div
          style={{
            fontSize: "104px",
            color: "#C8A45D",
            fontWeight: "400",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Dunaria
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: "26px",
            color: "#D6B878",
            marginTop: "24px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          Saharan Travel &amp; Culture
        </div>
        {/* Bottom accent */}
        <div
          style={{
            width: "72px",
            height: "2px",
            background: "#C8A45D",
            marginTop: "36px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
