import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";

import { IG_BG, IG_WHITE, IG_GRAY, IG_BLUE, IG_RED } from "../constants";

// SVG Icon paths (Instagram-style)
const HEART_PATH =
  "M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z";
const COMMENT_PATH =
  "M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z";
const SEND_PATH =
  "M22 3L9.218 10.083M11.698 20.334L22 3.001H2l7.218 7.082m2.48 13.251L22 3";
const BOOKMARK_PATH =
  "M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z";

const DOUBLE_TAP_HEART =
  "M0,-75 C-5,-90 -28,-100 -50,-100 C-82,-100 -100,-75 -100,-48 C-100,5 0,85 0,85 C0,85 100,5 100,-48 C100,-75 82,-100 50,-100 C28,-100 5,-90 0,-75 Z";

const MINI_HEARTS = [
  { x: 490, startY: 520, size: 0.55, speed: 2.4, delay: 56 },
  { x: 600, startY: 540, size: 0.45, speed: 2.8, delay: 60 },
  { x: 450, startY: 560, size: 0.35, speed: 2.1, delay: 65 },
  { x: 640, startY: 510, size: 0.50, speed: 2.6, delay: 58 },
  { x: 530, startY: 580, size: 0.40, speed: 2.3, delay: 63 },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene envelope ──────────────────────────────────────────────────────
  const sceneIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOut = interpolate(frame, [178, 202], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Post slides up from below ───────────────────────────────────────────
  const postSpring = spring({ frame, fps, config: { damping: 18, stiffness: 85 } });
  const postY = (1 - postSpring) * 260;

  // ── Subtle Ken Burns on photo ───────────────────────────────────────────
  const photoScale = interpolate(frame, [0, 202], [1.0, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Double-tap: fires at frame 50 ───────────────────────────────────────
  const TAP = 50;

  // Large central heart: pops in, fades out
  const dtHeartScale = spring({
    frame: frame - TAP,
    fps,
    config: { damping: 5, stiffness: 380 },
  });
  const dtHeartOpacity = interpolate(
    frame,
    [TAP, TAP + 10, TAP + 42, TAP + 65],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ripple rings
  const r1 = interpolate(frame, [TAP, TAP + 65], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const r1o = interpolate(frame, [TAP, TAP + 65], [0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const r2 = interpolate(frame, [TAP + 12, TAP + 77], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const r2o = interpolate(frame, [TAP + 12, TAP + 77], [0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Action-bar heart bounce + fill ─────────────────────────────────────
  const HEART_FILL = TAP + 8;
  const heartBtnSpring = spring({
    frame: frame - HEART_FILL,
    fps,
    config: { damping: 4, stiffness: 420 },
  });
  // Bounce: overshoot to 1.45 then settle to 1.0
  const heartBtnScale = interpolate(heartBtnSpring, [0, 0.5, 1], [1, 1.45, 1.0]);
  const heartFilled = frame >= HEART_FILL;

  // ── Like counter ────────────────────────────────────────────────────────
  const BASE_LIKES = 36478770;
  const likeCount = Math.floor(
    interpolate(
      frame,
      [HEART_FILL, 178],
      [BASE_LIKES, BASE_LIKES + 4960000],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: (t) => 1 - Math.pow(1 - t, 2.5),
      }
    )
  );

  // ── "5M LIKES IN 10 MINUTES" badge ────────────────────────────────────
  const badgeSlide = interpolate(frame, [128, 152], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const badgeOpacity = interpolate(frame, [128, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Layout constants ────────────────────────────────────────────────────
  // The provided image is a screenshot of an IG post (~640×833px).
  // Rendered at 1080px wide: scale = 1.6875
  //   Header ~90px → 152px rendered
  //   Photo  ~640px square → 1080px rendered
  //   Footer ~103px → 174px rendered
  //   Total rendered height ≈ 1405px
  // With container 1080×900 and overflow hidden,
  // objectPosition "center 30%" skips the top 152px (the header).
  const PHOTO_H = 900;

  const iconSize = 64;

  return (
    <AbsoluteFill style={{ background: IG_BG, opacity: sceneIn * sceneOut }}>
      {/* ── Soft ambient glow behind post ────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(193,53,132,0.18) 0%, rgba(131,58,180,0.08) 40%, transparent 70%)",
        }}
      />

      {/* ── Instagram Post Card ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          transform: `translateY(${postY}px)`,
        }}
      >
        {/* Status bar removed - now handled globally by DynamicIsland */}


        {/* ── PROFILE HEADER ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "22px 24px 18px",
            background: IG_BG,
          }}
        >
          {/* Avatar with Instagram gradient story-ring */}
          <div style={{ position: "relative", marginRight: 20, flexShrink: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <defs>
                <linearGradient id="storyRing" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FCAF45" />
                  <stop offset="30%" stopColor="#F77737" />
                  <stop offset="55%" stopColor="#E1306C" />
                  <stop offset="80%" stopColor="#C13584" />
                  <stop offset="100%" stopColor="#405DE6" />
                </linearGradient>
              </defs>
              {/* Gradient story ring */}
              <circle cx="36" cy="36" r="35" fill="url(#storyRing)" />
              {/* White gap */}
              <circle cx="36" cy="36" r="30" fill={IG_BG} />
              {/* Avatar background */}
              <circle cx="36" cy="36" r="27" fill="#1a1a2e" />
              {/* CR7 text avatar */}
              <text
                x="36" y="32"
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="900"
                fontFamily="monospace"
                letterSpacing="1"
              >
                CR7
              </text>
              <text
                x="36" y="47"
                textAnchor="middle"
                fill="rgba(225,48,108,0.9)"
                fontSize="10"
                fontWeight="700"
                fontFamily="monospace"
              >
                ★★★★★
              </text>
            </svg>
          </div>

          {/* Username + verified + follow */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  color: IG_WHITE,
                  fontSize: 34,
                  fontWeight: 700,
                  fontFamily: "Outfit, sans-serif",
                  lineHeight: 1,
                }}
              >
                cristiano
              </span>
              {/* Verified blue checkmark */}
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="13" fill={IG_BLUE} />
                <path
                  d="M8 13L11.5 16.5L18 9.5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Dot separator */}
              <span style={{ color: IG_GRAY, fontSize: 24, lineHeight: 1 }}>·</span>
              {/* Follow */}
              <span
                style={{
                  color: IG_BLUE,
                  fontSize: 26,
                  fontWeight: 700,
                  fontFamily: "Outfit, sans-serif",
                  lineHeight: 1,
                }}
              >
                Follow
              </span>
            </div>
            <div
              style={{
                color: IG_GRAY,
                fontSize: 22,
                fontFamily: "Outfit, sans-serif",
                lineHeight: 1.2,
              }}
            >
              Paid partnership with louisvuitton
            </div>
          </div>

          {/* More options ··· */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              paddingLeft: 16,
              paddingRight: 4,
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: IG_WHITE,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── PHOTO ──────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            width: 1080,
            height: PHOTO_H,
            overflow: "hidden",
            background: "#0a0a0a",
          }}
        >
          {/* The chess photo — cropped to show only the photo portion of the screenshot */}
          <Img
            src={staticFile("instagram-like/ronaldo-insta-post.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              transform: `scale(${photoScale})`,
              transformOrigin: "center 30%",
            }}
          />

          {/* Subtle dark vignette at edges */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* ── DOUBLE-TAP ANIMATION OVERLAY ─────────────────────────────── */}
          <svg
            width="1080"
            height={PHOTO_H}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <defs>
              <filter id="dtGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dtDropShadow">
                <feDropShadow dx="0" dy="4" stdDeviation="24" floodColor="rgba(0,0,0,0.6)" />
              </filter>
            </defs>

            {/* Ripple ring 1 */}
            {r1 > 0 && (
              <circle
                cx={540} cy={460}
                r={r1}
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={3}
                opacity={r1o}
              />
            )}
            {/* Ripple ring 2 */}
            {r2 > 0 && (
              <circle
                cx={540} cy={460}
                r={r2}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={2}
                opacity={r2o}
              />
            )}

            {/* Large double-tap heart */}
            {dtHeartOpacity > 0 && (
              <g
                transform={`translate(540, 460) scale(${dtHeartScale * 1.15})`}
                opacity={dtHeartOpacity}
              >
                {/* Glow halo */}
                <path
                  d={DOUBLE_TAP_HEART}
                  fill="rgba(255,255,255,0.15)"
                  transform="scale(1.3)"
                  filter="url(#dtGlow)"
                />
                {/* Main white heart */}
                <path
                  d={DOUBLE_TAP_HEART}
                  fill="white"
                  filter="url(#dtDropShadow)"
                />
              </g>
            )}

            {/* Floating mini hearts after tap */}
            {frame > TAP + 5 &&
              MINI_HEARTS.map((h, i) => {
                const rise = interpolate(
                  frame,
                  [h.delay, h.delay + 80],
                  [0, 260],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const ho = interpolate(
                  frame,
                  [h.delay, h.delay + 18, h.delay + 60, h.delay + 82],
                  [0, 0.9, 0.9, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const wobble = Math.sin((frame - h.delay) * 0.22 + i) * 18;
                return (
                  <g
                    key={i}
                    transform={`translate(${h.x + wobble}, ${h.startY - rise}) scale(${h.size})`}
                    opacity={ho}
                  >
                    <path d={DOUBLE_TAP_HEART} fill="#ED4956" filter="url(#dtGlow)" />
                  </g>
                );
              })}
          </svg>
        </div>

        {/* ── ACTION BAR ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 24px 14px",
            background: IG_BG,
          }}
        >
          {/* Left: Heart, Comment, Send */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {/* Heart icon — fills red on double-tap */}
            <svg
              width={iconSize} height={iconSize}
              viewBox="0 0 24 24"
              style={{ transform: `scale(${heartBtnScale})`, display: "block" }}
            >
              <path
                d={HEART_PATH}
                fill={heartFilled ? IG_RED : "none"}
                stroke={heartFilled ? IG_RED : IG_WHITE}
                strokeWidth={heartFilled ? 0 : 1.5}
              />
            </svg>

            {/* Comment bubble */}
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
              <path
                d={COMMENT_PATH}
                fill="none"
                stroke={IG_WHITE}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>

            {/* Send / DM */}
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
              <path
                d={SEND_PATH}
                fill="none"
                stroke={IG_WHITE}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Right: Bookmark */}
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
            <path
              d={BOOKMARK_PATH}
              fill="none"
              stroke={IG_WHITE}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ── LIKE COUNT ─────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "0 24px 10px",
            background: IG_BG,
          }}
        >
          <span
            style={{
              color: IG_WHITE,
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {likeCount.toLocaleString()}
          </span>
          <span
            style={{
              color: IG_WHITE,
              fontSize: 32,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {" "}likes
          </span>
        </div>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "0 24px 14px",
            background: IG_BG,
          }}
        >
          <span
            style={{
              color: IG_WHITE,
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            cristiano
          </span>
          <span
            style={{
              color: IG_WHITE,
              fontSize: 24,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {" "}Never forget where you started. ♟️ #LouisVuitton
          </span>
        </div>
      </div>

      {/* ── "5M LIKES IN 10 MINUTES" BADGE ──────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: badgeOpacity,
          transform: `translateY(${badgeSlide}px)`,
        }}
      >
        <svg width={1020} height={110}>
          <defs>
            <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#405DE6" />
              <stop offset="33%" stopColor="#833AB4" />
              <stop offset="66%" stopColor="#C13584" />
              <stop offset="100%" stopColor="#FCAF45" />
            </linearGradient>
            <filter id="badgeGlow" x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x={10} y={10} width={1000} height={90} rx={45} fill="url(#badgeGrad)" filter="url(#badgeGlow)" />
          <text
            x={510} y={68}
            textAnchor="middle"
            fill="white"
            fontSize={44}
            fontWeight="900"
            fontFamily="Outfit, monospace"
            letterSpacing={1}
          >
            5,000,000 LIKES IN 10 MINUTES
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
