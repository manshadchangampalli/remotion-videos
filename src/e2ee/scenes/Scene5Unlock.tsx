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
import { DataPacket } from "../components/DataPacket";
const CIPHER = "X7#mK9@qR!2$";
const CIPHER_CHARS = CIPHER.split("");
const MESSAGE = "Hey 👋";
const MSG_CHARS = MESSAGE.split("");

export const Scene5Unlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── PHASE 1: Vault arrives at receiver (0–40) ──
  const vaultArriveX = interpolate(frame, [0, 38], [920, 540], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vaultBounce = spring({
    frame: frame - 30,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const vaultBounceY = interpolate(vaultBounce, [0, 1], [0, -18]);
  const vaultGlow = 0.5 + Math.sin(frame / 8) * 0.5;

  // Hex vault
  const hexPoints = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");

  // ── PHASE 2: Private key rises (40–100) ──
  const keySpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 12, stiffness: 130 },
  });
  const keyY = interpolate(keySpring, [0, 1], [1300, 860]);
  const keyOp = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Key travels toward vault (70–100)
  const keyMoveX = interpolate(frame, [70, 98], [280, 540], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keyMoveY = interpolate(frame, [70, 98], [860, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 3: Unlock flash + particles (100–150) ──
  const unlockFlash = interpolate(frame, [100, 112], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Gold ripple rings
  const rippleScale1 = interpolate(frame, [100, 145], [0.1, 3.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleOp1 = interpolate(frame, [100, 145], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleScale2 = interpolate(frame, [108, 155], [0.1, 3.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleOp2 = interpolate(frame, [108, 155], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Padlock fades out
  const padlockOp = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Particles scatter (12 particles)
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const speed = 80 + (i % 4) * 30;
    const ps = spring({
      frame: frame - 102,
      fps,
      config: { damping: 10, stiffness: 120 },
    });
    return {
      x: Math.cos(angle) * speed * ps,
      y: Math.sin(angle) * speed * ps,
      op: interpolate(frame, [102, 105, 148], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      color: i % 3 === 0 ? "#FFD600" : i % 3 === 1 ? "#00E676" : "#00E5FF",
    };
  });

  // ── PHASE 4: Ciphertext morphs back to "Hey 👋" (120–200) ──
  // Each cipher char morphs one at a time, staggered 2 frames
  const cipherPhase = CIPHER_CHARS.map((_, i) => {
    const startF = 122 + i * 2;
    const s = spring({
      frame: frame - startF,
      fps,
      config: { damping: 9, stiffness: 240 },
    });
    return { progress: s };
  });

  // Message chars spring in from center outward
  const msgCharSprings = MSG_CHARS.map((_, i) => {
    const startF = 128 + i * 3;
    return spring({
      frame: frame - startF,
      fps,
      config: { damping: 11, stiffness: 180 },
    });
  });

  // Green ripple on message reveal
  const greenRipple1 = interpolate(frame, [148, 188], [0, 3.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const greenRippleOp1 = interpolate(frame, [148, 188], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const greenRipple2 = interpolate(frame, [158, 196], [0, 3.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const greenRippleOp2 = interpolate(frame, [158, 196], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text
  const text1Op = interpolate(frame, [42, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text2Spring = spring({
    frame: frame - 148,
    fps,
    config: { damping: 11, stiffness: 150 },
  });
  const text2Y = interpolate(text2Spring, [0, 1], [60, 0]);

  // Vault visible until particles scatter
  const vaultOp = interpolate(frame, [115, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Center X for the vault/message area
  const centerX = 540;
  const centerY = 960;

  return (
    <AbsoluteFill style={{ background: "#050A0F" }}>
      <Grid />

      {/* Unlock flash */}
      {frame >= 100 && frame <= 114 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#FFD600",
            opacity: unlockFlash * 0.6,
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
          <filter id="sc5Glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sc5GoldGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Hexagonal vault */}
        {frame < 135 && (
          <g
            transform={`translate(${vaultArriveX}, ${centerY + vaultBounceY})`}
            opacity={vaultOp}
          >
            <polygon
              points={hexPoints(0, 0, 155)}
              fill="rgba(255,29,68,0.06)"
              stroke={`rgba(255,29,68,${vaultGlow})`}
              strokeWidth={4}
              filter="url(#sc5Glow)"
            />
            <polygon
              points={hexPoints(0, 0, 155)}
              fill="none"
              stroke="#FF1744"
              strokeWidth={14}
              opacity={0.08 + vaultGlow * 0.06}
            />
          </g>
        )}

        {/* Gold ripple rings on unlock */}
        {frame >= 100 && (
          <>
            <circle
              cx={centerX}
              cy={centerY}
              r={80}
              fill="none"
              stroke="#FFD600"
              strokeWidth={3}
              transform={`scale(${rippleScale1})`}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              opacity={rippleOp1}
              filter="url(#sc5GoldGlow)"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={80}
              fill="none"
              stroke="#FFD600"
              strokeWidth={2}
              transform={`scale(${rippleScale2})`}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              opacity={rippleOp2}
              filter="url(#sc5GoldGlow)"
            />
          </>
        )}

        {/* Green ripple rings on message reveal */}
        {frame >= 148 && (
          <>
            <circle
              cx={centerX}
              cy={centerY}
              r={80}
              fill="none"
              stroke="#00E676"
              strokeWidth={3}
              transform={`scale(${greenRipple1})`}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              opacity={greenRippleOp1}
              filter="url(#sc5Glow)"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={80}
              fill="none"
              stroke="#00E676"
              strokeWidth={2}
              transform={`scale(${greenRipple2})`}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              opacity={greenRippleOp2}
              filter="url(#sc5Glow)"
            />
          </>
        )}

        {/* Scatter particles */}
        {frame >= 102 &&
          particles.map((p, i) => (
            <circle
              key={i}
              cx={centerX + p.x}
              cy={centerY + p.y}
              r={5 + (i % 3) * 2}
              fill={p.color}
              opacity={p.op}
              filter="url(#sc5Glow)"
            />
          ))}

        {/* Receiver phone outline (right side) */}
        <g transform="translate(860, 960)" opacity={0.45}>
          <rect
            x={-55}
            y={-120}
            width={110}
            height={240}
            rx={18}
            fill="rgba(0,230,118,0.04)"
            stroke="#00E676"
            strokeWidth={2}
          />
          <rect
            x={-42}
            y={-108}
            width={84}
            height={192}
            rx={10}
            fill="rgba(0,230,118,0.03)"
            stroke="rgba(0,230,118,0.3)"
            strokeWidth={1}
          />
          {/* Home bar */}
          <rect x={-18} y={88} width={36} height={4} rx={2} fill="rgba(0,230,118,0.4)" />
        </g>
      </svg>

      {/* Key image (phase 2) */}
      {frame >= 40 && frame <= 105 && (
        <div
          style={{
            position: "absolute",
            left: frame < 70 ? 225 : keyMoveX - 55,
            top: frame < 70 ? keyY - 45 : keyMoveY - 45,
            opacity: frame < 70 ? keyOp : keyOp * (1 - (frame - 70) / 35),
            background: "rgba(10,8,0,0.88)",
            borderRadius: 14,
            padding: 8,
            border: "1px solid rgba(255,214,0,0.6)",
            boxShadow: `0 0 30px rgba(255,214,0,0.5)`,
            pointerEvents: "none",
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
            YOUR PRIVATE KEY
          </div>
        </div>
      )}

      {/* Padlock on vault (fades out on unlock) */}
      {frame < 122 && (
        <div
          style={{
            position: "absolute",
            top: centerY - 50,
            left: vaultArriveX - 40,
            opacity: padlockOp,
            background: "rgba(0,5,10,0.9)",
            borderRadius: 12,
            padding: 6,
            border: "1px solid rgba(255,29,68,0.4)",
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("whatsapp/pedlock.png")}
            style={{ width: 80, height: 80, objectFit: "contain" }}
          />
        </div>
      )}

      {/* DataPacket (only in early frames) */}
      {frame < 100 && (
        <DataPacket
          x={vaultArriveX}
          y={centerY + vaultBounceY}
          glowColor="#FF1744"
          size={62}
        />
      )}

      {/* Ciphertext morphing to message */}
      {frame >= 120 && frame < 165 && (
        <div
          style={{
            position: "absolute",
            top: centerY - 30,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {CIPHER_CHARS.map((ch, i) => {
            const p = cipherPhase[i].progress;
            // Morph from cipher char color → green
            const r = Math.round(255 * (1 - p));
            const g = Math.round(230 * p + 29 * (1 - p));
            const b = Math.round(118 * p + 68 * (1 - p));
            return (
              <span
                key={i}
                style={{
                  color: `rgb(${r},${g},${b})`,
                  fontSize: 32,
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 900,
                  opacity: 1 - p * 0.9,
                  transform: `scale(${1 + p * 0.3}) rotate(${(1 - p) * (i % 2 === 0 ? 10 : -10)}deg)`,
                  display: "inline-block",
                  textShadow: `0 0 10px rgb(${r},${g},${b})`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      )}

      {/* Revealed message "Hey 👋" */}
      {frame >= 128 && (
        <div
          style={{
            position: "absolute",
            top: centerY - 50,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {MSG_CHARS.map((ch, i) => {
            const s = msgCharSprings[i];
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: "#00E676",
                  fontSize: 72,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 900,
                  opacity: s,
                  transform: `scale(${0.5 + s * 0.5}) translateY(${(1 - s) * 40}px)`,
                  textShadow: `0 0 20px rgba(0,230,118,${s * 0.8})`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      )}

      {/* Text lines */}
      <div
        style={{
          position: "absolute",
          bottom: 420,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#FFD600",
            fontSize: 48,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            opacity: text1Op,
            marginBottom: 16,
            textShadow: "0 0 20px rgba(255,214,0,0.4)",
          }}
        >
          Your private key.
        </div>
        <div
          style={{
            color: "#00E676",
            fontSize: 56,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            opacity: text2Spring,
            transform: `translateY(${text2Y}px)`,
            textShadow: "0 0 24px rgba(0,230,118,0.5)",
          }}
        >
          Message unlocked.
        </div>
      </div>
    </AbsoluteFill>
  );
};
