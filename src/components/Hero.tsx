"use client";

import { useState, useEffect } from 'react';
import { useDonation } from './DonationProvider';

interface HeroProps {
    subtitle: string;
    title: string;
    text: string;
}

export default function Hero({ subtitle, title, text }: HeroProps) {
    const { openDonation } = useDonation();
    const [mounted, setMounted] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [donated, setDonated] = useState(false);

    const images = [
        "/hero-1.png", // Realistic Construction
        "/hero-2.png", // Realistic Interior
        "/hero-3.png", // Realistic Sunset
        "/ark-bg.jpg"  // Original Realistic
    ];

    useEffect(() => {
        setMounted(true);

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 10000); // Slower interval for grounded realistic feel

        return () => clearInterval(timer);
    }, [images.length]);

    const handleSuccess = (paymentData: any) => {
        console.log("Hero donation success", paymentData);
        setDonated(true);
    };

    let mainTitle = title;
    let spanTitle = '';

    if (title.includes('\n')) {
        const parts = title.split('\n');
        mainTitle = parts[0].trim();
        spanTitle = parts.slice(1).join(' ').trim();
    } else {
        const match = title.match(/^(.*?)\s+(Project)$/i);
        if (match) {
            mainTitle = match[1];
            spanTitle = match[2];
        } else {
            const lastSpace = title.lastIndexOf(' ');
            if (lastSpace !== -1) {
                mainTitle = title.slice(0, lastSpace);
                spanTitle = title.slice(lastSpace + 1);
            }
        }
    }

    return (
        <header id="home" className="relative min-h-screen flex items-center justify-center text-center pt-6 sm:pt-10 md:pt-20 overflow-hidden bg-[#050c16]">
            {/* Photorealistic Slideshow Background */}
            {mounted && images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 z-0 transition-opacity duration-[4000ms] ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom, rgba(5, 12, 22, 0.95) 0%, rgba(5, 12, 22, 0.7) 40%, rgba(5, 12, 22, 0.7) 60%, #071220 100%), url("${img}") center/cover no-repeat`,
                            backgroundAttachment: 'fixed'
                        }}
                    ></div>
                </div>
            ))}

            <div className="relative z-10 max-w-[1000px] px-6">

                <h1 className="font-bold mb-3">
                    <span className="block text-[2.75rem] sm:text-[4.5rem] md:text-[5.8rem] lg:text-[6.6rem] leading-[1.08] tracking-tight sm:tracking-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                        {mainTitle}
                    </span>
                    {spanTitle && (
                        <div className="w-[320px] max-w-full mx-auto mt-2 sm:mt-3">
                            <span className="block font-body font-sans text-[44px] sm:text-[52px] md:text-[60px] text-gold tracking-[0.12em] pl-[0.12em] font-bold leading-none drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)] text-center whitespace-nowrap">
                                {spanTitle}
                            </span>
                        </div>
                    )}
                </h1>

                {!donated ? (
                    <>
                        <div className="w-[320px] max-w-full mx-auto mb-8">
                            <p className="text-white text-[28px] font-medium font-serif italic drop-shadow-[0_4px_12px_rgba(0,0,0,1)] text-center whitespace-nowrap">
                                {subtitle}
                            </p>
                        </div>
                        <div className="w-[320px] max-w-full mx-auto">
                            <button
                                onClick={() => openDonation()}
                                className="w-full bg-gold text-navy font-bold py-5 rounded-xl tracking-[2px] hover:bg-white hover:-translate-y-1 transition-all duration-400 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] active:scale-95 heading-font px-8 text-lg"
                            >
                                GIVE NOW
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-6">
                        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h2 className="text-4xl font-bold text-gold mb-2 heading-font drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">THANK YOU</h2>
                        <p className="text-[16px] text-white font-medium tracking-wide">YOUR STORY OF FAITH HAS BEEN RECORDED</p>
                    </div>
                )}
            </div>
        </header>
    );
}