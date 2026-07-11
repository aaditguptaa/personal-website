import { ImageResponse } from "next/og";

export const alt = "Aadit Gupta — Field Atlas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#f3edde",
        color: "#26251d",
        padding: "36px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "2px solid #26251d",
          padding: "60px 72px",
          position: "relative",
          backgroundImage:
            "linear-gradient(to right, rgba(71,101,111,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,101,111,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 5,
            color: "#5c5849",
          }}
        >
          <span>SECTIONAL CHART — PERSONAL EDITION</span>
          <span>SHEET 1/1</span>
        </div>

        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            lineHeight: 1.02,
            marginTop: 44,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Aadit</span>
          <span style={{ color: "#c04e1c", fontStyle: "italic" }}>Gupta</span>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            letterSpacing: 3,
            marginTop: 40,
            color: "#26251d",
            display: "flex",
          }}
        >
          COMPUTER ENGINEERING · UNIVERSITY OF TORONTO
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 21,
            letterSpacing: 3,
            marginTop: 14,
            color: "#5c5849",
            display: "flex",
          }}
        >
          ML SYSTEMS × AUTONOMOUS FLIGHT — 43°39′N 79°23′W
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 42,
            left: 72,
            right: 72,
            borderTop: "3px dashed #c04e1c",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 72,
            width: 24,
            height: 24,
            border: "3px solid #c04e1c",
            transform: "rotate(45deg)",
            backgroundColor: "#f3edde",
            display: "flex",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
