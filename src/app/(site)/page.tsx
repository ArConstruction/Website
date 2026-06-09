import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import StatsBar from "@/components/sections/StatsBar";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesGrid from "@/components/sections/ServicesGrid";
import Process from "@/components/sections/Process";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <StatsBar />
      <AboutPreview />
      <ServicesGrid limit={6} />
      <Process />
      <ProjectsShowcase />
      <CTABanner />
    </>
  );
}
