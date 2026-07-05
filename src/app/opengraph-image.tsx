import { ImageResponse } from "next/og";

export const alt = "Aadit Gupta — Player One";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#05070f",
        backgroundImage:
          "radial-gradient(circle at 15% 15%, rgba(0,171,240,0.35), transparent 45%), radial-gradient(circle at 85% 80%, rgba(176,38,255,0.3), transparent 45%)",
        color: "#e6f1ff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 30,
          letterSpacing: 6,
          color: "#ffd23f",
          marginBottom: 24,
        }}
      >
        🎮 PLAYER ONE — READY
      </div>
      <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.05 }}>
        Aadit Gupta
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          color: "#00eaff",
          marginTop: 12,
        }}
      >
        Computer Engineering · ML · Full-Stack
      </div>
      <div style={{ fontSize: 30, color: "#c6d8ff", marginTop: 28 }}>
        University of Toronto — gamified portfolio
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          height: 8,
          width: 1040,
          backgroundImage: "linear-gradient(90deg, #00eaff, #b026ff, #ff2e97)",
          borderRadius: 8,
        }}
      />
    </div>,
    { ...size },
  );
}
