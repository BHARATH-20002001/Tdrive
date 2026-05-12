"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Basic GSAP animation
    gsap.to(boxRef.current, {
      x: 150,
      rotation: 360,
      duration: 2,
      ease: "power3.inOut",
      yoyo: true,
      repeat: -1, // Loops indefinitely
    });
  }, { scope: containerRef }); // Scoping helps GSAP optimize query selectors

  return (
    <main
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-24"
    >
      <h1 className="text-5xl font-staff font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-12">
        Welcome to Tdrive
      </h1>

      {/* This box is styled by Tailwind and animated by GSAP */}
      <div
        ref={boxRef}
        className="w-32 h-32 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)]"
      />
    </main>
  );
}
