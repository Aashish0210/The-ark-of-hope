import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import {
  TheStoryPart1,
  TheStoryPart2,
  TheStoryPart3,
} from "@/components/TheStory";
import CardGallery from "@/components/CardGallery";
import ProgressTracker from "@/components/ProgressTracker";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Disable static rendering to always show fresh data

export default async function Home() {
  let rawSettings = null;
  try {
    const results = await Promise.all([
      prisma.siteSettings.findFirst(),
    ]);
    rawSettings = results[0];
  } catch (error) {
    console.error("Failed to fetch from database:", error);
  }

  const settings = rawSettings || {
    raised: 0,
    goal: 7000000,
    heroTitle: "Ark of Hope Project",
    heroSubtitle: "A story of faith in Nepal",
    heroText:
      "Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.",
  };

  return (
    <main>
      <Navbar />
      <Hero
        subtitle={settings.heroSubtitle}
        title={settings.heroTitle}
        text={settings.heroText}
      />
      <TheStoryPart1 />
      <CardGallery />
      <TheStoryPart2 />
      <ProgressTracker raised={settings.raised} goal={settings.goal} />
      <TheStoryPart3 />
      <Contact />
      <Footer />
    </main>
  );
}
