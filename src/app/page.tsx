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
import MaintenancePage from "@/components/MaintenancePage";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function Home() {
  let rawSettings = null;
  try {
    rawSettings = await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error("Failed to fetch settings from database:", error);
  }

  const settings = rawSettings || {
    raised: 0,
    goal: 7000000,
    heroTitle: "Ark of Hope Project",
    heroSubtitle: "A story of faith in Nepal",
    heroText:
      "Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.",
    maintenanceMode: false,
  };

  // Maintenance mode handling:
  // Directly controlled by Admin dashboard setting (settings.maintenanceMode), or by FORCE_MAINTENANCE env flag.
  const isForceMaintenance = process.env.FORCE_MAINTENANCE === 'true';
  const isMaintenanceModeActive = Boolean(settings?.maintenanceMode);

  const shouldShowMaintenance = isForceMaintenance || isMaintenanceModeActive;

  if (shouldShowMaintenance) {
    return <MaintenancePage />;
  }

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
