import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { STARS, CONNECTIONS } from "../components/constellationData";

const HEX_CHARS = "0123456789ABCDEF";
// 32-char deterministic fingerprint string
const FINGERPRINT = Array.from({ length: 32 }, (_, i) =>
  HEX_CHARS[(i * 7 + 3) % 16]
).join("");

export const Scene10Fingerprint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Collapse spring: web pulls inward (frames 0-45)
  const collapseProgress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const COLLAPSE_CX = 540;
  const COLLAPSE_CY = 960;

  // Hex string appears as web collapses (frames 35-65)
  const hexSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 11, stiffness: 160 },
  });
  const hexScale = interpolate(hexSpring, [0, 1], [0.3, 1]);
  const hexOp = hexSpring;

  // Hex string spins
  const hexRotate = frame * 0.8;

  // Orange glow pulse
  const pulse = 0.5 + Math.sin(frame / 8) * 0.5;

  // Label
  const labelSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const sceneOp = interpolate(frame, [0, 12, 108, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOp = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="s10Glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="s10GlowOrange" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="s10GlowSm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Collapsing web */}
        {CONNECTIONS.map(([ai, bi], i) => {
          const a = STARS[ai];
          const b = STARS[bi];
          // Each point lerps toward center
          const ax = a.x + (COLLAPSE_CX - a.x) * collapseProgress;
          const ay = a.y + (COLLAPSE_CY - a.y) * collapseProgress;
          const bx = b.x + (COLLAPSE_CX - b.x) * collapseProgress;
          const by_ = b.y + (COLLAPSE_CY - b.y) * collapseProgress;
          return (
            <line
              key={i}
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by_}
              stroke="#00f2ff"
              strokeWidth={1.5}
              opacity={0.4 * (1 - collapseProgress * 0.85)}
              filter="url(#s10GlowSm)"
            />
          );
        })}

        {/* Collapsing star dots */}
        {STARS.map((star) => {
          const sx = star.x + (COLLAPSE_CX - star.x) * collapseProgress;
          const sy = star.y + (COLLAPSE_CY - star.y) * collapseProgress;
          return (
            <circle
              key={star.id}
              cx={sx}
              cy={sy}
              r={star.size * (1 - collapseProgress * 0.7)}
              fill="#00f2ff"
              opacity={0.8 * (1 - collapseProgress * 0.8)}
              filter="url(#s10GlowSm)"
            />
          );
        })}

        {/* Orange pulsing glow at center */}
        {hexOp > 0.05 && (
          <circle
            cx={COLLAPSE_CX}
            cy={COLLAPSE_CY}
            r={120 + pulse * 30}
            fill="#ff8c00"
            opacity={0.04 + pulse * 0.04}
            filter="url(#s10GlowOrange)"
          />
        )}
      </svg>

      {/* Spinning hex fingerprint */}
      {hexOp > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: COLLAPSE_CY - 100,
            left: COLLAPSE_CX - 200,
            width: 400,
            opacity: hexOp,
            transform: `scale(${hexScale})`,
            transformOrigin: "center center",
          }}
        >
          {/* Hex container */}
          <div
            style={{
              background: "rgba(255,140,0,0.06)",
              border: `1.5px solid rgba(255,140,0,${0.5 + pulse * 0.3})`,
              borderRadius: 16,
              padding: "18px 20px",
              textAlign: "center",
              boxShadow: `0 0 ${20 + pulse * 20}px rgba(255,140,0,${0.2 + pulse * 0.15})`,
              transform: `rotateY(${hexRotate}deg)`,
              transformOrigin: "center",
            }}
          >
            <div
              style={{
                color: "#ff8c00",
                fontSize: 18,
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                letterSpacing: 3,
                wordBreak: "break-all",
                lineHeight: 1.7,
                textShadow: `0 0 10px rgba(255,140,0,${0.4 + pulse * 0.3})`,
              }}
            >
              {FINGERPRINT.slice(0, 16)}
              <br />
              {FINGERPRINT.slice(16)}
            </div>
            <div
              style={{
                color: "rgba(255,140,0,0.5)",
                fontSize: 11,
                fontFamily: "'Courier New', monospace",
                marginTop: 10,
                letterSpacing: 2,
              }}
            >
              SHA-256 HASH FRAGMENT
            </div>
          </div>
        </div>
      )}

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelSpring,
          transform: `translateY(${interpolate(labelSpring, [0, 1], [50, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,140,0,0.08)",
            border: "1px solid #ff8c00",
            borderRadius: 8,
            padding: "10px 32px",
          }}
        >
          <span
            style={{
              color: "#ff8c00",
              fontSize: 28,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              letterSpacing: 3,
              textShadow: "0 0 14px rgba(255,140,0,0.6)",
            }}
          >
            DIGITAL FINGERPRINT
          </span>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOp,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 38,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          That measurement becomes a{" "}
          <span style={{ color: "#ff8c00" }}>unique fingerprint</span>
          <br />
          for that song.
        </div>
      </div>
    </AbsoluteFill>
  );
};
