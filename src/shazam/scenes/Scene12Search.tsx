import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 20 song fingerprint strings in the database
const DB_STRINGS = [
  "F2A1C8E304B7D695", "8E4F2B1A7D9C3605", "A3F7B2D1C8E496F0",
  "D5B8F3A2E1C79406", "C6E2D4B9F7A31085", "B1F8A5C2E3D70946",
  "E9A4B3F2C1D58067", "47B8C2E9A1F6D305", "3A9F2E8B1D7C5046",
  "F1D7C3A5B2E80694", "9E3B8A2F4C1D7605", "C8E5B2A9F3D1047A",
  "2F4A9E1B8C7D3065", "B6D2C9A4F1E80753", "E3A7F1B4C2D90568",
  "A8C1F4B2E9D70356", "D4E9B3F2A1C80765", "1C8F3A9B4E2D7506",
  "F5B2E8A1C3D9047E", "9A3C1F8B2D4E7605",
];
// Index of the matching string (matches our fingerprint)
const MATCH_IDX = 2;
const MATCH_STRING = "DIE_WITH_A_SMILE";

export const Scene12Search: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Green laser sweeps down (frames 10-90)
  const laserY = interpolate(frame, [10, 90], [320, 1380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Current scanned row index
  const scannedIdx = Math.floor(
    interpolate(frame, [10, 90], [0, DB_STRINGS.length - 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Match lock: laser snaps and holds at match row (frames 90-120)
  const matchLockSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 7, stiffness: 260 },
  });
  const lockedLaserY = interpolate(
    matchLockSpring,
    [0, 1],
    [laserY, 320 + (MATCH_IDX / (DB_STRINGS.length - 1)) * 1060]
  );
  const finalLaserY = frame >= 90 ? lockedLaserY : laserY;

  // Match flash
  const matchFlash = interpolate(frame, [90, 98], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Match result text appears
  const matchSpring = spring({
    frame: frame - 96,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  const sceneOp = interpolate(frame, [0, 12, 108, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ITEM_H = 53;
  const DB_TOP = 320;
  const CX = 540;
  const DB_RX = 220;
  const DB_RY = 38;
  const DB_H = 1060;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: sceneOp }}>
      {/* Match flash */}
      {matchFlash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#00ffcc",
            opacity: matchFlash * 0.35,
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
          <filter id="s12Glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="s12GlowSm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="dbClip">
            <rect x={CX - DB_RX} y={DB_TOP - DB_RY * 0.5} width={DB_RX * 2} height={DB_H + DB_RY} />
          </clipPath>
        </defs>

        {/* Database cylinder body */}
        <rect
          x={CX - DB_RX}
          y={DB_TOP}
          width={DB_RX * 2}
          height={DB_H}
          fill="rgba(5,3,0,0.95)"
          stroke="rgba(255,140,0,0.35)"
          strokeWidth={1.5}
        />

        {/* DB rows (fingerprint strings) */}
        <g clipPath="url(#dbClip)">
          {DB_STRINGS.map((str, i) => {
            const rowY = DB_TOP + i * ITEM_H + ITEM_H / 2;
            const isMatch = i === MATCH_IDX;
            const isScanned = i <= scannedIdx;
            const isRejected = isScanned && !isMatch && frame < 90;
            const matchHighlight = isMatch && frame >= 90;

            return (
              <g key={i}>
                {/* Row background flash on rejection */}
                {isRejected && Math.abs(i - scannedIdx) <= 1 && (
                  <rect
                    x={CX - DB_RX + 2}
                    y={rowY - ITEM_H / 2 + 2}
                    width={DB_RX * 2 - 4}
                    height={ITEM_H - 4}
                    fill="#ff3333"
                    opacity={0.08}
                  />
                )}
                {/* Match row highlight */}
                {matchHighlight && (
                  <rect
                    x={CX - DB_RX + 2}
                    y={rowY - ITEM_H / 2 + 2}
                    width={DB_RX * 2 - 4}
                    height={ITEM_H - 4}
                    fill="#00ffcc"
                    opacity={0.1 + Math.sin(frame / 5) * 0.05}
                    filter="url(#s12GlowSm)"
                  />
                )}
                <text
                  x={CX}
                  y={rowY + 6}
                  textAnchor="middle"
                  fill={
                    matchHighlight
                      ? "#00ffcc"
                      : isRejected && Math.abs(i - scannedIdx) <= 2
                      ? "#ff3333"
                      : "rgba(255,140,0,0.3)"
                  }
                  fontSize={14}
                  fontFamily="'Courier New', monospace"
                  fontWeight={matchHighlight ? 700 : 400}
                  opacity={matchHighlight ? 1 : 0.7}
                >
                  {str}
                </text>
              </g>
            );
          })}
        </g>

        {/* Top ellipse */}
        <ellipse cx={CX} cy={DB_TOP} rx={DB_RX} ry={DB_RY} fill="#0a0500" stroke="rgba(255,140,0,0.5)" strokeWidth={2} />
        {/* Bottom ellipse */}
        <ellipse cx={CX} cy={DB_TOP + DB_H} rx={DB_RX} ry={DB_RY} fill="#0a0500" stroke="rgba(255,140,0,0.3)" strokeWidth={1.5} />

        {/* Green laser line */}
        <line
          x1={CX - DB_RX - 20}
          y1={finalLaserY}
          x2={CX + DB_RX + 20}
          y2={finalLaserY}
          stroke="#00ffcc"
          strokeWidth={frame >= 90 ? 3 : 2}
          opacity={0.9}
          filter="url(#s12Glow)"
        />
        {/* Laser scan glow */}
        <rect
          x={CX - DB_RX}
          y={finalLaserY - 10}
          width={DB_RX * 2}
          height={20}
          fill="#00ffcc"
          opacity={0.06}
        />
      </svg>

      {/* MATCH result text */}
      {matchSpring > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: 1440,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: matchSpring,
            transform: `scale(${0.6 + matchSpring * 0.4})`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(0,255,204,0.1)",
              border: "2px solid #00ffcc",
              borderRadius: 12,
              padding: "14px 40px",
              boxShadow: `0 0 ${20 + Math.sin(frame / 6) * 10}px rgba(0,255,204,0.4)`,
            }}
          >
            <div
              style={{
                color: "#00ffcc",
                fontSize: 18,
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 4,
                opacity: 0.7,
              }}
            >
              MATCH FOUND
            </div>
            <div
              style={{
                color: "#00ffcc",
                fontSize: 36,
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                letterSpacing: 1,
                textShadow: "0 0 20px rgba(0,255,204,0.6)",
              }}
            >
              {MATCH_STRING}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
