"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MaintenancePage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#050c16] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
            {/* Ambient Background Lights & Shimmer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/15 via-sky-900/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

            {/* Floating Gold Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {mounted && [...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        className="atmospheric-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            animationDuration: `${Math.random() * 10 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random() * 0.35 + 0.1,
                            background: '#D4AF37'
                        }}
                    />
                ))}
            </div>

            {/* Top Navigation / Brand Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20">
                        <div className="w-full h-full bg-[#071220] rounded-xl flex items-center justify-center text-gold font-heading font-bold text-lg">
                            A
                        </div>
                    </div>
                    <div>
                        <span className="font-heading tracking-[3px] text-sm font-bold text-white block">ARK OF HOPE</span>
                        <span className="text-[10px] text-gold tracking-[2px] uppercase font-semibold">Chitwan, Nepal</span>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>System Under Scheduled Maintenance</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center flex-1 flex flex-col items-center justify-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-[2px] uppercase font-semibold mb-8 backdrop-blur-md animate-pulse">
                    <span>🕊️ Preparing for the Grand Vision</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-heading mb-6 leading-[1.1]">
                    <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                        THE ARK IS BEING
                    </span>
                    <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(212,175,55,0.4)]">
                        PREPARED & BUILT
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/75 font-serif italic mb-10 leading-relaxed">
                    "Every great journey begins with a single plank. We are currently performing scheduled maintenance and preparing the Ark of Hope portal for an elevated experience."
                </p>

                {/* Progress Indicators / Preparation Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mb-12">
                    <div className="bg-[#0a1828]/60 border border-white/10 backdrop-blur-md p-4 rounded-xl text-center">
                        <div className="text-xl mb-1">🪨</div>
                        <div className="text-gold font-heading font-bold text-xs uppercase tracking-wider">Foundation</div>
                        <div className="text-[11px] text-white/50 mt-1">Groundwork Set</div>
                    </div>
                    <div className="bg-[#0a1828]/60 border border-white/10 backdrop-blur-md p-4 rounded-xl text-center">
                        <div className="text-xl mb-1">🪵</div>
                        <div className="text-gold font-heading font-bold text-xs uppercase tracking-wider">Timber</div>
                        <div className="text-[11px] text-white/50 mt-1">Framing Future</div>
                    </div>
                    <div className="bg-[#0a1828]/60 border border-white/10 backdrop-blur-md p-4 rounded-xl text-center">
                        <div className="text-xl mb-1">🛖</div>
                        <div className="text-gold font-heading font-bold text-xs uppercase tracking-wider">Deck</div>
                        <div className="text-[11px] text-white/50 mt-1">Platform Ready</div>
                    </div>
                    <div className="bg-[#0a1828]/60 border border-white/10 backdrop-blur-md p-4 rounded-xl text-center">
                        <div className="text-xl mb-1">🕊️</div>
                        <div className="text-gold font-heading font-bold text-xs uppercase tracking-wider">Covenant</div>
                        <div className="text-[11px] text-white/50 mt-1">Eternal Hope</div>
                    </div>
                </div>

                {/* Notification Form */}
                <div className="w-full max-w-md">
                    {!submitted ? (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email for launch updates..."
                                required
                                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold/60 transition-colors backdrop-blur-sm"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#071220] font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-500/25 active:scale-95 whitespace-nowrap"
                            >
                                Notify Me
                            </button>
                        </form>
                    ) : (
                        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-6 py-4 rounded-xl text-sm flex items-center justify-center gap-2">
                            <span>✓</span>
                            <span>Thank you! We will notify you as soon as the portal is live.</span>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer with subtle admin access */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
                <div>
                    © {new Date().getFullYear()} Ark of Hope Project (Revival Zahaz). Shanti Foundation Trust.
                </div>
                <div className="flex items-center gap-6">
                    <span>Chitwan, Nepal</span>
                    <span>ark4nepal@arkofhopeproject.com</span>
                    <Link
                        href="/admin/login"
                        className="text-white/30 hover:text-amber-400 transition-colors underline underline-offset-4"
                    >
                        Admin Portal
                    </Link>
                </div>
            </footer>
        </div>
    );
}
