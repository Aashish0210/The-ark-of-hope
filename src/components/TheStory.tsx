"use client";

export function TheStoryPart1() {

  return (
    <section
      id="the-story"
      className="pt-28 pb-20 bg-navy relative border-t border-white/5 scroll-mt-20"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="text-center mb-8">
          <span className="text-gold tracking-[2px] text-xs md:text-sm font-semibold uppercase block mb-3 heading-font">
            Our Story
          </span>
          <h2 className="text-[2.2rem] md:text-[2.8rem] leading-[1.2] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-cinzel text-white">
            The Story Behind the Vision
          </h2>
        </header>

        <article className="prose prose-invert max-w-none text-text-muted text-[17px] md:text-[19px] leading-[1.8] tracking-wide font-sans text-center mx-auto max-w-[850px]">
          {/* First Section (Always Visible) */}
          <p className="text-white font-medium text-lg md:text-xl mb-3">
            The Ark of Hope Project began with a simple question:
          </p>

          <p className="text-gold font-semibold text-xl md:text-2xl font-cinzel tracking-wider leading-snug mb-6">
            &ldquo;How can we create something in Nepal that causes people to stop, think, ask deeper questions, and encounter a message of hope?&rdquo;
          </p>

          <p>
            For the project&apos;s founder, that question grew out of a lifetime shaped by both loss and purpose. Born in the Terai-Madhesh region of Nepal, he lost his father as a young child and later lost an older brother while studying law in Kathmandu. Those experiences caused him to think deeply about the brevity of life and what it means to use the life we have been given for something that matters.
          </p>

          <div className="space-y-6 pt-2 text-text-muted">
            <p>
              Years later, during the uncertainty and loss of the COVID-19 pandemic, that desire took on a new urgency. He began praying about how people throughout Nepal and beyond could encounter the message of God&apos;s love and hope—not only through words, but through an experience that could capture the imagination of children, families, and visitors from around the world.
            </p>

            <p className="text-gold font-semibold text-lg md:text-xl font-cinzel tracking-wider">
              Toward the end of 2020, the vision for the Ark of Hope Project began to take shape.
            </p>

            <p>
              The dream is to create a landmark destination in Nepal centered around a half-scale representation of Noah&apos;s Ark—a place where biblical history, education, culture, family experiences, hospitality, and meaningful reflection come together.
            </p>

            <p>
              The story of a great flood and an ark is not found only in one place or one culture. Across the world, many peoples and traditions preserve stories of a great flood, a vessel of rescue, and a family or community delivered from destruction. These shared memories create a meaningful point of connection between cultures and invite people from different backgrounds to gather around the biblical account of Noah&apos;s Ark.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function TheStoryPart2() {
  return (
    <section id="our-mission" className="py-24 bg-navy relative border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="text-center mb-4">
          <h2 className="text-[2.5rem] leading-[1.2] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-cinzel">
            The Mission
          </h2>
        </header>
        <article className="prose prose-invert max-w-none text-text-muted text-[18px] md:text-[20px] leading-[1.8] tracking-wide font-sans text-center [&>p]:mb-4 [&>div]:mt-8 mx-auto max-w-[800px]">
          {/* <p className="text-gold font-semibold text-2xl text-center font-cinzel tracking-wider leading-snug">
            The Ark of Hope Project is being created around that shared human story.
          </p> */}

          {/* <p>
            Our vision is to build more than an attraction. We want to create a
            place where people from different cultures, religions, nations, and
            backgrounds can come together around one of the most ancient and
            universal narratives in human history. In a world often divided by
            language, belief, ethnicity, and social barriers, the Ark of Hope Project
            will stand as a powerful symbol of unity, remembrance, and hope.
          </p> */}

          <p className="text-gold font-semibold text-xl md:text-2xl font-cinzel tracking-wider leading-snug">
            The vision is bigger than the Ark itself.
          </p>

          <p>
            It is about creating a place where children can learn, families can experience something meaningful together, visitors can explore one of the world&apos;s most enduring stories, and people from many nations, cultures, and backgrounds can discover the hope found in the God who saves and delivers. As people recognize echoes of a story preserved in their own cultures, we pray that curiosity will become hunger—a desire not only to learn about the biblical account, but to encounter the God behind it for themselves.
          </p>

          <p>
            The project also seeks to create a place where local communities can benefit from new opportunities, and where people from around the world can come together in a spirit of welcome, reflection, and shared discovery.
          </p>

          <p>
            Building something of this scale will require far more than one person&apos;s vision. It will take people who believe in what it can become—people willing to bring their prayers, expertise, relationships, resources, and support.
          </p>

          <p className="text-white font-semibold text-lg md:text-xl font-cinzel tracking-wider">
            The Ark of Hope began as one man&apos;s vision, but it will take many people to make it a reality.
          </p>

          <p className="text-gold font-medium italic">
            We invite you to become part of the story—and help build a place of hope in Nepal where people from many cultures can encounter the biblical story of the Ark, be stirred to seek the God who saves and delivers, and help build a legacy that can serve generations to come.
          </p>

          {/* <p>
            Visitors will step into an immersive experience centered on the{" "}
            <span className="text-gold font-semibold">
              biblical account of Noah’s Ark
            </span>
            , presented with excellence, creativity, and reverence. Through
            exhibits, storytelling, architecture, cultural history, and
            interactive experiences, guests will encounter the story of the
            flood, the ark, judgment, mercy, preservation, and new beginnings.
          </p> */}
        </article>
      </div>
    </section>
  );
}

export function TheStoryPart3() {
  // return (
    // <section className="py-24 bg-navy relative border-t border-white/5">
    //   <div className="max-w-[1200px] mx-auto px-6">
    //     <article className="prose prose-invert max-w-none text-text-muted text-[18px] md:text-[20px] leading-[1.8] tracking-wide font-sans text-center [&>p]:mb-4 [&>div]:mt-8 mx-auto max-w-[800px]">
    //       <p className="text-gold font-semibold text-2xl text-center font-cinzel tracking-wider leading-snug">
    //         But the heart of the project reaches even further.
    //       </p>

    //       <p>
    //         The Ark of Hope Project is designed to be a bridge. It will invite people
    //         who may come from very different traditions to discover a story that
    //         speaks across generations and cultures. It will welcome families,
    //         students, tourists, spiritual seekers, historians, educators, and
    //         people of faith. It will create a place where conversation can
    //         happen, where curiosity can grow, and where people can reflect on
    //         the deeper questions of life: What does it mean to be saved? What
    //         does it mean to begin again? What hope remains when the world feels
    //         broken?
    //       </p>

    //       <p>
    //         Located in Nepal, a nation already known as a meeting place of
    //         cultures, mountains, pilgrims, and travelers, the Ark of Hope Project has
    //         the opportunity to become a landmark destination. It can bless the
    //         local economy, create jobs, strengthen tourism, support education,
    //         and provide a meaningful experience for both local and international
    //         visitors.
    //       </p>

    //       <p>
    //         Your contribution is not simply helping build a structure. You are
    //         helping build a place of encounter. A place where ancient history,
    //         biblical truth, cultural connection, and modern creativity come
    //         together. A place where people from many backgrounds can walk
    //         through the same doors, experience the same story, and leave with a
    //         renewed sense of wonder, reflection, and hope.
    //       </p>

    //       <p>
    //         The Ark of Hope Project is a call to remember that humanity’s story is
    //         connected. It is a call to build something that outlasts us. It is a
    //         call to create a destination that speaks to the heart of the world.
    //       </p>
    //     </article>
    //   </div>
    // </section>
  // );
}

export function TheStoryPart4() {
  return (
    <section id="project-sites" className="py-24 bg-navy relative border-t border-white/5 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Project Sites Section */}
        <div className="max-w-[1000px] mx-auto">
          <header className="text-center mb-8">
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

          <div className="relative rounded-2xl overflow-hidden border border-gold/30 bg-black/40 shadow-[0_10px_40px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            {/* Top Bar with coordinates and Direct Redirect Button */}
            <div className="p-4 md:p-5 bg-navy-light/80 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                <div className="text-center sm:text-left">
                  <p className="text-white font-bold text-sm md:text-base heading-font tracking-wider">
                    Proposed Ark Site
                  </p>
                  <p className="text-text-muted text-xs font-mono">
                    27°36&apos;03.2&quot;N 84°30&apos;42.9&quot;E • Nepal
                  </p>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/8D1KeG7BXZvpqnuX6?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-bold rounded-xl text-xs md:text-sm tracking-wider uppercase hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.3)] active:scale-95 heading-font"
              >
                <span>Open in Google Maps</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            {/* Map Iframe */}
            <div className="relative w-full h-[380px] md:h-[460px] bg-navy">
              <iframe
                title="Project Site - Google Maps"
                src="https://maps.google.com/maps?q=27.6008929,84.5119080&hl=en&z=15&output=embed"
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Bottom info bar */}
            <div className="p-3 md:p-4 bg-navy-light/60 border-t border-white/5 flex items-center justify-center sm:justify-end text-xs text-text-muted">
              <a
                href="https://maps.app.goo.gl/8D1KeG7BXZvpqnuX6?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline hover:text-white transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>View Full Map on Google</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function TheStory() {
  return (
    <>
      <TheStoryPart1 />
      <TheStoryPart2 />
      <TheStoryPart3 />
      <TheStoryPart4 />
    </>
  );
}
