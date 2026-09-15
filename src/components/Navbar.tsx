"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDonation } from "./DonationProvider";

export default function Navbar() {
  const { openDonation } = useDonation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSuccess = (paymentData: any) => {
    console.log("Navbar donation success", paymentData);
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full max-w-[100vw] z-50 transition-all duration-300 pt-[max(0.6rem,env(safe-area-inset-top))] ${scrolled || menuOpen ? "pb-3 sm:pb-4 bg-navy/95 backdrop-blur-md border-b border-gold/20 shadow-2xl" : "pb-3 sm:pb-5 bg-navy/90 md:bg-gradient-to-b md:from-navy/90 md:to-transparent backdrop-blur-md md:backdrop-blur-none border-b border-gold/20 md:border-b-0"}`}
      >
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 flex justify-between items-center gap-2 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 no-underline text-[13px] sm:text-[17px] md:text-xl font-bold tracking-wider sm:tracking-widest heading-font drop-shadow-[0_0_8px_rgba(201,148,58,0.3)] leading-tight shrink-0"
          >
            <span className="text-white whitespace-nowrap">ARK OF HOPE</span>
            <span className="text-gold shrink-0">PROJECT</span>
          </Link>

          <ul className="hidden md:flex list-none gap-4 lg:gap-8 items-center whitespace-nowrap">
            <li>
              <Link
                href="#home"
                className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#the-story"
                className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font"
              >
                Story
              </Link>
            </li>
            <li>
              <Link
                href="#our-mission"
                className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font"
              >
                Mission
              </Link>
            </li>
            <li>
              <Link
                href="#story"
                className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font"
              >
                Progress
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font"
              >
                Contact
              </Link>
            </li>
            <li>
              <button
                onClick={() => openDonation()}
                className="w-[140px] bg-gold text-navy font-bold py-3 rounded-lg text-xs tracking-wider hover:bg-white transition-all shadow-lg active:scale-95 heading-font"
              >
                GIVE NOW
              </button>
            </li>
          </ul>

          <button
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl bg-gold hover:bg-white text-navy shrink-0 flex-shrink-0 transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(223,178,93,0.5)] active:scale-95 z-50 p-0 border border-gold ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="#08111b" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="#08111b" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-x-0 top-[56px] xs:top-[62px] z-40 bg-[#08111b] border-b-2 border-gold/40 shadow-2xl px-6 pt-3 pb-8 flex flex-col gap-0 transition-transform duration-300 ease-out md:hidden ${menuOpen ? "translate-y-0" : "-translate-y-[150%] pointer-events-none"}`}
      >
        <Link
          href="#home"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-bold tracking-widest text-white hover:text-gold no-underline py-3.5 border-b border-gold/15 transition-all hover:pl-2 flex items-center justify-between"
        >
          <span>HOME</span>
          <span className="text-gold text-xs">→</span>
        </Link>
        <Link
          href="#the-story"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-bold tracking-widest text-white hover:text-gold no-underline py-3.5 border-b border-gold/15 transition-all hover:pl-2 flex items-center justify-between"
        >
          <span>STORY</span>
          <span className="text-gold text-xs">→</span>
        </Link>
        <Link
          href="#our-mission"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-bold tracking-widest text-white hover:text-gold no-underline py-3.5 border-b border-gold/15 transition-all hover:pl-2 flex items-center justify-between"
        >
          <span>MISSION</span>
          <span className="text-gold text-xs">→</span>
        </Link>
        <Link
          href="#story"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-bold tracking-widest text-white hover:text-gold no-underline py-3.5 border-b border-gold/15 transition-all hover:pl-2 flex items-center justify-between"
        >
          <span>PROGRESS</span>
          <span className="text-gold text-xs">→</span>
        </Link>
        <Link
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-bold tracking-widest text-white hover:text-gold no-underline py-3.5 border-b border-gold/15 transition-all hover:pl-2 flex items-center justify-between"
        >
          <span>CONTACT</span>
          <span className="text-gold text-xs">→</span>
        </Link>
        <div className="mt-5">
          <button
            onClick={() => {
              openDonation();
              setMenuOpen(false);
            }}
            className="w-full bg-gold text-[#08111b] font-bold py-3.5 rounded-xl text-sm tracking-[2px] hover:bg-white transition-all active:scale-95 heading-font shadow-[0_4px_15px_rgba(223,178,93,0.4)]"
          >
            GIVE NOW
          </button>
        </div>
      </div>
    </>
  );
}
