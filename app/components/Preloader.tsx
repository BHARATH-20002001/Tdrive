"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";

export default function Preloader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state on path change
    setIsLoading(true);

    // We need to wait for the DOM to render the loading screen before animating
    // Using a timeout of 0 ensures it runs in the next tick
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsLoading(false);
          }
        });

        // Slide up the background
        tl.fromTo(containerRef.current,
          { yPercent: 100, display: "block" },
          { yPercent: 0, duration: 0.8, ease: "power3.inOut" }
        )
          // Fade in logo
          .fromTo(".preloader-logo",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
          )
          // Fade out logo
          .to(".preloader-logo",
            { autoAlpha: 0, duration: 0.4, ease: "power2.inOut", delay: 0.6 }
          )
          // Slide background up to reveal page
          .to(containerRef.current,
            { yPercent: -100, duration: 0.8, ease: "power3.inOut" }
          );
      }, containerRef);

      return () => ctx.revert();
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // We keep it in the DOM but hidden when not loading so GSAP can reset it properly on next load
  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] bg-[#0A0A0B] ${!isLoading ? 'hidden' : ''}`}
    >
      <div className="absolute bottom-10 left-10 w-[50%] preloader-logo opacity-0">
        <Image
          src="/tdrive-logo-black.svg"
          alt="tdrive Logo"
          width={500}
          height={150}
          priority
          className="invert w-full h-auto object-contain object-left-bottom"
        />
      </div>
    </div>
  );
}
