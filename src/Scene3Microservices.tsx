import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  Sequence,
} from "remotion";

export const Scene3Microservices: React.FC = () => {
  return (
    <AbsoluteFill className="bg-[#111] flex items-center justify-center">
      
      {/* 1. Iran Military Analogy */}
      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill className="flex flex-col items-center justify-center p-12 bg-[#0a0a0a]">
          <div className="text-center z-10 border border-white/10 p-12 rounded-[50px] bg-white/5">
             <h2 className="text-6xl font-black uppercase text-brand-secondary mb-10">Microservices <br /> 31 Regions</h2>
             <Img 
               src={staticFile("iran.png")} 
               className="w-[800px] h-[500px] object-cover rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-10"
             />
             <p className="text-4xl text-gray-400 italic">Hit one region, the rest keep fighting 👊</p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 2. In Code Details - Independent Services */}
      <Sequence from={300} durationInFrames={300}>
        <AbsoluteFill className="flex items-center justify-center bg-[#070707]">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
             <h2 className="text-6xl font-black text-brand-secondary mb-16 underline decoration-white/20">Independent Components</h2>
             <div className="grid grid-cols-2 gap-12 font-mono text-4xl">
                <div className="p-8 border-4 border-brand-secondary/40 rounded-3xl text-brand-secondary font-bold text-center">AUTH <br/> <small className="text-gray-500">DB.v1</small></div>
                <div className="p-8 border-4 border-brand-secondary/40 rounded-3xl text-brand-secondary font-bold text-center">ORDERS <br/> <small className="text-gray-500">DB.v2</small></div>
                <div className="p-8 border-4 border-brand-secondary/40 rounded-3xl text-brand-secondary font-bold text-center">PAY <br/> <small className="text-gray-500">DB.v3</small></div>
                <div className="p-8 border-4 border-brand-secondary/40 rounded-3xl text-brand-secondary font-bold text-center">LOGS <br/> <small className="text-gray-500">DB.v4</small></div>
             </div>
             <div className="mt-16 text-4xl font-black p-6 bg-brand-secondary text-black rounded-full rotate-2">API GATEWAY 🛡️</div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 3. Examples */}
      <Sequence from={600} durationInFrames={300}>
        <AbsoluteFill className="flex flex-col items-center justify-center gap-16 py-20">
          <h2 className="text-7xl font-black uppercase text-center text-white">Scale Masters</h2>
          <div className="flex flex-col gap-10 items-center">
            <div className="flex gap-10">
              <div className="bg-white/10 p-10 rounded-[40px]">
                <Img src={staticFile("netflix.png")} className="h-40 object-contain" />
              </div>
              <div className="bg-white/10 p-10 rounded-[40px]">
                <Img src={staticFile("amazon.png")} className="h-40 object-contain" />
              </div>
            </div>
            <div className="bg-white/10 p-10 rounded-[40px]">
              <Img src={staticFile("uber.png")} className="h-40 object-contain" />
            </div>
          </div>
          <div className="text-5xl font-black text-brand-secondary uppercase bg-black p-8 border-2 border-brand-secondary animate-bounce">
             NETFLIX: 700+ SERVICES 🤯
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 4. Complexity / CONS */}
      <Sequence from={900}>
        <AbsoluteFill className="flex flex-col items-center justify-center p-20 bg-orange-950/20">
          <h2 className="text-8xl font-black text-brand-accent uppercase mb-10 text-center">THE COST! 💸</h2>
          <div className="w-[850px] border-4 border-dashed border-brand-accent/40 p-12 rounded-[50px] space-y-8">
            <div className="flex items-center gap-8 text-5xl text-gray-300 font-bold bg-white/5 p-8 rounded-3xl">
               <span>🚢</span> 10 DEPLOYMENTS
            </div>
            <div className="flex items-center gap-8 text-5xl text-gray-300 font-bold bg-white/5 p-8 rounded-3xl">
               <span>🕵️</span> DISTRIBUTED DEBUGGING
            </div>
            <div className="flex items-center gap-8 text-5xl text-gray-300 font-bold bg-white/5 p-8 rounded-3xl">
               <span>☸️</span> KUBERNETES PAIN!
            </div>
          </div>
          <p className="mt-20 text-4xl font-mono text-center text-brand-accent p-6 border border-brand-accent rounded-3xl">
             Infrastructure = Full-time Job 🏗️
          </p>
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
