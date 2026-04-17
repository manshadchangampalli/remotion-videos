import { transcribe, toCaptions } from "@remotion/install-whisper-cpp";
import fs from "fs";
import path from "path";

async function transcribeFile(inputPath: string, outputPath: string) {
  console.log(`\nTranscribing: ${inputPath}`);
  const whisperCppOutput = await transcribe({
    model: "base.en",
    whisperPath: path.join(process.cwd(), "whisper.cpp"),
    whisperCppVersion: "1.5.5",
    inputPath,
    tokenLevelTimestamps: true,
  });
  const { captions } = toCaptions({ whisperCppOutput });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(captions, null, 2));
  console.log("Done:", outputPath);
}

async function main() {
  const root = process.cwd();

  // Note: whisper.cpp requires 16 kHz mono WAV files.
  // The originals are 24 kHz and have been pre-converted with ffmpeg to /tmp/whisper_16k/.
  const jobs: Array<{ input: string; output: string }> = [
    {
      input: "/tmp/whisper_16k/vpn.wav",
      output: path.join(root, "public/vpn/captions.json"),
    },
    {
      input: "/tmp/whisper_16k/shazam-song.wav",
      output: path.join(root, "public/shazam/captions.json"),
    },
    {
      input: "/tmp/whisper_16k/whatsapp.wav",
      output: path.join(root, "public/whatsapp/captions.json"),
    },
    {
      input: "/tmp/whisper_16k/download.wav",
      output: path.join(root, "public/npm-vs-pnpm/captions.json"),
    },
  ];

  for (const job of jobs) {
    try {
      await transcribeFile(job.input, job.output);
    } catch (err) {
      console.error(`ERROR transcribing ${job.input}:`, err);
    }
  }

  console.log("\nAll done!");
}

main().catch(console.error);
