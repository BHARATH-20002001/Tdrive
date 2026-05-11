"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const router = useRouter();

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;

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

          // Initial setup for the preloader
          gsap.set(containerRef.current, { yPercent: 0, display: "block" });

          // Fade in logo
          tl.fromTo(".preloader-logo",
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
    }
  }, []);

  useEffect(() => {
    const handleTransition = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const targetUrl = customEvent.detail;
      
      if (!containerRef.current) return;
      
      setIsLoading(true);

      gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsLoading(false);
          }
        });

        // Slide up the background from the bottom to cover the screen
        tl.fromTo(containerRef.current,
          { yPercent: 100, display: "block" },
          { 
            yPercent: 0, 
            duration: 0.6, 
            ease: "power3.inOut",
            onComplete: () => {
              // Trigger the Next.js routing right after the screen is fully covered
              router.push(targetUrl);
            }
          }
        )
          // Briefly fade in logo
          .fromTo(".preloader-logo",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }
          )
          // Fade out logo
          .to(".preloader-logo",
            { autoAlpha: 0, duration: 0.3, ease: "power2.inOut", delay: 0.2 }
          )
          // Slide background up to reveal the new page
          .to(containerRef.current,
            { yPercent: -100, duration: 0.8, ease: "power3.inOut" }
          );
      }, containerRef);
    };

    window.addEventListener("trigger-transition", handleTransition);
    return () => window.removeEventListener("trigger-transition", handleTransition);
  }, [router]);

  // We keep it in the DOM but hidden when not loading so GSAP can reset it properly on next load
  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] bg-[#0A0A0B] ${!isLoading ? 'hidden' : ''}`}
    >
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-10 md:-translate-x-0 w-[50%] md:w-[40%] preloader-logo opacity-0 flex justify-center md:justify-start">
        <Image
          src="/tdrive-logo-black.svg"
          alt="tdrive Logo"
          width={400}
          height={120}
          priority
          className="invert w-full h-auto max-w-[200px] md:max-w-none object-contain object-bottom md:object-left-bottom"
        />
      </div>
    </div>
  );
}
