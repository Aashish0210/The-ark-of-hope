"use client";

import React, { useState, useEffect } from 'react';
import { useDonation } from './DonationProvider';

export default function ExitIntentOverlay() {
    const { openDonation } = useDonation();
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        // Check if we've already shown it this session
        const sessionShown = sessionStorage.getItem('exit_intent_shown');
        if (sessionShown) {
            setHasTriggered(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggered) {
                setIsVisible(true);
                setHasTriggered(true);
                sessionStorage.setItem('exit_intent_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasTriggered]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
            <div className="relative bg-navy-light border border-gold/30 rounded-2xl w-full max-w-[520px] overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>

                <div className="relative z-10 p-8 pt-10 text-center">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 heading-font tracking-wide">
                        THANK YOU FOR VISITING
                    </h2>

                    <p className="text-base sm:text-lg text-white/85 mb-8 leading-relaxed font-light">
                        Your time at <span className="text-gold font-medium">The Ark of Hope</span> is a gift. Whether you support through prayer, encouragement, or partnership, we are deeply grateful. God bless.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => {
                                openDonation();
                                setIsVisible(false);
                            }}
                            className="w-full sm:w-auto flex-1 bg-gold text-navy font-black py-4 px-8 rounded-xl tracking-[1.5px] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.3)] active:scale-95 heading-font text-sm uppercase"
                        >
                            Partner With Us
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-200 text-xs tracking-wider uppercase heading-font font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
