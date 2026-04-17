import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";

// Grid of node points for background network
const NODES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: 60 + (i % 6) * 196,
  y: 600 + Math.floor(i / 6) * 220,
  size: 5 + (i % 4) * 2,
}));

export const Scene15Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Nodes explode in
  const nodeSpring = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 80 } });
  const nodePositions = NODES.map((n) => {
    const cx = 540;
    const cy = 960;
    return {
      ...n,
      rx: cx + (n.x - cx) * nodeSpring,
      ry: cy + (n.y - cy) * nodeSpring,
    };
  });

  // Network lines
  const linesOp = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "MIDDLEMAN" slams in
  const TEXT1_FRAME = 45;
  const text1Spring = spring({
    frame: frame - TEXT1_FRAME,
    fps,
    config: { damping: 5, stiffness: 320 },
  });
  const text1Y = interpolate(text1Spring, [0, 1], [-300, 0]);
  const text1Scale = interpolate(text1Spring, [0, 0.7, 1], [1.5, 0.9, 1]);
  const text1Op = interpolate(frame, [TEXT1_FRAME, TEXT1_FRAME + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slam flash
  const slamFlash1 = interpolate(frame, [TEXT1_FRAME + 2, TEXT1_FRAME + 14], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Screen shake on slam
  const shakeX =
    frame >= TEXT1_FRAME + 2 && frame <= TEXT1_FRAME + 22
      ? Math.sin(frame * 5.5) *
        interpolate(frame, [TEXT1_FRAME + 2, TEXT1_FRAME + 22], [18, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const shakeY =
    frame >= TEXT1_FRAME + 2 && frame <= TEXT1_FRAME + 22
      ? Math.cos(frame * 4.2) *
        interpolate(frame, [TEXT1_FRAME + 2, TEXT1_FRAME + 22], [10, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // ">" symbol pulses in
  const GT_FRAME = TEXT1_FRAME + 18;
  const gtSpring = spring({ frame: frame - GT_FRAME, fps, config: { damping: 12, stiffness: 180 } });
  const gtOp = interpolate(frame, [GT_FRAME, GT_FRAME + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "FIREWALL" slams in
  const TEXT2_FRAME = GT_FRAME + 16;
  const text2Spring = spring({
    frame: frame - TEXT2_FRAME,
    fps,
    config: { damping: 5, stiffness: 320 },
  });
  const text2Y = interpolate(text2Spring, [0, 1], [300, 0]);
  const text2Scale = interpolate(text2Spring, [0, 0.7, 1], [1.5, 0.9, 1]);
  const text2Op = interpolate(frame, [TEXT2_FRAME, TEXT2_FRAME + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slamFlash2 = interpolate(frame, [TEXT2_FRAME + 2, TEXT2_FRAME + 14], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // FOLLOW badge
  const FOLLOW_FRAME = TEXT2_FRAME + 22;
  const followSpring = spring({ frame: frame - FOLLOW_FRAME, fps, config: { damping: 12, stiffness: 150 } });
  const followOp = interpolate(frame, [FOLLOW_FRAME, FOLLOW_FRAME + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const followPulse = 0.8 + Math.sin(frame / 8) * 0.2;

  // Subtitle
  const subOp = interpolate(frame, [FOLLOW_FRAME + 25, FOLLOW_FRAME + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Network pulse
  const netPulse = frame > 50 ? 0.04 + Math.sin(frame / 14) * 0.03 : 0;

  return (
    <AbsoluteFill
      style={{
        background: "#050505",
        opacity: sceneOp,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <CyberGrid opacity={0.5} />

      {/* Slam flash 1 */}
      {slamFlash1 > 0.02 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#00f2ff",
            opacity: slamFlash1 * 0.35,
            pointerEvents: "none",
          }}
        />
      )}
      {slamFlash2 > 0.02 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#ff3333",
            opacity: slamFlash2 * 0.25,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Background network */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="nodeGlow15" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <g opacity={linesOp}>
          {NODES.map((_n, i) => {
            return (
              <g key={i}>
                <line x1={nodePositions[i].rx} y1={nodePositions[i].ry} x2={nodePositions[(i + 1) % NODES.length].rx} y2={nodePositions[(i + 1) % NODES.length].ry} stroke="#00f2ff" strokeWidth={1} opacity={0.15 + netPulse * 2} />
                {i % 3 === 0 && (
                  <line x1={nodePositions[i].rx} y1={nodePositions[i].ry} x2={nodePositions[(i + 6) % NODES.length].rx} y2={nodePositions[(i + 6) % NODES.length].ry} stroke="#00f2ff" strokeWidth={0.8} opacity={0.1 + netPulse * 1.5} />
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        {nodePositions.map((n) => {
          const pulse = 0.7 + Math.sin(frame / 12 + n.id * 0.7) * 0.3;
          return (
            <g key={n.id} opacity={nodeSpring}>
              <circle cx={n.rx} cy={n.ry} r={n.size * 2.5 * pulse} fill="#00f2ff" opacity={0.05 + netPulse} />
              <circle cx={n.rx} cy={n.ry} r={n.size} fill="#00f2ff" opacity={0.8} filter="url(#nodeGlow15)" />
              <circle cx={n.rx} cy={n.ry} r={n.size * 0.4} fill="#aafeff" opacity={0.95} />
            </g>
          );
        })}
      </svg>

      {/* MIDDLEMAN */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: text1Op,
          transform: `translateY(${text1Y}px) scale(${text1Scale})`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 110,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            WebkitTextStroke: "2px #00f2ff",
            textShadow: "0 0 60px rgba(0,242,255,0.5), 0 0 120px rgba(0,242,255,0.2)",
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          MIDDLEMAN
        </div>
      </div>

      {/* > symbol */}
      <div
        style={{
          position: "absolute",
          top: 840,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: gtOp,
          transform: `scale(${gtSpring})`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            color: "#00f2ff",
            fontSize: 88,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            textShadow: "0 0 40px #00f2ff",
          }}
        >
          {">"}
        </div>
      </div>

      {/* FIREWALL */}
      <div
        style={{
          position: "absolute",
          top: 940,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: text2Op,
          transform: `translateY(${text2Y}px) scale(${text2Scale})`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            color: "#ff3333",
            fontSize: 110,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            WebkitTextStroke: "2px #ff3333",
            textShadow: "0 0 60px rgba(255,51,51,0.5), 0 0 120px rgba(255,51,51,0.2)",
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          FIREWALL
        </div>
      </div>

      {/* FOLLOW badge */}
      {followOp > 0.05 && (
        <div
          style={{
            position: "absolute",
            bottom: 230,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: followOp,
            transform: `scale(${0.6 + followSpring * 0.4})`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0,242,255,0.2), rgba(0,242,255,0.08))",
              border: `2.5px solid rgba(0,242,255,${followPulse * 0.9})`,
              borderRadius: 60,
              padding: "22px 70px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              boxShadow: `0 0 ${30 + followPulse * 20}px rgba(0,242,255,${0.35 + followPulse * 0.1}), 0 0 80px rgba(0,242,255,0.15)`,
            }}
          >
            <span
              style={{
                color: "#00f2ff",
                fontSize: 36,
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                letterSpacing: 4,
                textShadow: `0 0 20px rgba(0,242,255,${followPulse * 0.8})`,
              }}
            >
              FOLLOW
            </span>
            <span style={{ color: "#00f2ff", fontSize: 30, opacity: 0.7 }}>→</span>
          </div>
        </div>
      )}

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 380,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: subOp,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 28,
            fontFamily: "'Montserrat', sans-serif",
            fontStyle: "italic",
          }}
        >
          for more system design breakdowns
        </div>
      </div>
    </AbsoluteFill>
  );
};
