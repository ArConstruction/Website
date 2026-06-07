import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceCard from "@/components/sections/ServiceCard";
import Process from "@/components/sections/Process";
import CTABanner from "@/components/sections/CTABanner";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Drywalling & painting, epoxy and carpet flooring, plumbing, electrical, waterproofing, masonry, fences & decks, demolition, mold abatement and asbestos restoration.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Everything You Need to Build & Renovate"
        intro="One accountable team for the full scope of your project, from demolition and structure to the finest finishes."
        image="/images/polished-concrete-floor.jpg"
        crumbs={[{ label: "Services" }]}
      />

      {/* Full services grid */}
      <section className="bg-ink pt-14 pb-24 sm:pt-20 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="Our Full Range of Services"
            intro="Every discipline you need, delivered by skilled, licensed tradespeople under one roof."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i % 3}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Process />
      <CTABanner />
    </>
  );
}
