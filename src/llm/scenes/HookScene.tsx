import React from "react";
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, staticFile, Img,
} from "remotion";

const C    = "#00f2ff";
const CO   = "#ff8c00";
const FH   = "'Montserrat', sans-serif";
const FL   = "'Inter', sans-serif";
const DUR  = 450;  // 15s — audio hook ends at 0:15

// ChatGPT conversation that types out
const USER_MSG  = "How do you actually work?";
const AI_RESPONSE = "I don't think or understand.\nI just predict the next word\nbased on patterns.\nThat's the whole secret.";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sIn  = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sOut = interpolate(frame, [DUR - 28, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gridY = (frame * 1.6) % 80;

  const pulse = Math.sin(frame * 0.11) * 0.5 + 0.5;

  // Logos spring in sequentially
  const l1 = spring({ frame: frame - 12, fps, config: { damping: 11, stiffness: 185 } });
  const l2 = spring({ frame: frame - 26, fps, config: { damping: 11, stiffness: 185 } });
  const l3 = spring({ frame: frame - 40, fps, config: { damping: 11, stiffness: 185 } });

  // Chat window slides up
  const chatIn = spring({ frame: frame - 55, fps, config: { damping: 14, stiffness: 130 } });
  const chatY  = (1 - chatIn) * 260;

  // User message fades in first
  const userMsgIn = interpolate(frame, [65, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // AI typing animation — starts after user message visible
  const charCount   = Math.floor(Math.max(0, frame - 95) * 0.55);
  const displayed   = AI_RESPONSE.slice(0, Math.min(charCount, AI_RESPONSE.length));
  const cursorOn    = Math.floor(frame / 14) % 2 === 0;
  const typingDone  = charCount >= AI_RESPONSE.length;

  // Title fade
  const titleIn = interpolate(frame, [55, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Shatter at end (adjusted for 450-frame duration)
  const SP_S = 380;
  const sp   = interpolate(frame, [SP_S, SP_S + 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX = sp > 0 ? Math.sin(frame * 9.4) * sp * 14 : 0;

  const LOGOS = [
    { src: staticFile("llm-working/chatgpt-logo.png"), s: l1, label: "ChatGPT", xPct: 15 },
    { src: staticFile("llm-working/gemini-logo.png"),  s: l2, label: "Gemini",  xPct: 50 },
    { src: staticFile("llm-working/meta-llama-logo.png"), s: l3, label: "Llama", xPct: 85 },
  ];

  return (
    <AbsoluteFill style={{ opacity: sIn * sOut, background: "#050505" }}>

      {/* ── Perspective grid ── */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="hk_g" width="80" height="80" patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${gridY})`}>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1d1d1d" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#hk_g)" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i}
            x1={(i / 8) * 1080} y1={0} x2={540} y2={2200}
            stroke={C} strokeWidth={0.4} opacity={0.09} />
        ))}
      </svg>

      {/* Radial top glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 480,
        background: `radial-gradient(ellipse at 50% 0%, rgba(0,242,255,${0.05 + pulse * 0.05}) 0%, transparent 70%)`,
      }} />

      {/* ── AI Logos — larger size ── */}
      {LOGOS.map((logo, i) => (
        <div key={i} style={{
          position: "absolute", top: 260,
          left: `${logo.xPct}%`,
          transform: `translateX(-50%) scale(${logo.s})`,
          opacity: logo.s,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 128, height: 128, borderRadius: 30,
            background: "rgba(0,0,0,0.6)",
            border: `2px solid rgba(0,242,255,${0.22 + (typingDone ? pulse * 0.38 : 0)})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: typingDone ? `0 0 ${pulse * 30}px rgba(0,242,255,0.35)` : "none",
          }}>
            <Img src={logo.src} style={{ width: 78, height: 78, objectFit: "contain" }} />
          </div>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 26, fontFamily: FL, fontWeight: 600 }}>
            {logo.label}
          </span>
        </div>
      ))}

      {/* ── Title ── */}
      <div style={{
        position: "absolute", top: 510, left: 0, right: 0, textAlign: "center",
        opacity: titleIn * (1 - sp),
      }}>
        <div style={{ color: "white", fontSize: 64, fontFamily: FH, fontWeight: 900, letterSpacing: -1 }}>
          How LLMs Work
        </div>
        <div style={{ color: C, fontSize: 26, fontFamily: FL, marginTop: 12, opacity: 0.75 }}>
          The Secret Behind AI
        </div>
      </div>

      {/* ── ChatGPT-Style Chat Window ── */}
      <div style={{
        position: "absolute", top: 660, left: 40, right: 40,
        transform: `translateY(${chatY}px) translateX(${shakeX}px)`,
        opacity: Math.max(0, 1 - sp * 2.8),
      }}>
        <div style={{
          background: "#1e1e1e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 22, overflow: "hidden",
          boxShadow: "0 8px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.05)",
        }}>

          {/* ── Header bar ── */}
          <div style={{
            padding: "16px 22px",
            background: "#2a2a2a",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            {/* ChatGPT logo in header */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#10a37f",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 41 41" fill="white">
                <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-7.505-3.337 10.079 10.079 0 0 0-9.616 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.504 3.336 10.079 10.079 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.239-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18Z" />
              </svg>
            </div>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 22, fontFamily: FL, fontWeight: 600 }}>
              ChatGPT
            </span>
            <span style={{
              marginLeft: "auto",
              color: "rgba(255,255,255,0.3)", fontSize: 16, fontFamily: FL,
            }}>
              GPT-4o
            </span>
          </div>

          {/* ── Chat area ── */}
          <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20, minHeight: 340 }}>

            {/* User message */}
            <div style={{
              display: "flex", justifyContent: "flex-end",
              opacity: userMsgIn,
              transform: `translateY(${(1 - userMsgIn) * 20}px)`,
            }}>
              <div style={{
                background: "#2f2f2f",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px 18px 4px 18px",
                padding: "14px 20px",
                maxWidth: "75%",
              }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 22, fontFamily: FL, lineHeight: 1.5 }}>
                  {USER_MSG}
                </span>
              </div>
            </div>

            {/* AI response */}
            {charCount > 0 && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                {/* GPT avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#10a37f",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 4,
                }}>
                  <svg width="22" height="22" viewBox="0 0 41 41" fill="white">
                    <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-7.505-3.337 10.079 10.079 0 0 0-9.616 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.504 3.336 10.079 10.079 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.239-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18Z" />
                  </svg>
                </div>
                <div style={{
                  background: "transparent",
                  maxWidth: "80%",
                }}>
                  <pre style={{
                    margin: 0, color: "rgba(255,255,255,0.88)",
                    fontFamily: FL, fontSize: 22, lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                  }}>
                    {displayed}
                    {!typingDone && cursorOn && (
                      <span style={{
                        display: "inline-block", width: 2, height: "1.1em",
                        background: C, verticalAlign: "text-bottom", marginLeft: 2,
                      }} />
                    )}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* ── Input bar ── */}
          <div style={{
            margin: "0 16px 16px",
            padding: "14px 20px",
            background: "#2f2f2f",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontFamily: FL, fontSize: 18, flex: 1 }}>
              Message ChatGPT
            </span>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: typingDone ? "white" : "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.3s",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={typingDone ? "black" : "rgba(255,255,255,0.3)"}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Shatter particles ── */}
      {sp > 0.04 && Array.from({ length: 48 }, (_, i) => {
        const angle = (i / 48) * Math.PI * 2;
        const dist  = sp * (150 + (i % 7) * 38);
        return (
          <div key={i} style={{
            position: "absolute",
            left: 540 + Math.cos(angle) * dist - 3,
            top:  870 + Math.sin(angle) * dist * 0.62 - 3,
            width:  i % 4 === 0 ? 8 : 5,
            height: i % 4 === 0 ? 8 : 5,
            background: i % 2 === 0 ? C : CO,
            borderRadius: i % 3 === 0 ? "50%" : 1,
            opacity: (1 - sp) * 0.85,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
