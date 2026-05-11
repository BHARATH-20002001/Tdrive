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
    // Create timeline for the desktop menu items
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

  // Handle body scroll locking for mobile menu
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (window.location.pathname === href) return;
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("trigger-transition", { detail: href }));
  };

  const mobileNavItems = [
    { num: "01", label: "PORTFOLIO", href: "/portfolio" },
    { num: "02", label: "STORY", href: "/story" },
    { num: "03", label: "TEAM", href: "/team" },
    { num: "04", label: "CAREERS", href: "/careers" },
    { num: "05", label: "TALENT", href: "/talent" },
    { num: "06", label: "SEED PROGRAM", href: "/seed-program" },
  ];

  return (
    <>
      <nav className="w-full bg-black sticky top-0 z-50 border-b border-gray-900 font-[family-name:var(--font-space-grotesk)]" ref={containerRef}>
        <div className="w-full px-[20px] lg:px-[60px]">
          <div className="flex items-center justify-between h-20 relative">
            
            {/* Left side: Logo */}
            <div className="flex-shrink-0 z-20">
              <Link href="/" onClick={(e) => handleTransition(e, "/")}>
                <Image
                  src="/tdrive-logo-black.svg"
                  alt="tdrive Logo"
                  width={150}
                  height={48}
                  priority
                  className="invert w-36 md:w-[200px] h-auto"
                />
              </Link>
            </div>

            {/* Right side: Nav Links and Hamburger */}
            <div className="flex items-center relative justify-end">
              
              {/* Wrapper to clip the sliding menu so it doesn't show to the right of the button */}
              <div className="hidden md:flex absolute right-10 h-full items-center overflow-hidden z-10 pointer-events-none">
                <div className="nav-container flex items-center invisible pointer-events-auto">
                  <Link
                    href="/"
                    onClick={(e) => handleTransition(e, "/")}
                    className="nav-item bg-[#f1f0ea] border-y border-l border-gray-400 border-r-[0.5px] text-gray-900 hover:text-black px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap rounded-l-md"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    onClick={(e) => handleTransition(e, "/about")}
                    className="nav-item bg-[#f1f0ea] border-y border-gray-400 border-l-[0.5px] border-r-[0.5px] text-gray-900 hover:text-black px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    About
                  </Link>
                  <Link
                    href="/services"
                    onClick={(e) => handleTransition(e, "/services")}
                    className="nav-item bg-[#f1f0ea] border-y border-gray-400 border-l-[0.5px] text-gray-900 hover:text-black px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Services
                  </Link>
                </div>
              </div>

              {/* Hamburger Button (stays on top) */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#f1f0ea] border border-gray-400 flex items-center justify-center w-10 h-10 hover:bg-[#e4e3dd] transition-colors z-20 relative shadow-lg text-gray-900"
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

      {/* Mobile Slide-down Menu */}
      <div
        className={`fixed inset-0 bg-[#0a0a0a] z-40 flex flex-col items-center md:hidden transform transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] font-[family-name:var(--font-space-grotesk)] ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          backgroundImage: "url('/noise.png')", 
          backgroundBlendMode: "overlay"
        }}
      >
        {/* Nav Items */}
        <div className="flex flex-col items-center justify-center w-full px-6 flex-1 pt-24 pb-8 space-y-6 sm:space-y-8 overflow-y-auto">
          {mobileNavItems.map((item) => (
            <Link
              key={item.num}
              href={item.href}
              onClick={(e) => handleTransition(e, item.href)}
              className="group flex flex-col items-center cursor-pointer"
            >
              <span className="text-white/70 text-xs sm:text-sm font-medium tracking-widest mb-1">{item.num}</span>
              <span className="text-white font-black text-[2rem] sm:text-5xl leading-none uppercase tracking-tight group-hover:text-gray-300 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="pb-12 flex space-x-6">
          <a href="#" aria-label="LinkedIn" className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="#" aria-label="Twitter" className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
