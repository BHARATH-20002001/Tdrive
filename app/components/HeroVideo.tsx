"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/*
 * Drive Capital reference behaviour:
 *  – Full-screen section, bg-black, overflow:hidden
 *  – H2 subtitle pinned top-left, always visible
 *  – DRIVE block (video + mask) is 130% tall so there is room to travel
 *  – On load  → block rises from +35% → 0  (bottom-to-top entry)
 *  – On scroll → section is pinned, block travels 0 → -18% upward
 *                (bottom of letters revealed, top clipped by section edge)
 *  – Video is visible ONLY through the white DRIVE letterforms
 *    via mix-blend-multiply on the black overlay
 *
 * H2 → H1 gap:
 *  paddingTop on the mask overlay = pt-8 (32px) + h2 height (~120px) + 40px gap = 192px
 *  transformOrigin:"top center" keeps DRIVE anchored to that 192px baseline
 *  while scaleY:3.4 stretches downward only.
 */

const ENTRY_START_Y = 35;   // block starts 35% below → animates to 0
const SCROLL_END_Y  = -18;  // block scrolls to -18% (reveals bottom letters)

export default function HeroVideo() {
  const sectionRef  = useRef<HTMLElement>(null);
  const blockRef    = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  // Slow video playback to 0.6×
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const set = () => { vid.playbackRate = 0.6; };
    set();
    vid.addEventListener("loadeddata", set);
    return () => vid.removeEventListener("loadeddata", set);
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const block   = blockRef.current;
    if (!section || !block) return;

    // ── Subtitle: clips inside its overflow:hidden wrapper, slides up on load
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { yPercent: 110, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out", delay: 0.05 }
      );
    }

    // ── Block entry: DRIVE rises from below the section boundary
    gsap.fromTo(
      block,
      { yPercent: ENTRY_START_Y },
      { yPercent: 0, duration: 1.6, ease: "power3.out", delay: 0.1 }
    );

    // ── Scroll: pin section, drive block upward scrubbed against scroll
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=70%",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(block, { yPercent: self.progress * SCROLL_END_Y });
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/*
        ── H2 Subtitle ──────────────────────────────────────────────────────
        Lives OUTSIDE the animated block so it stays fixed top-left while
        the DRIVE block scrolls beneath it.
        overflow:hidden on the wrapper clips the slide-up entry animation.
        z-30 keeps it above the block (z-10) and mask (z-20).
      */}
      <div
        className="absolute top-0 left-0 w-full z-30
                   px-[20px] lg:px-[60px] pt-8
                   overflow-hidden pointer-events-none"
      >
        <div ref={subtitleRef} style={{ opacity: 0 }}>
          <h2
            className="text-white font-black uppercase tracking-tighter
                       leading-[0.95] text-3xl md:text-5xl lg:text-6xl
                       font-[family-name:var(--font-space-grotesk)]"
            style={{ fontStyle: "normal" }}
          >
            Greatness is in
            <br />
            Our backyard
          </h2>
        </div>
      </div>

      {/*
        ── Animated block ────────────────────────────────────────────────────
        130% tall = 100% section height + 30% travel room above/below.
        GSAP translates this div; both video and mask move together.
      */}
      <div
        ref={blockRef}
        className="absolute inset-x-0 top-0"
        style={{ height: "130%", willChange: "transform" }}
      >
        {/*
          Video: sits at z-10, fills the block entirely.
          It is invisible everywhere EXCEPT where the white DRIVE
          letterforms punch through the black mask above it.
        */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-10"
          src="/header_vid_-_1080_v3.m4v"
        />

        {/*
          Black mask overlay at z-20 (above video).
          mix-blend-multiply math:
            black (0,0,0) × video = 0,0,0  → fully opaque black (hides video)
            white (1,1,1) × video = video  → video shows through letterforms

          paddingTop = 32px (section pt-8)
                     + 120px (h2 two-line height at lg: text-6xl × leading-[0.95] × 2 lines)
                     + 40px  (desired gap between h2 and DRIVE)
                     = 192px

          items-start + paddingTop anchors DRIVE's top edge exactly 40px below the h2.
          transformOrigin:"top center" ensures scaleY(3.4) stretches DOWNWARD only
          from that anchor — so the gap never shifts.
        */}
        <div
          className="absolute inset-0 z-20 bg-black mix-blend-multiply
                     flex items-start justify-center select-none"
          style={{ paddingTop: "192px" }}
        >
          <h1
            className="text-white leading-none tracking-tighter uppercase
                       font-black text-center whitespace-nowrap"
            style={{
              fontSize: "clamp(160px, 26vw, 520px)",
              fontFamily: "var(--font-staff-wide), sans-serif",
              fontStyle: "normal",
              transform: "scaleY(3.4) scaleX(1.05)",
              transformOrigin: "top center",   // ← anchors top of letters to paddingTop
            }}
          >
            DRIVE
          </h1>
        </div>
      </div>
    </section>
  );
}
