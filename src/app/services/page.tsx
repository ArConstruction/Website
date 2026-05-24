import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceCard from "@/components/sections/ServiceCard";
import Process from "@/components/sections/Process";
import CTABanner from "@/components/sections/CTABanner";
import { services, sectors } from "@/lib/data";

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
        intro="One accountable team for the full scope of your project — from demolition and structure to the finest finishes."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Services" }]}
      />

      {/* Sectors */}
      <section className="border-b border-white/10 bg-ink-800 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Who We Serve"
            title="Constructing & Redesigning Every Space"
            intro="Office buildings, retail spaces, commercial and residential properties — built and reimagined to the highest standard."
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, i) => {
              const Icon = sector.icon;
              return (
                <Reveal
                  key={sector.title}
                  delay={i}
                  className="group bg-ink p-8 transition-colors duration-500 hover:bg-ink-700"
                >
                  <Icon className="h-9 w-9 text-gold transition-transform duration-500 group-hover:-translate-y-1" />
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">
                    {sector.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {sector.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full services grid */}
      <section className="bg-ink py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="Our Full Range of Services"
            intro="Ten core disciplines, delivered by skilled, licensed tradespeople under one roof."
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
