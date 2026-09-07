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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || menuOpen ? "py-4 bg-navy/95 backdrop-blur-md border-b border-gold/20 shadow-2xl" : "py-6 bg-gradient-to-b from-navy/90 to-transparent"}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 md:gap-2 no-underline text-[15px] sm:text-[17px] md:text-xl font-bold tracking-widest heading-font drop-shadow-[0_0_8px_rgba(201,148,58,0.3)] leading-tight"
          >
            <span className="text-white">ARK OF HOPE</span>
            <span className="text-gold">PROJECT</span>
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
            className="flex md:hidden flex-col gap-[5px] cursor-pointer p-1 bg-transparent border-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-[1.5px] bg-[#F5EDD8] transition-all duration-300 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
            ></span>
            <span
              className={`block w-6 h-[1.5px] bg-[#F5EDD8] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-[1.5px] bg-[#F5EDD8] transition-all duration-300 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
            ></span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 right-0 z-40 bg-navy/95 border-b border-gold/20 backdrop-blur-xl px-10 pt-8 pb-10 flex flex-col gap-0 transition-all duration-300 md:hidden ${menuOpen ? "top-[70px] opacity-100 pointer-events-auto" : "-top-full opacity-0 pointer-events-none"}`}
      >
        <Link
          href="#home"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2"
        >
          Home
        </Link>
        <Link
          href="#the-story"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2"
        >
          Story
        </Link>
        <Link
          href="#our-mission"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2"
        >
          Mission
        </Link>
        <Link
          href="#story"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2"
        >
          Progress
        </Link>
        <Link
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2"
        >
          Contact
        </Link>
        <div className="mt-8">
          <button
            onClick={() => {
              openDonation();
              setMenuOpen(false);
            }}
            className="w-full bg-gold text-navy font-bold py-4 rounded-xl text-sm tracking-[2px] hover:bg-white transition-all active:scale-95 heading-font"
          >
            GIVE NOW
          </button>
        </div>
      </div>
    </>
  );
}
