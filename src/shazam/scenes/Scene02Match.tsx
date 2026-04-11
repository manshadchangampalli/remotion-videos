import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CyberGrid } from "../components/CyberGrid";
import { IPhoneFrame } from "../components/IPhoneFrame";
import { MainHeading } from "../components/MainHeading";

export const Scene02Match: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone present from start (continuing from Scene01)
  const floatY = Math.sin(frame / 22) * 8;

  // Match explosion: green ring at frame 55
  const matchFrame = 55;
  const ringSpring = spring({
    frame: frame - matchFrame,
    fps,
    config: { damping: 10, stiffness: 90 },
  });
  const ringScale = interpolate(ringSpring, [0, 1], [0.1, 3.5]);
  const ringOp = interpolate(ringSpring, [0, 0.2, 1], [0, 1, 0]);

  const ring2Scale = interpolate(
    spring({ frame: frame - matchFrame - 8, fps, config: { damping: 12, stiffness: 80 } }),
    [0, 1], [0.1, 4.2]
  );
  const ring2Op = interpolate(
    spring({ frame: frame - matchFrame - 8, fps, config: { damping: 12, stiffness: 80 } }),
    [0, 0.15, 1], [0, 0.7, 0]
  );

  // Screen switches to "matched" state after matchFrame
  const matchReveal = interpolate(frame, [matchFrame, matchFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Recording screen content
  const recordingScreen = (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
      {/* Fallback background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #06080f 0%, #030608 100%)",
        }}
      />
      {/* OffthreadVideo absolutely fills the phone screen — covers any aspect ratio */}
      <OffthreadVideo
        src={staticFile("shazam-song/match_video.mov")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
        }}
        volume={0}
      />
      {/* Listening overlay */}
      {frame < matchFrame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: `3px solid rgba(0,242,255,${0.5 + Math.sin(frame / 8) * 0.5})`,
              boxShadow: `0 0 ${20 + Math.sin(frame / 8) * 15}px rgba(0,242,255,0.5)`,
            }}
          />
          <div style={{ color: "#00f2ff", fontSize: 14, fontFamily: "sans-serif", fontWeight: 600, letterSpacing: 2 }}>
            LISTENING...
          </div>
        </div>
      )}
      {/* Match result overlay */}
      {matchReveal > 0.1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(0,10,5,${matchReveal * 0.82})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: matchReveal,
          }}
        >
          <div style={{ fontSize: 28, color: "#00ffcc", fontWeight: 900, fontFamily: "'Montserrat', sans-serif" }}>
            ✓ MATCHED
          </div>
          <div style={{ fontSize: 16, color: "#fff", fontFamily: "sans-serif", fontWeight: 700, textAlign: "center", padding: "0 12px" }}>
            Die With A Smile
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
            Lady Gaga & Bruno Mars
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <CyberGrid opacity={0.4} />

      <MainHeading startFrame={-10} />

      {/* Match rings */}
      {frame >= matchFrame && (
        <div
          style={{
            position: "absolute",
            top: 860, // Adjusted to match new phone center (500 + 720/2)
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "3px solid #00ffcc",
              opacity: ringOp,
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              boxShadow: "0 0 30px #00ffcc44",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "2px solid #00ffcc",
              opacity: ring2Op,
              transform: `translate(-50%, -50%) scale(${ring2Scale})`,
            }}
          />
        </div>
      )}

      {/* iPhone */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ transform: `translateY(${floatY}px)` }}>
          <IPhoneFrame
            width={360}
            height={720}
            glowColor={frame >= matchFrame ? "#00ffcc" : "#00f2ff"}
            screenContent={recordingScreen}
          />
        </div>
      </div>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            color: frame >= matchFrame ? "#00ffcc" : "#fff",
            fontSize: 46,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            lineHeight: 1.3,
            textShadow: frame >= matchFrame
              ? "0 0 30px rgba(0,255,204,0.5)"
              : "0 0 20px rgba(0,242,255,0.2)",
          }}
        >
          {frame < matchFrame
            ? "...and 3 seconds later"
            : "your phone knows exactly\nwhat song is playing."}
        </div>
      </div>
    </AbsoluteFill>
  );
};
