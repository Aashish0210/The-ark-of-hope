"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDonation } from "./DonationProvider";

export default function Footer() {
  const { openDonation } = useDonation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#040912] border-t border-gold/20 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gold/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Primary Bottom Give CTA Banner */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-16 pb-14 text-center">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-14 bg-gradient-to-b from-[#0b1626]/90 to-[#060c16]/95 border border-gold/30 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative z-10 max-w-[760px] mx-auto flex flex-col items-center">
            <span className="text-gold tracking-[3px] text-xs sm:text-sm font-bold uppercase block mb-3 heading-font">
              PARTNER WITH US TODAY
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cinzel text-white tracking-wide leading-tight uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              JOIN HANDS TO BUILD THE ARK OF HOPE
            </h2>

            <p className="text-text-muted text-sm sm:text-base md:text-lg leading-relaxed mt-4 mb-8 font-light max-w-[640px]">
              Every contribution—large or small—lays a vital plank in this historic vision of faith, family, and hope in Nepal. Be a part of the story without having to scroll back.
            </p>

            {/* Prominent Give Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[420px]">
              <button
                onClick={() => openDonation()}
                className="w-full sm:w-auto flex-1 bg-gold text-[#08111b] font-bold py-4 px-8 rounded-xl tracking-[2px] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_10px_35px_rgba(212,175,55,0.35)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.6)] active:scale-95 heading-font text-base uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>GIVE NOW</span>
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>

            {/* Quick Bank Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-gold/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Sanima Bank (SWIFT: <strong className="text-gold font-mono">SNMANPKA</strong>)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-gold/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Nepal SBI Bank (SWIFT: <strong className="text-gold font-mono">NSBINPKA</strong>)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-gold/15">
                Wise &amp; Remitly Supported
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-4 pb-12 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-xl font-bold tracking-widest heading-font drop-shadow-[0_0_8px_rgba(201,148,58,0.3)] no-underline group"
            >
              <Image
                src="/logo.png"
                alt="Ark of Hope Project Logo"
                width={44}
                height={44}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-gold/50 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="flex items-center gap-1.5">
                <span className="text-white">ARK OF HOPE</span>
                <span className="text-gold">PROJECT</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-[380px]">
              A monumental faith initiative in Chitwan, Nepal—creating a life-sized experience of God&apos;s love, family restoration, and living hope for generations to come.
            </p>
            <div className="text-xs text-text-muted font-mono">
              Proposed Site: 27°36&apos;03.2&quot;N 84°30&apos;42.9&quot;E • Nepal
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-[2px] text-gold heading-font">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#home"
                  className="text-text-muted hover:text-gold transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#the-story"
                  className="text-text-muted hover:text-gold transition-colors"
                >
                  The Story
                </Link>
              </li>
              <li>
                <Link
                  href="#our-mission"
                  className="text-text-muted hover:text-gold transition-colors"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="#story"
                  className="text-text-muted hover:text-gold transition-colors"
                >
                  Progress Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-text-muted hover:text-gold transition-colors"
                >
                  Contact &amp; Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Giving Fast Access */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-[2px] text-gold heading-font">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <span className="text-gold font-cinzel text-xs uppercase font-semibold">WhatsApp:</span>
                <a
                  href="https://wa.me/9779847376096"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gold transition-colors"
                >
                  +977 9847376096
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold font-cinzel text-xs uppercase font-semibold">Office:</span>
                <a
                  href="tel:015424883"
                  className="text-white hover:text-gold transition-colors"
                >
                  015424883
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold font-cinzel text-xs uppercase font-semibold">Email:</span>
                <a
                  href="mailto:ark4nepal@arkofhopeproject.com"
                  className="text-white hover:text-gold transition-colors break-all lowercase"
                >
                  ark4nepal@arkofhopeproject.com
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => openDonation()}
                  className="px-4 py-2 bg-gold/15 hover:bg-gold text-gold hover:text-navy text-xs font-bold uppercase rounded-lg border border-gold/40 transition-all duration-300 heading-font tracking-wider"
                >
                  Open Bank Transfer Details
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back To Top */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} The Ark of Hope Project. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-text-muted hover:text-gold transition-colors group cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <svg
              className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
