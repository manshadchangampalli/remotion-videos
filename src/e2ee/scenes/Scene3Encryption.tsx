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
import { CipherText } from "../components/CipherText";

const PHONE_W = 220;
const PHONE_H = 440;
const SMALL = 0.35;
const CIPHER = "X7#mK9@qR!2$";

// Hex vault path around center
const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

export const Scene3Encryption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── PHASE 1: Send moment (0–60) ──
  const bubbleGlow = 0.6 + Math.sin(frame / 10) * 0.4;
  const bubbleLaunchP = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 130 },
  });
  // Bubble travels from sender phone center-right → center screen
  const SENDER_CENTER_X = 60 + PHONE_W * SMALL + 20;
  const SENDER_CENTER_Y = 780 + (PHONE_H * SMALL) / 2;
  const bubbleX = interpolate(bubbleLaunchP, [0, 1], [SENDER_CENTER_X, 480]);
  const bubbleY = interpolate(bubbleLaunchP, [0, 1], [SENDER_CENTER_Y, 940]);
  const bubbleArcY = -Math.sin(bubbleLaunchP * Math.PI) * 180;
  const bubbleOp = interpolate(frame, [0, 8, 54, 68], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 2: Key rises (60–100) ──
  const keyRise = spring({
    frame: frame - 62,
    fps,
    config: { damping: 13, stiffness: 140 },
  });
  const keyY = interpolate(keyRise, [0, 1], [1300, 880]);
  const keyX = interpolate(keyRise, [0, 1], [SENDER_CENTER_X, 320]);
  const keyOp = interpolate(frame, [60, 72, 108, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 3: Lock impact + ciphertext (100–160) ──
  const flashOp = interpolate(frame, [100, 108], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ciphertext chars spring in staggered
  const cipherChars = CIPHER.split("").map((ch, i) => {
    const s = spring({
      frame: frame - (102 + i * 4),
      fps,
      config: { damping: 9, stiffness: 200 },
    });
    const angle = ((i / CIPHER.length) * Math.PI * 2 - Math.PI / 2);
    const startX = Math.cos(angle) * 120;
    const startY = Math.sin(angle) * 80;
    return {
      ch,
      x: interpolate(s, [0, 1], [startX, 0]),
      y: interpolate(s, [0, 1], [startY, 0]),
      op: s,
      rot: Math.sin(i * 1.4) * 15 * (1 - s),
    };
  });

  const cipherOp = interpolate(frame, [100, 116], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 4: Vault forms + drifts right (160–200) ──
  const hexPerim = 800;
  const hexDash = interpolate(frame, [155, 195], [hexPerim, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vaultGlow = 0.5 + Math.sin(frame / 8) * 0.5;
  const vaultDriftX = interpolate(frame, [180, 200], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Padlock image snaps onto vault
  const padlockScale = spring({
    frame: frame - 162,
    fps,
    config: { damping: 6, stiffness: 280 },
  });

  // Text lines
  const text1Op = interpolate(frame, [8, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text2Op = interpolate(frame, [108, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sender phone screen with glowing bubble
  const senderScreen = (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-start" }}>
      <div
        style={{
          background: `rgba(0,230,118,${bubbleGlow * 0.2})`,
          border: `1.5px solid rgba(0,230,118,${bubbleGlow})`,
          borderRadius: "12px 12px 12px 3px",
          padding: "6px 10px",
          boxShadow: `0 0 ${12 + bubbleGlow * 8}px rgba(0,230,118,0.6)`,
        }}
      >
        <span style={{ color: "#00E676", fontSize: 14, fontWeight: 700 }}>
          Hey 👋
        </span>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#050A0F" }}>
      <Grid />

      {/* White flash on impact */}
      {frame >= 100 && frame <= 110 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "white",
            opacity: flashOp * 0.55,
            pointerEvents: "none",
          }}
        />
      )}

      {/* SVG layer */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="sc3Glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Flying chat bubble */}
        <g
          transform={`translate(${bubbleX}, ${bubbleY + bubbleArcY})`}
          opacity={bubbleOp}
        >
          <rect
            x={-52}
            y={-24}
            width={104}
            height={48}
            rx={14}
            fill="rgba(0,230,118,0.15)"
            stroke="#00E676"
            strokeWidth={2}
            filter="url(#sc3Glow)"
          />
          <text
            x={0}
            y={8}
            textAnchor="middle"
            fill="#00E676"
            fontSize={20}
            fontFamily="system-ui"
            fontWeight={700}
          >
            Hey 👋
          </text>
        </g>

        {/* Hexagonal vault */}
        <g transform={`translate(${540 + vaultDriftX}, 960)`} opacity={cipherOp}>
          <polygon
            points={hexPoints(0, 0, 155)}
            fill="rgba(255,29,68,0.06)"
            stroke={`rgba(255,29,68,${vaultGlow})`}
            strokeWidth={4}
            strokeDasharray={hexPerim}
            strokeDashoffset={hexDash}
            filter="url(#sc3Glow)"
          />
          {/* Outer glow ring */}
          <polygon
            points={hexPoints(0, 0, 155)}
            fill="none"
            stroke="#FF1744"
            strokeWidth={14}
            opacity={0.08 + vaultGlow * 0.06}
          />
        </g>
      </svg>

      {/* Ciphertext at center */}
      <div
        style={{
          position: "absolute",
          top: 930,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: cipherOp,
          transform: `translateX(${vaultDriftX}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 2 }}>
          {cipherChars.map(({ ch, x, y, op, rot }, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                opacity: op,
                color: i % 2 === 0 ? "#FF1744" : "#FF6D00",
                fontSize: 36,
                fontFamily: "'Courier New', monospace",
                fontWeight: 900,
                textShadow: `0 0 8px ${i % 2 === 0 ? "#FF1744" : "#FF6D00"}`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* Scrambled cipher text (using CipherText component with scramble) */}
      {frame > 140 && frame < 165 && (
        <div
          style={{
            position: "absolute",
            top: 985,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [140, 155, 160, 165], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateX(${vaultDriftX}px)`,
          }}
        >
          <CipherText text={CIPHER} scramble frame={frame} fontSize={16} />
        </div>
      )}

      {/* Padlock snaps onto vault */}
      <div
        style={{
          position: "absolute",
          top: 870,
          left: "50%",
          transform: `translateX(calc(-50% + ${vaultDriftX}px)) scale(${padlockScale})`,
          transformOrigin: "center center",
          opacity: padlockScale,
          background: "rgba(0,5,10,0.9)",
          borderRadius: 16,
          padding: 8,
          border: "1px solid rgba(255,29,68,0.4)",
          boxShadow: `0 0 30px rgba(255,29,68,${0.3 + vaultGlow * 0.2})`,
        }}
      >
        <Img
          src={staticFile("whatsapp/pedlock.png")}
          style={{ width: 80, height: 80, objectFit: "contain" }}
        />
      </div>

      {/* Key image rises */}
      <div
        style={{
          position: "absolute",
          left: keyX - 55,
          top: keyY - 45,
          opacity: keyOp,
          background: "rgba(10,8,0,0.88)",
          borderRadius: 14,
          padding: 8,
          border: "1px solid rgba(255,214,0,0.5)",
          boxShadow: `0 0 28px rgba(255,214,0,${keyOp * 0.45})`,
        }}
      >
        <Img
          src={staticFile("whatsapp/key.png")}
          style={{ width: 110, height: 70, objectFit: "contain" }}
        />
        <div
          style={{
            textAlign: "center",
            color: "#FFD600",
            fontSize: 13,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            letterSpacing: 1,
            marginTop: 4,
          }}
        >
          YOUR DEVICE KEY
        </div>
      </div>

      {/* Sender phone small anchor */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 780,
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${SMALL})`,
          transformOrigin: "top left",
        }}
      >
        <PhoneFrame
          x={0}
          y={0}
          width={PHONE_W}
          height={PHONE_H}
          glowColor="#00E5FF"
          screenContent={senderScreen}
        />
      </div>

      {/* Receiver phone small anchor */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 780,
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${SMALL})`,
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

      {/* Text lines */}
      <div
        style={{
          position: "absolute",
          bottom: 400,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: text1Op,
        }}
      >
        <span
          style={{
            color: "#00E676",
            fontSize: 54,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
          }}
        >
          You hit send.
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 310,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: text2Op,
        }}
      >
        <span
          style={{
            color: "#FF1744",
            fontSize: 46,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            textShadow: "0 0 20px rgba(255,29,68,0.4)",
          }}
        >
          Mathematical garbage.
        </span>
      </div>
    </AbsoluteFill>
  );
};
