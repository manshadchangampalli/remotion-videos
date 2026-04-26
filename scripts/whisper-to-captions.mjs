import fs from "node:fs";
import path from "node:path";

const input = process.argv[2] ?? "public/decathlon/decathlon 2.json";
const output = process.argv[3] ?? "public/decathlon/captions.json";

const raw = JSON.parse(fs.readFileSync(input, "utf8"));
const captions = raw.segments.flatMap((seg) =>
  (seg.words ?? []).map((w) => ({
    text: w.word,
    startMs: Math.round(w.start * 1000),
    endMs: Math.round(w.end * 1000),
    timestampMs: Math.round(((w.start + w.end) / 2) * 1000),
    confidence: w.probability ?? null,
  })),
);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(captions, null, 2));
console.log(`Wrote ${captions.length} caption tokens → ${output}`);
