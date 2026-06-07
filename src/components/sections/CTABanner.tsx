import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { company } from "@/lib/data";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/facility-exterior-dusk.jpg"
          alt="Renovated commercial facility exterior at dusk"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink to-ink/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <span className="eyebrow text-gold">Let&apos;s Build Together</span>
          <h2 className="font-display mt-5 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Have a project in mind? <span className="text-gold">Let&apos;s make it real.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/65">
            From the first sketch to the final handover, our team delivers
            construction and renovation you can trust. Get a free, no-obligation
            consultation today.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-gold px-8 py-4 font-display text-sm font-medium uppercase tracking-wider text-ink transition-all duration-300 hover:bg-gold-light"
            >
              Get Your Free Quote
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href={company.phoneHref}
              className="group inline-flex items-center justify-center gap-2 border border-white/30 px-8 py-4 font-display text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <Phone className="h-4 w-4" />
              {company.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
