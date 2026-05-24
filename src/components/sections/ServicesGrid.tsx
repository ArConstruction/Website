import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ServiceCard from "./ServiceCard";
import { services } from "@/lib/data";

export default function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <section className="relative bg-ink-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Comprehensive Construction Services"
            intro="From ground-up builds to detailed restorations, AR Construction delivers a full spectrum of trades under one trusted, accountable team."
          />
          <Reveal className="hidden lg:block">
            <Button href="/services" variant="outline">
              All Services
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => (
            <Reveal key={service.slug} delay={i % 3}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 lg:hidden">
          <Button href="/services" variant="outline">
            All Services
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
