import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, Sequence } from "remotion";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";
import { fontFamily } from "./fonts";

interface CaptionsProps {
  captions: Caption[];
}

const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const Captions: React.FC<CaptionsProps> = ({ captions }) => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = nextPage 
          ? (nextPage.startMs / 1000) * fps 
          : startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps;
        const durationInFrames = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time relative to the start of the sequence
  const currentTimeMs = (frame / fps) * 1000;
  // Convert to absolute time by adding the page start
  const absoluteTimeMs = page.startMs + currentTimeMs;

  const durationMs = page.durationMs;
  const progress = durationMs > 0 ? currentTimeMs / durationMs : 0;

  // Fade in/out
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 60px",
        opacity,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          padding: "24px 48px",
          borderRadius: 32,
          border: "2px solid rgba(0,0,0,0.08)",
          maxWidth: 900,
          boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 54,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.2,
            textTransform: "uppercase",
            fontStyle: "italic",
            margin: 0,
            color: "#000",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            whiteSpace: "pre",
          }}
        >
          {page.tokens.map((token, index) => {
            const isActive = absoluteTimeMs >= token.fromMs && absoluteTimeMs < token.toMs;
            
            return (
              <span
                key={index}
                style={{
                  color: isActive ? "#2563eb" : "#4b5563", // Blue for highlight, gray-600 for others
                  transition: "color 0.1s ease",
                  textShadow: isActive ? "0 0 10px rgba(37, 99, 235, 0.2)" : "none",
                }}
              >
                {token.text}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
