import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  Sequence,
} from "remotion";

export const Scene2Monolith: React.FC = () => {
  return (
    <AbsoluteFill className="bg-black flex items-center justify-center">
      
      {/* 1. US Military Analogy */}
      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill className="flex items-center justify-center p-10">
          <div className="text-center z-10 bg-black/40 p-10 backdrop-blur-md border border-white/10 rounded-2xl">
            <h2 className="text-6xl font-bold uppercase tracking-tight text-brand-primary mb-10">
               Monolith <br /> US Military
            </h2>
            <Img 
              src={staticFile("trump-usa-military.png")} 
              className="w-[800px] h-[500px] object-cover rounded-3xl shadow-glow mb-10"
            />
            <p className="text-4xl italic text-gray-400">Everything coordinated from one base</p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 2. In Code Details */}
      <Sequence from={300} durationInFrames={300}>
        <AbsoluteFill className="flex items-center justify-center">
          <div className="w-[800px] border-4 border-white/20 p-12 rounded-[40px] bg-white/5 backdrop-blur-sm shadow-2xl">
            <h3 className="text-6xl font-black mb-10 uppercase text-center underline decoration-brand-primary">One Codebase</h3>
            <div className="grid grid-cols-2 gap-8 text-4xl font-mono uppercase text-gray-300">
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4"><span>📦</span> UI</div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4"><span>📦</span> AUTH</div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4"><span>📦</span> PAYMENTS</div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4"><span>📦</span> ORDERS</div>
            </div>
            <div className="mt-12 bg-brand-primary/20 p-8 border-2 border-brand-primary rounded-2xl text-center">
              <span className="text-4xl font-black text-brand-primary">ONE DEPLOY 🚢</span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 3. Examples */}
      <Sequence from={600} durationInFrames={300}>
        <AbsoluteFill className="flex flex-col items-center justify-center gap-16">
          <h2 className="text-7xl font-black uppercase tracking-tight italic">Built on Monoliths</h2>
          <div className="flex flex-wrap justify-center gap-12 max-w-[900px]">
            <div className="bg-white/10 p-10 rounded-[40px] border border-white/20">
              <Img src={staticFile("stackoverflow.png")} className="h-40 object-contain" />
            </div>
            <div className="bg-white/10 p-10 rounded-[40px] border border-white/20">
              <Img src={staticFile("basecamp.png")} className="h-40 object-contain" />
            </div>
            <div className="bg-white/10 p-10 rounded-[40px] border border-white/20">
               <div className="h-40 flex items-center px-10 text-6xl font-bold text-[#96bf48]">SHOPIFY</div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 4. The Cons / WarZone */}
      <Sequence from={900}>
        <AbsoluteFill className="bg-red-900/20 flex flex-col items-center justify-center p-20 z-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-50" />
          <h2 className="text-[12rem] font-black text-red-600 uppercase mb-4 animate-pulse drop-shadow-2xl">BUG ❌</h2>
          <h3 className="text-6xl font-black text-center text-white mb-10 leading-tight">ONE BUG IN <br/> <span className="text-red-500">PAYMENTS?</span></h3>
          <div className="p-10 border-4 border-red-600 bg-red-600 text-white rounded-3xl">
             <p className="text-7xl font-black uppercase italic">App Crashed!</p>
          </div>
          <p className="mt-20 text-5xl font-mono uppercase text-red-400 font-bold bg-black p-4">Codebase = War Zone ⚔️</p>
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
