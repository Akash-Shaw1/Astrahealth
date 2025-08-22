"use client";

import { useRouter } from "next/navigation";
import React, { JSX } from "react";

export default function HeroContent(): JSX.Element {
  const router =useRouter();
  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg text-black">
      <div className="text-left">
        {/* Badge */}
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 backdrop-blur-sm mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full" />
          <span className="text-black/80 text-xs font-light relative z-10">
            Smarter Healthcare, One Platform
          </span>
        </div>

        {/* Main Heading with Gradient Text */}
        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light mb-4">
          <span className="font-medium italic instrument bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent pr-1">
            Astra
          </span>{" "}
          <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Health
          </span>
          <br />
          <span className="font-light tracking-tight bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Your All-in-One Medical Solution
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm font-light text-black/70 mb-4 leading-relaxed">
          Book doctor appointments, order medicines, track prescriptions,
          manage health records, and get emergency support — all in one secure,
          easy-to-use platform designed to keep your health in your hands.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <button className="px-8 py-3 rounded-full bg-transparent border border-black/20 text-black font-normal text-xs transition-all duration-200 hover:bg-black/5 hover:border-black/30 cursor-pointer" onClick={()=>{router.push("/dashboard")}} >
            Explore Services
          </button>
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-normal text-xs transition-all duration-200 hover:opacity-95 cursor-pointer" onClick={()=>{router.push("/sign-up")}}>
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
