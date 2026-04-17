import React from "react";

interface PhoneProps {
  width?: number;
  height?: number;
  color?: string;
  glowColor?: string;
  children?: React.ReactNode;
  opacity?: number;
}

export const Phone: React.FC<PhoneProps> = ({
  width = 300,
  height = 560,
  color = "#1a1a1a",
  glowColor = "rgba(0, 242, 255, 0.4)",
  children,
  opacity = 1,
}) => {
  const bezel = height * 0.05;
  const innerWidth = width - bezel * 1.5;
  const innerHeight = height - bezel * 1.5;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        opacity,
      }}
    >
      {/* Outer Glow */}
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: 44,
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(20px)",
          opacity: 0.6,
        }}
      />

      {/* Phone Case */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(145deg, #222, #000)",
          borderRadius: 40,
          padding: bezel / 1.5,
          border: `2px solid #333`,
          boxShadow: `inset 0 0 10px rgba(255,255,255,0.1), 0 15px 35px rgba(0,0,0,0.8)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bezel inner shine */}
        <div style={{ position: "absolute", inset: 2, borderRadius: 38, border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none" }} />

        {/* Screen */}
        <div
          style={{
            width: innerWidth,
            height: innerHeight,
            background: "#000",
            borderRadius: 32,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #111",
          }}
        >
          {children}
        </div>

        {/* Notch / Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: bezel / 1.2,
            width: width * 0.35,
            height: height * 0.035,
            background: "#050505",
            borderRadius: 20,
            border: "1px solid #222",
          }}
        />
        
        {/* Punch hole camera inside notch */}
        <div style={{ position: "absolute", top: bezel / 1.1, right: "40%", width: 6, height: 6, borderRadius: "50%", background: "#111", border: "1px solid #222" }} />
      </div>
    </div>
  );
};
