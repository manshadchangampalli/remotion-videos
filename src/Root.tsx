import "./index.css";
import { Composition } from "remotion";
import { ShazamComposition } from "./shazam/Composition";
import { MyComposition as MonolithicComposition } from "./monolithic-vs-microservices/Composition";
import { NpmVsPnpm } from "./npm-vs-pnpm/NpmVsPnpm";
import { VPNComposition, TOTAL_FRAMES as VPN_FRAMES } from "./vpn/Composition";
import { DecathlonRFIDComposition, TOTAL_FRAMES as DECA_FRAMES } from "./decathlon/Composition";

// Loading the Outfit font for a premium look
import "@remotion/google-fonts/Outfit";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShazamConstellation"
        component={ShazamComposition}
        durationInFrames={1710}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MonolithicVsMicroservices"
        component={MonolithicComposition}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NpmVsPnpm"
        component={NpmVsPnpm}
        durationInFrames={1494}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VPNRouting"
        component={VPNComposition}
        durationInFrames={VPN_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DecathlonRFID"
        component={DecathlonRFIDComposition}
        durationInFrames={DECA_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
