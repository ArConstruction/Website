import Image from "next/image";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import CTABanner from "@/components/sections/CTABanner";
import { company, values, stats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: company.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="25 Years of Excellence in Construction"
        intro="A leader in innovative, professional construction and renovation across the Greater Toronto Area."
        image="/images/epoxy-team-prep.jpg"
        crumbs={[{ label: "About" }]}
      />

      {/* Story */}
      <section className="bg-ink py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/warehouse-fitout.jpg"
                alt="AR Construction commercial warehouse fit-out in progress"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden bg-gold px-8 py-6 text-ink shadow-2xl sm:block">
              <span className="font-display text-4xl font-bold leading-none">
                <Counter value={25} suffix="+" />
              </span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-[0.15em]">
                Years in Business
              </span>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Excellence, Delivered Project After Project"
              intro={company.description}
            />
            <p className="mt-6 text-base leading-relaxed text-white/60">
              {company.mission} We bring together skilled tradespeople, modern
              methods and an uncompromising standard of quality to construct and
              redesign office buildings, retail spaces, and commercial &amp;
              residential properties. From a single room to a full building, we
              treat every project with the same precision and care.
            </p>
          </div>
        </div>
      </section>

      {/* Mission band */}
      <section className="border-y border-white/10 bg-ink-800 py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="eyebrow text-gold">Our Mission</span>
            <p className="font-display mt-6 text-3xl font-medium leading-snug text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              &ldquo;Enhancing lives through superior construction and renovation
              excellence, building spaces that work harder, last longer and feel{" "}
              <span className="text-gold">extraordinary.</span>&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Core Values"
            intro="The principles behind every estimate, every site and every handover."
            align="center"
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
            {values.map((value, i) => (
              <Reveal
                key={value.title}
                delay={i}
                className="group bg-ink-800 p-9 transition-colors duration-500 hover:bg-ink-700"
              >
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {value.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 bg-ink-800 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i}
              className="flex flex-col items-center border-white/10 text-center lg:border-l lg:first:border-l-0"
            >
              <span className="font-display text-5xl font-bold text-gold sm:text-6xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-3 text-sm uppercase tracking-[0.18em] text-white/60">
                {stat.label}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
