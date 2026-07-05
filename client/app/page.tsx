"use client";

import HeroContent from "@/components/landing/hero-content";
import Header from "@/components/landing/header";
import Spline from "@splinetool/react-spline";

export default function ShaderShowcase() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
  <Header />
  <Spline
    scene="https://prod.spline.design/ApHmM491dOaPMvvn/scene.splinecode"
    className="absolute inset-0 w-full h-full pointer-events-none"
  />
  <HeroContent />
</div>
  );
}
