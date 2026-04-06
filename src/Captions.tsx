import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Caption } from "@remotion/captions";

interface CaptionsProps {
  captions: Caption[];
}

export const Captions: React.FC<CaptionsProps> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;

  // Find the active caption
  const activeCaption = captions.find(
    (c) => currentTimeMs >= c.startMs && currentTimeMs <= c.endMs
  );

  if (!activeCaption) return null;

  return (
    <div className="absolute bottom-40 left-0 right-0 flex justify-center px-20">
      <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
        <h2 className="text-5xl font-bold text-center leading-tight tracking-tight uppercase italic">
          {activeCaption.text.split(" ").map((word, i) => {
            // Highlight current word if we had word-level timestamps, 
            // but whisper.cpp output might be chunks.
            return (
              <span key={i} className="mx-1 inline-block">
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </div>
  );
};
