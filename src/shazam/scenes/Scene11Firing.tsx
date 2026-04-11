import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FINGERPRINT = "A3F7B2D1C8E496F0";

export const Scene11Firing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hex string shoots from center toward database (top area)
  const shootSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 9, stiffness: 220 },
  });
  const hexY = interpolate(shootSpring, [0, 1], [960, 540]);
  const hexScale = interpolate(shootSpring, [0, 0.6, 1], [1, 1.2, 0.7]);

  // Database cylinder rises in
  const dbSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const dbY = interpolate(dbSpring, [0, 1], [-350, 540]);

  // Impact at frame ~40
  const impactFrame = 40;
  const impactSpring = spring({
    frame: frame - impactFrame,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const shockScale = interpolate(impactSpring, [0, 1], [0.1, 3.5]);
  const shockOp = interpolate(impactSpring, [0, 0.15, 1], [0, 0.9, 0]);
  const impactFlash = interpolate(frame, [impactFrame, impactFrame + 8], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // DB glows on impact
  const dbGlow = frame >= impactFrame
    ? 0.3 + Math.sin(frame / 6) * 0.15
    : 0.1;

  // Hex string visible until impact
  const hexOp = interpolate(frame, [0, 8, impactFrame - 3, impactFrame + 5], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label
  const labelSpring = spring({
    frame: frame - impactFrame - 5,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const sceneOp = interpolate(frame, [0, 12, 78, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOp = interpolate(frame, [50, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Motion trail for flying hex
  const trailCount = 5;

  const CX = 540;
  const DB_CY = 540;
  const DB_RX = 220;
  const DB_RY = 45;
  const DB_H = 260;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      {/* Impact flash */}
      {impactFlash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#ff8c00",
            opacity: impactFlash * 0.45,
            pointerEvents: "none",
          }}
        />
      )}

      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="s11Glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="s11GlowSm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="dbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0800" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
        </defs>

        {/* Database cylinder */}
        <g transform={`translate(${CX}, ${dbY})`}>
          {/* Main cylinder body */}
          <rect
            x={-DB_RX}
            y={0}
            width={DB_RX * 2}
            height={DB_H}
            fill="url(#dbGrad)"
            stroke={`rgba(255,140,0,${dbGlow * 1.2})`}
            strokeWidth={2}
          />
          {/* Top ellipse */}
          <ellipse
            cx={0}
            cy={0}
            rx={DB_RX}
            ry={DB_RY}
            fill="#0a0500"
            stroke={`rgba(255,140,0,${dbGlow * 1.5})`}
            strokeWidth={2.5}
            filter="url(#s11GlowSm)"
          />
          {/* Bottom ellipse */}
          <ellipse
            cx={0}
            cy={DB_H}
            rx={DB_RX}
            ry={DB_RY}
            fill="#0a0500"
            stroke={`rgba(255,140,0,${dbGlow})`}
            strokeWidth={1.5}
          />
          {/* Horizontal rings */}
          {[0.25, 0.5, 0.75].map((t, i) => (
            <line
              key={i}
              x1={-DB_RX}
              y1={DB_H * t}
              x2={DB_RX}
              y2={DB_H * t}
              stroke={`rgba(255,140,0,${dbGlow * 0.6})`}
              strokeWidth={1}
              strokeDasharray="8 6"
            />
          ))}
          {/* Glow ring on impact */}
          {impactSpring > 0.05 && (
            <ellipse
              cx={0}
              cy={0}
              rx={DB_RX * (1 + impactSpring * 0.3)}
              ry={DB_RY * (1 + impactSpring * 0.3)}
              fill="none"
              stroke="#ff8c00"
              strokeWidth={3}
              opacity={0.6 * (1 - impactSpring)}
              filter="url(#s11Glow)"
            />
          )}
        </g>

        {/* Shockwave ring on impact */}
        {shockOp > 0.02 && (
          <circle
            cx={CX}
            cy={DB_CY}
            r={180}
            fill="none"
            stroke="#ff8c00"
            strokeWidth={3}
            opacity={shockOp}
            transform={`scale(${shockScale})`}
            style={{ transformOrigin: `${CX}px ${DB_CY}px` }}
            filter="url(#s11Glow)"
          />
        )}

        {/* Motion trail */}
        {hexOp > 0.05 &&
          Array.from({ length: trailCount }, (_, i) => (
            <rect
              key={i}
              x={CX - 90}
              y={hexY + (i + 1) * 16}
              width={180}
              height={36}
              rx={6}
              fill="none"
              stroke="#ff8c00"
              strokeWidth={1}
              opacity={hexOp * (trailCount - i) / (trailCount * 3)}
            />
          ))}
      </svg>

      {/* Flying hex string */}
      {hexOp > 0.02 && (
        <div
          style={{
            position: "absolute",
            left: CX - 160,
            top: hexY - 22,
            width: 320,
            opacity: hexOp,
            transform: `scaleX(${hexScale})`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,140,0,0.1)",
              border: "1.5px solid #ff8c00",
              borderRadius: 8,
              padding: "8px 16px",
              textAlign: "center",
              boxShadow: "0 0 20px rgba(255,140,0,0.3)",
            }}
          >
            <span
              style={{
                color: "#ff8c00",
                fontSize: 22,
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                letterSpacing: 3,
                textShadow: "0 0 8px rgba(255,140,0,0.6)",
              }}
            >
              {FINGERPRINT}
            </span>
          </div>
        </div>
      )}

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 840,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelSpring,
          transform: `translateY(${interpolate(labelSpring, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,140,0,0.1)",
            border: "1px solid #ff8c00",
            borderRadius: 8,
            padding: "10px 32px",
          }}
        >
          <span
            style={{
              color: "#ff8c00",
              fontSize: 44,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              letterSpacing: 2,
              textShadow: "0 0 20px rgba(255,140,0,0.6)",
            }}
          >
            50,000,000 SONGS
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
          Fingerprint fires into a{" "}
          <span style={{ color: "#ff8c00" }}>database</span>
          <br />
          of 50 million songs.
        </div>
      </div>
    </AbsoluteFill>
  );
};
