"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Create timeline for the menu items
    tl.current = gsap.timeline({ paused: true });

    tl.current.fromTo(
      ".nav-container",
      { 
        x: "100%", // Start completely behind the right edge of its clipping wrapper
        autoAlpha: 0, // opacity 0 and visibility hidden
      },
      { 
        x: 0, 
        autoAlpha: 1, // opacity 1 and visibility visible
        duration: 0.4, 
        ease: "power3.out" 
      }
    );
  }, { scope: containerRef });

  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isOpen]);

  return (
    <nav className="w-full bg-black sticky top-0 z-50 border-b border-gray-900" ref={containerRef}>
      <div className="w-full px-[20px] lg:px-[60px]">
        <div className="flex items-center justify-between h-20 relative">
          
          {/* Left side: Logo */}
          <div className="flex-shrink-0 z-20">
            <Link href="/">
              <Image
                src="/tdrive-logo-black.svg"
                alt="tdrive Logo"
                width={140}
                height={45}
                priority
                className="invert"
              />
            </Link>
          </div>

          {/* Right side: Nav Links and Hamburger */}
          <div className="flex items-center relative justify-end">
            
            {/* Wrapper to clip the sliding menu so it doesn't show to the right of the button */}
            <div className="absolute right-10 h-full flex items-center overflow-hidden z-10 pointer-events-none">
              <div className="nav-container flex items-center invisible pointer-events-auto">
                <Link
                  href="/"
                  className="nav-item bg-[#D9D9D9] border-y border-l border-gray-400 border-r-[0.5px] text-gray-900 hover:text-black px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap rounded-l-md"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="nav-item bg-[#D9D9D9] border-y border-gray-400 border-l-[0.5px] border-r-[0.5px] text-gray-900 hover:text-black px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="nav-item bg-[#D9D9D9] border-y border-gray-400 border-l-[0.5px] text-gray-900 hover:text-black px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Services
                </Link>
              </div>
            </div>

            {/* Hamburger Button (stays on top) */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`bg-[#D9D9D9] border border-gray-400 flex items-center justify-center w-10 h-10 hover:bg-[#C9C9C9] transition-colors z-20 relative shadow-lg text-gray-900 ${isOpen ? 'rounded-r-md' : 'rounded-md'}`}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="17" x2="20" y2="17"></line>
                </svg>
              )}
            </button>
            
          </div>
          
        </div>
      </div>
    </nav>
  );
}
