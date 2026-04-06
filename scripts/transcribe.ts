import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import fs from "fs";

async function main() {
  const to = path.join(process.cwd(), "whisper.cpp");

  console.log("Installing Whisper.cpp...");
  await installWhisperCpp({
    to,
    version: "1.5.5",
  });

  console.log("Downloading Whisper model...");
  await downloadWhisperModel({
    model: "base.en",
    folder: to,
  });

  const inputPath = path.join(process.cwd(), "public/audio.wav");
  
  console.log("Transcribing...");
  const whisperCppOutput = await transcribe({
    model: "base.en",
    whisperPath: to,
    whisperCppVersion: "1.5.5",
    inputPath: inputPath,
    tokenLevelTimestamps: true,
  });

  console.log("Postprocessing captions...");
  const { captions } = toCaptions({
    whisperCppOutput,
  });

  fs.writeFileSync(
    path.join(process.cwd(), "public/captions.json"), 
    JSON.stringify(captions, null, 2)
  );
  console.log("Done! generated public/captions.json");
}

main().catch(console.error);
