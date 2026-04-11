import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, Sequence } from "remotion";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";

interface CaptionsProps {
  captions: Caption[];
}

const SWITCH_CAPTIONS_EVERY_MS = 2500;

export const Captions: React.FC<CaptionsProps> = ({ captions }) => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
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
            layout="none"
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

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  const durationMs = page.durationMs;
  const progress = durationMs > 0 ? currentTimeMs / durationMs : 0;

  const opacity = interpolate(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0], {
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
        padding: "0 40px",
        opacity,
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "28px 56px",
          borderRadius: 40,
          border: "1px solid rgba(0, 242, 255, 0.2)",
          maxWidth: 900,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 42,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.2,
            textTransform: "uppercase",
            fontStyle: "italic",
            margin: 0,
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            whiteSpace: "pre-wrap",
          }}
        >
          {page.tokens.map((token, index) => {
            const isActive = absoluteTimeMs >= token.fromMs && absoluteTimeMs < token.toMs;

            return (
              <span
                key={index}
                style={{
                  color: isActive ? "#00f2ff" : "rgba(255,255,255,0.4)",
                  transition: "color 0.1s ease, transform 0.1s ease",
                  textShadow: isActive ? "0 0 15px rgba(0, 242, 255, 0.5)" : "none",
                  display: "inline-block",
                  padding: "0 6px",
                  transform: `scale(${isActive ? 1.05 : 1})`,
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
