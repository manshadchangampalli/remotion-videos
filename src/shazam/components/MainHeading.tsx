import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface MainHeadingProps {
  title1?: string;
  title2?: string;
  subtitle?: string;
  startFrame?: number;
}

export const MainHeading: React.FC<MainHeadingProps> = ({
  title1 = "HOW",
  title2 = "SHAZAM",
  subtitle = "FINDS YOUR SONG",
  startFrame = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const titleSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 9, stiffness: 180 },
  });

  const subtitleSpring = spring({
    frame: frame - startFrame - 12,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const titleY = interpolate(titleSpring, [0, 1], [-80, 0]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.9, 1]);
  const titleOp = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(subtitleSpring, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Primary Titles */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: titleOp,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: -6,
            lineHeight: 0.85,
            WebkitTextStroke: "1px rgba(0, 242, 255, 0.4)",
            textShadow: "0 0 50px rgba(0, 242, 255, 0.3)",
          }}
        >
          {title1}
        </div>
        <div
          style={{
            fontSize: 110,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            color: "#00f2ff",
            letterSpacing: -4,
            lineHeight: 1,
            textShadow: "0 0 60px rgba(0, 242, 255, 0.6), 0 0 120px rgba(0, 242, 255, 0.2)",
          }}
        >
          {title2}
        </div>
      </div>

      {/* Subtitle with reveal effect */}
      <div
        style={{
          marginTop: 15,
          opacity: subtitleSpring,
          transform: `translateY(${subtitleY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.9)",
            letterSpacing: 6,
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(0, 242, 255, 0.3)",
          }}
        >
          {subtitle}
        </div>
        
        {/* Animated accent line */}
        <div
          style={{
            height: 4,
            width: interpolate(subtitleSpring, [0, 1], [0, 600]),
            background: "linear-gradient(90deg, transparent, #00f2ff, transparent)",
            borderRadius: 2,
            marginTop: 12,
            boxShadow: "0 0 15px rgba(0, 242, 255, 0.5)",
            marginInline: "auto",
          }}
        />
      </div>
    </div>
  );
};
