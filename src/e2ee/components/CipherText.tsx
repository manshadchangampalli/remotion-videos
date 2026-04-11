import React from "react";

const SYMBOLS = ["#", "@", "!", "&", "%", "$", "?", "~", "^", "*"];

interface CipherTextProps {
  text: string;
  color?: string;
  scramble?: boolean;
  frame: number;
  fontSize?: number;
  fontFamily?: string;
}

export const CipherText: React.FC<CipherTextProps> = ({
  text,
  scramble = false,
  frame,
  fontSize = 42,
  fontFamily = "'Courier New', monospace",
}) => {
  const colors = ["#FF1744", "#FF6D00"];

  return (
    <span style={{ display: "inline-block", fontFamily }}>
      {text.split("").map((char, i) => {
        const shouldScramble =
          scramble && Math.floor((frame + i * 7) % 4) === 0;
        const displayed = shouldScramble
          ? SYMBOLS[Math.floor((frame + i) % SYMBOLS.length)]
          : char;
        const dy = Math.sin(frame / 8 + i) * 3;
        const rotation = scramble ? Math.sin(frame / 6 + i * 1.3) * 6 : 0;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${dy}px) rotate(${rotation}deg)`,
              color: i % 2 === 0 ? colors[0] : colors[1],
              fontSize,
              fontWeight: 900,
              textShadow: `0 0 8px ${colors[i % 2]}88`,
            }}
          >
            {displayed}
          </span>
        );
      })}
    </span>
  );
};
