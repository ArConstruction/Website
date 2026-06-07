import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const highlights = [
  "Innovative, professional construction & renovation",
  "Licensed, insured and fully code-compliant",
  "Commercial and residential expertise under one roof",
  "On-time, on-budget delivery on every project",
];

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Images */}
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/polished-concrete-hall.jpg"
              alt="Polished concrete floor in a large convention hall by AR Construction"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 hidden aspect-square w-48 overflow-hidden border-4 border-ink sm:block lg:-right-8 lg:w-60">
            <Image
              src="/images/floor-grinding-detail.jpg"
              alt="Diamond floor grinding equipment preparing a concrete slab"
              fill
              className="object-cover"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -left-4 top-8 flex flex-col items-center bg-gold px-6 py-5 text-center text-ink shadow-2xl lg:-left-8">
            <span className="font-display text-4xl font-bold leading-none">25+</span>
            <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.15em]">
              Years
            </span>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <SectionHeading
            eyebrow="Who We Are"
            title="A Leader in Construction & Renovation"
            intro="With over 25 years of experience, AR Construction has established itself as a leader in providing innovative and professional construction and renovation services across the Greater Toronto Area."
          />

          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {highlights.map((item, i) => (
              <Reveal as="li" key={item} delay={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-sm leading-relaxed text-white/75">{item}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={2} className="mt-10">
            <Button href="/about" variant="gold">
              More About Us
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
