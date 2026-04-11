import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Grid } from "../components/Grid";
import { PhoneFrame } from "../components/PhoneFrame";

const PHONE_W = 220;
const PHONE_H = 440;
const SMALL = 0.35;
const MATH_SYMS = ["π", "∑", "√", "÷", "∫", "λ", "Δ", "Ω", "∞", "≠"];

// Seeded positions for rain symbols so they don't jump
const RAIN = MATH_SYMS.map((sym, i) => ({
  sym,
  x: 60 + ((i * 97 + 41) % 960),
  speed: 1.2 + (i * 0.18) % 1.1,
  phase: i * 37,
  opacity: 0.12 + (i % 4) * 0.06,
}));

export const Scene2Reframe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phones spring to small scale
  const scaleSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const phoneScale = interpolate(scaleSpring, [0, 1], [1, SMALL]);

  // Padlock body draws (strokeDashoffset)
  const lockBodyLen = 520;
  const lockBodyDash = interpolate(frame, [22, 95], [lockBodyLen, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockShackleLen = 210;
  const lockShackleDash = interpolate(frame, [68, 125], [lockShackleLen, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockGlow = 0.65 + Math.sin(frame / 10) * 0.35;
  const lockOp = interpolate(frame, [18, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Padlock image fades in after SVG draw completes
  const lockImgOp = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "MATH" slams down
  const mathSpring = spring({
    frame: frame - 95,
    fps,
    config: { damping: 5, stiffness: 290 },
  });
  const mathY = interpolate(mathSpring, [0, 1], [-220, 0]);

  // Strikethrough line on "trust"
  const strikeW = interpolate(frame, [145, 180], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom text
  const textOp = interpolate(frame, [138, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Math rain y positions
  const rainItems = RAIN.map((r) => ({
    ...r,
    y: ((frame * r.speed + r.phase) % 1900) + 50,
  }));

  return (
    <AbsoluteFill style={{ background: "#050A0F" }}>
      <Grid />

      {/* Raining math symbols */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {rainItems.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              color: "#00E5FF",
              fontSize: 30,
              fontFamily: "Georgia, serif",
              opacity: r.opacity,
              transform: "translate(-50%, -50%)",
              textShadow: "0 0 8px #00E5FF",
            }}
          >
            {r.sym}
          </div>
        ))}
      </div>

      {/* Padlock SVG draws itself */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="lockGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform="translate(540, 700)" opacity={lockOp}>
          {/* Shackle arc */}
          <path
            d="M -58,0 L -58,-72 Q -58,-118 0,-118 Q 58,-118 58,-72 L 58,0"
            fill="none"
            stroke={`rgba(0,229,255,${lockGlow})`}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={lockShackleLen}
            strokeDashoffset={lockShackleDash}
            filter="url(#lockGlow)"
          />
          {/* Body rect */}
          <rect
            x={-88}
            y={0}
            width={176}
            height={140}
            rx={18}
            fill="rgba(0,229,255,0.06)"
            stroke={`rgba(0,229,255,${lockGlow})`}
            strokeWidth={4}
            strokeDasharray={lockBodyLen}
            strokeDashoffset={lockBodyDash}
            filter="url(#lockGlow)"
          />
          {/* Keyhole (appears when body is almost drawn) */}
          {lockBodyDash < 80 && (
            <g opacity={interpolate(lockBodyDash, [0, 80], [1, 0])}>
              <circle
                cx={0}
                cy={58}
                r={20}
                fill="rgba(0,229,255,0.1)"
                stroke="#00E5FF"
                strokeWidth={2}
              />
              <rect
                x={-7}
                y={65}
                width={14}
                height={26}
                rx={3}
                fill="#00E5FF"
                opacity={0.5}
              />
            </g>
          )}
        </g>
      </svg>

      {/* Padlock image fades in over SVG (inside a dark panel) */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: lockImgOp,
          background: "rgba(0,10,20,0.88)",
          borderRadius: 20,
          padding: 14,
          border: "1px solid rgba(0,229,255,0.25)",
          boxShadow: `0 0 40px rgba(0,229,255,${0.2 + lockGlow * 0.1})`,
        }}
      >
        <Img
          src={staticFile("whatsapp/pedlock.png")}
          style={{ width: 160, height: 160, objectFit: "contain" }}
        />
      </div>

      {/* "MATH" slams onto padlock */}
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${mathY}px)`,
          opacity: mathSpring,
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 130,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            letterSpacing: -5,
            WebkitTextStroke: "3px #00E5FF",
            textShadow: "0 0 60px rgba(0,229,255,0.45)",
          }}
        >
          MATH
        </span>
      </div>

      {/* "Not trust. Math." */}
      <div
        style={{
          position: "absolute",
          bottom: 230,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOp,
        }}
      >
        <div
          style={{
            fontSize: 66,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            lineHeight: 1.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>Not</span>
          <span style={{ color: "#FFFFFF", position: "relative" }}>
            trust
            <span
              style={{
                position: "absolute",
                top: "52%",
                left: 0,
                height: 5,
                width: `${strikeW}%`,
                background: "#FF1744",
                borderRadius: 3,
                transform: "translateY(-50%)",
                boxShadow: "0 0 8px #FF1744",
              }}
            />
          </span>
          <span
            style={{
              color: "#00E5FF",
              textShadow: "0 0 20px #00E5FF88",
            }}
          >
            Math.
          </span>
        </div>
      </div>

      {/* Phones — scaled small at screen edges */}
      {/* Sender (left) */}
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 830,
          transform: `scale(${phoneScale})`,
          transformOrigin: "top left",
        }}
      >
        <PhoneFrame
          x={0}
          y={0}
          width={PHONE_W}
          height={PHONE_H}
          glowColor="#00E5FF"
        />
      </div>
      {/* Receiver (right) */}
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 830,
          transform: `scale(${phoneScale})`,
          transformOrigin: "top right",
        }}
      >
        <PhoneFrame
          x={0}
          y={0}
          width={PHONE_W}
          height={PHONE_H}
          glowColor="#00E676"
        />
      </div>
    </AbsoluteFill>
  );
};
