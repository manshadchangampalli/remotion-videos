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
const PHONE_Y = 720;
const SENDER_X_END = 28;
const RECEIVER_X_END = 832;

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phones slide in ──
  const phoneSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const senderX = interpolate(phoneSpring, [0, 1], [-PHONE_W - 40, SENDER_X_END]);
  const receiverX = interpolate(phoneSpring, [0, 1], [1120, RECEIVER_X_END]);

  // ── WhatsApp logo ──
  const logoScale = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, stiffness: 135 },
  });

  // ── Question mark: draws via strokeDashoffset ──
  const qmPerim = 620;
  const qmDash = interpolate(frame, [55, 140], [qmPerim, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const qmDotOp = interpolate(frame, [138, 158], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const qmPulse = 0.8 + Math.sin(frame / 10) * 0.2;

  // ── Dotted line between phones ──
  const lineOp =
    phoneSpring > 0.8
      ? interpolate(frame, [40, 70], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }) * (0.28 + Math.sin(frame / 22) * 0.12)
      : 0;

  // ── Bottom text ──
  const textOp = interpolate(frame, [90, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = Math.sin(frame / 20) * 3;

  // ── Chat bubble glow pulse in sender screen ──
  const bubbleGlow = 0.65 + Math.sin(frame / 11) * 0.35;

  const senderScreen = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          background: `rgba(0,230,118,${bubbleGlow * 0.18})`,
          border: `1.5px solid rgba(0,230,118,${bubbleGlow})`,
          borderRadius: "14px 14px 14px 3px",
          padding: "7px 12px",
          boxShadow: `0 0 14px rgba(0,230,118,${bubbleGlow * 0.55})`,
        }}
      >
        <span
          style={{
            color: "#00E676",
            fontSize: 15,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
          }}
        >
          Hey 👋
        </span>
      </div>
    </div>
  );

  // line endpoints (center-bottom of each phone's screen)
  const lineY = PHONE_Y + PHONE_H / 2;
  const lineX1 = SENDER_X_END + PHONE_W;
  const lineX2 = RECEIVER_X_END;

  return (
    <AbsoluteFill style={{ background: "#050A0F" }}>
      <Grid />

      {/* WhatsApp logo + wordmark */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          transform: `scale(${logoScale})`,
          opacity: logoScale,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile("whatsapp/whatsapp.png")}
          style={{ width: 72, height: 72, objectFit: "contain" }}
        />
        <span
          style={{
            color: "#00E676",
            fontSize: 40,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            letterSpacing: -1,
          }}
        >
          WhatsApp
        </span>
      </div>

      {/* SVG overlay: dotted line + question mark */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Dotted connector line */}
        <line
          x1={lineX1}
          y1={lineY}
          x2={lineX2}
          y2={lineY}
          stroke="#00E5FF"
          strokeWidth={2}
          strokeDasharray="14 10"
          opacity={lineOp}
        />

        {/* Animated question mark */}
        <g transform="translate(540, 1000)" opacity={qmPulse}>
          <path
            d="M -45,-80 Q -45,-130 0,-130 Q 45,-130 45,-80 Q 45,-30 0,0 L 0,35"
            fill="none"
            stroke="#00E5FF"
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={qmPerim}
            strokeDashoffset={qmDash}
            filter="url(#qmGlow)"
          />
          <circle
            cx={0}
            cy={60}
            r={9}
            fill="#00E5FF"
            opacity={qmDotOp}
            filter="url(#qmGlow)"
          />
          <defs>
            <filter
              id="qmGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </g>
      </svg>

      {/* Sender phone */}
      <PhoneFrame
        x={senderX}
        y={PHONE_Y}
        width={PHONE_W}
        height={PHONE_H}
        glowColor="#00E5FF"
        screenContent={senderScreen}
      />

      {/* Receiver phone */}
      <PhoneFrame
        x={receiverX}
        y={PHONE_Y}
        width={PHONE_W}
        height={PHONE_H}
        glowColor="#00E676"
      />

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 215,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOp,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 52,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            lineHeight: 1.25,
            textShadow: "0 0 40px rgba(0,229,255,0.25)",
          }}
        >
          Not even WhatsApp
          <br />
          can read this.
        </div>
      </div>
    </AbsoluteFill>
  );
};
