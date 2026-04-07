import React from "react";
import { AbsoluteFill } from "remotion";

export const Background: React.FC = () => (
  <AbsoluteFill>
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#0d1b3e" />
          <stop offset="55%" stopColor="#060d20" />
          <stop offset="100%" stopColor="#020408" />
        </radialGradient>
        <pattern id="smallGrid" width="54" height="54" patternUnits="userSpaceOnUse">
          <path d="M 54 0 L 0 0 0 54" fill="none" stroke="#0c1c3a" strokeWidth="0.6" />
        </pattern>
        <pattern id="bigGrid" width="216" height="216" patternUnits="userSpaceOnUse">
          <rect width="216" height="216" fill="url(#smallGrid)" />
          <path d="M 216 0 L 0 0 0 216" fill="none" stroke="#14284e" strokeWidth="1.2" />
        </pattern>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="1080" height="1920" fill="url(#bgGrad)" />
      <rect width="1080" height="1920" fill="url(#bigGrid)" opacity="0.55" />
    </svg>
  </AbsoluteFill>
);
