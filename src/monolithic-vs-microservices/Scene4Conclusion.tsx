import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { fontFamily } from "./fonts";

export const Scene4Conclusion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background glow fades in
  const glowOpacity = interpolate(frame, [0, 40], [0, 0.18], {
    extrapolateRight: "clamp",
  });

  // Title slides down
  const titleSpring = spring({ frame, fps, config: { damping: 80, stiffness: 150 } });
  const titleY = interpolate(titleSpring, [0, 1], [-80, 0]);
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Card 1 slides from left with slight tilt
  const card1Spring = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 150 } });
  const card1X = interpolate(card1Spring, [0, 1], [-250, 0]);
  const card1Opacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card 2 slides from right
  const card2Spring = spring({ frame: frame - 66, fps, config: { damping: 14, stiffness: 150 } });
  const card2X = interpolate(card2Spring, [0, 1], [250, 0]);
  const card2Opacity = interpolate(frame, [66, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider bar draws across
  const dividerSpring = spring({ frame: frame - 100, fps, config: { damping: 80 } });
  const dividerWidth = interpolate(dividerSpring, [0, 1], [0, 260]);

  // Follow text fades up — gentle pulse via sin wave (no animate-pulse)
  const followOpacity = interpolate(frame, [121, 146], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const followPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.4),
    [-1, 1],
    [0.75, 1.0]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        fontFamily,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `rgba(59,130,246,${glowOpacity * 0.3})`,
          filter: "blur(120px)",
        }}
      />

      <div style={{ zIndex: 10, textAlign: "center" }}>
        {/* THE VERDICT */}
        <h2
          style={{
            fontSize: 96,
            fontWeight: 900,
            textTransform: "uppercase",
            color: "#2563eb",
            letterSpacing: "-0.05em",
            marginTop: 0,
            marginBottom: 40,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          THE VERDICT
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 56 }}>
          {/* Card 1 */}
          <div
            style={{
              padding: 44,
              border: "4px solid #3b82f6",
              background: "rgba(59,130,246,0.12)",
              borderRadius: 50,
              transform: `translateX(${card1X}px) rotate(1deg)`,
              opacity: card1Opacity,
            }}
          >
            <p
              style={{
                fontSize: 60,
                fontWeight: 900,
                textTransform: "uppercase",
                color: "#000",
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              Start with Monolith 🧱
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              padding: 44,
              border: "4px solid #10b981",
              background: "rgba(16,185,129,0.12)",
              borderRadius: 50,
              transform: `translateX(${card2X}px) rotate(-1deg)`,
              opacity: card2Opacity,
            }}
          >
            <p
              style={{
                fontSize: 60,
                fontWeight: 900,
                textTransform: "uppercase",
                color: "#000",
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              Split gradually 🛸
            </p>
          </div>
        </div>

        {/* Follow CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <p
            style={{
              fontSize: 44,
              fontWeight: 700,
              fontStyle: "italic",
              textTransform: "uppercase",
              color: "#d97706",
              margin: 0,
              opacity: followOpacity * followPulse,
            }}
          >
            Follow for more System Design!
          </p>
          <div
            style={{
              height: 14,
              background: "linear-gradient(to right, #3b82f6, #10b981)",
              borderRadius: 999,
              width: dividerWidth,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
