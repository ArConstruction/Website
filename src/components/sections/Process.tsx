import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/data";

export default function Process() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink to-ink/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How We Work"
          title="A Proven Process, End to End"
          intro="A disciplined, transparent approach that keeps every project on time, on budget and built to the highest standard."
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <Reveal key={step.no} delay={i} className="group relative bg-ink-800 p-8 transition-colors duration-500 hover:bg-ink-700">
              <span className="font-display text-6xl font-bold text-white/10 transition-colors duration-500 group-hover:text-gold/30">
                {step.no}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {step.description}
              </p>
              <span className="mt-6 block h-0.5 w-10 bg-gold transition-all duration-500 group-hover:w-16" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
