export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-24 bg-navy relative border-t border-white/5 scroll-mt-24">
      {/* Anchor for existing project-sites links */}
      <div id="project-sites" className="-mt-24 pt-24" />

      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <header className="text-center mb-10 md:mb-12">
          <span className="text-gold tracking-[2px] text-xs md:text-sm font-semibold uppercase block mb-3 heading-font">
            Location & Grounds
          </span>
          <h2 className="text-[2.5rem] md:text-[3rem] leading-[1.2] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-cinzel text-white">
            Project Site
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-[620px] mx-auto mt-3">
            Explore the planned location and geographical setting for the Ark of Hope Project in Nepal.
          </p>
        </header>

        {/* Unified Card: Map on Left, Contact on Right */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-gold/30 bg-black/40 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          
          {/* Left Column: Interactive Map */}
          <div className="lg:col-span-7 relative w-full h-[380px] sm:h-[440px] lg:h-full min-h-[380px] lg:min-h-[560px] bg-navy">
            {/* Floating location tag in top-left like the reference image */}
            <div className="absolute top-4 left-4 z-20 bg-navy/90 backdrop-blur-md border border-gold/40 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 max-w-[90%]">
              <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white heading-font tracking-wide leading-tight">
                  Proposed Ark Site
                </p>
                <p className="text-[11px] text-text-muted font-mono leading-tight mt-0.5">
                  27°36&apos;03.2&quot;N 84°30&apos;42.9&quot;E • Nepal
                </p>
              </div>
            </div>

            {/* Google Maps iframe */}
            <iframe
              title="Project Site - Google Maps"
              src="https://maps.google.com/maps?q=27.6008929,84.5119080&hl=en&z=15&output=embed"
              width="100%"
              height="100%"
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating button in bottom-right */}
            <div className="absolute bottom-4 right-4 z-20">
              <a
                href="https://maps.app.goo.gl/8D1KeG7BXZvpqnuX6?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-navy/90 hover:bg-gold hover:text-navy text-gold text-xs font-semibold rounded-lg border border-gold/40 shadow-lg transition-all duration-300 backdrop-blur-sm heading-font uppercase tracking-wider"
              >
                <span>View Full Map</span>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Details Panel */}
          <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 bg-navy-light/95 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gold/20 backdrop-blur-md">
            <div>
              <span className="text-gold tracking-[2px] text-xs font-semibold uppercase block mb-2 heading-font">
                Get In Touch
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white tracking-wide">
                Contact Us
              </h3>
              <p className="text-text-muted text-sm sm:text-[15px] leading-relaxed mt-2 mb-6">
                Reach out to our team for questions, partnerships, or more information about the Ark of Hope Project.
              </p>

              {/* Contact Information Cards */}
              <div className="space-y-4">
                {/* Phone / Mobile */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-gold/15 hover:border-gold/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5 shadow-[0_0_12px_rgba(223,178,93,0.15)]">
                    <svg
                      width="20"
                      height="20"
                      style={{ width: "20px", height: "20px" }}
                      className="w-5 h-5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gold text-xs font-semibold uppercase tracking-wider font-cinzel block">
                      WhatsApp / Phone
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white text-[15px] sm:text-base font-medium mt-1">
                      <a
                        href="https://wa.me/9779847376096"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold transition-colors inline-flex items-center gap-1.5"
                        title="Chat on WhatsApp"
                      >
                        <span>+977 9847376096</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded font-sans tracking-wide font-normal">
                          WhatsApp
                        </span>
                      </a>
                      <span className="text-text-muted">/</span>
                      <a
                        href="tel:015424883"
                        className="hover:text-gold transition-colors"
                        title="Call Office"
                      >
                        015424883
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-gold/15 hover:border-gold/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5 shadow-[0_0_12px_rgba(223,178,93,0.15)]">
                    <svg
                      width="20"
                      height="20"
                      style={{ width: "20px", height: "20px" }}
                      className="w-5 h-5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gold text-xs font-semibold uppercase tracking-wider font-cinzel block">
                      Email Address
                    </span>
                    <a
                      href="mailto:ark4nepal@arkofhopeproject.com"
                      className="text-white hover:text-gold transition-colors text-[15px] sm:text-base font-medium mt-1 block break-all lowercase"
                    >
                      ark4nepal@arkofhopeproject.com
                    </a>
                  </div>
                </div>

                {/* Proposed Site Location */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-gold/15 hover:border-gold/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5 shadow-[0_0_12px_rgba(223,178,93,0.15)]">
                    <svg
                      width="20"
                      height="20"
                      style={{ width: "20px", height: "20px" }}
                      className="w-5 h-5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gold text-xs font-semibold uppercase tracking-wider font-cinzel block">
                      Proposed Ark Site
                    </span>
                    <p className="text-white text-sm font-medium mt-1">
                      Chitwan, Nepal
                    </p>
                    <p className="text-text-muted text-xs font-mono mt-0.5">
                      27°36&apos;03.2&quot;N 84°30&apos;42.9&quot;E
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-8">
              <a
                href="https://maps.app.goo.gl/8D1KeG7BXZvpqnuX6?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-gold text-navy font-bold rounded-xl text-xs sm:text-sm tracking-wider uppercase hover:bg-white hover:shadow-[0_4px_20px_rgba(223,178,93,0.4)] transition-all duration-300 active:scale-[0.99] heading-font flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Open in Google Maps</span>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
