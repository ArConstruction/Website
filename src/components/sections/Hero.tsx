"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Phone, Star } from "lucide-react";
import { company } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

const slides = [
  { src: "/images/slider-1.jpg",  alt: "AR Construction project site" },
  { src: "/images/slider-2.avif", alt: "AR Construction commercial build" },
  { src: "/images/slider-3.jpg",  alt: "AR Construction self-storage facility" },
  { src: "/images/slider-4.webp", alt: "AR Construction concrete leveling" },
  { src: "/images/slider-5.jpg",  alt: "AR Construction Oakville project" },
  { src: "/images/slider-6.jpg",  alt: "AR Construction interior renovation" },
  { src: "/images/slider-7.webp", alt: "AR Construction BMO Field construction" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      {/* Sliding background images */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={slides[current].src}
              alt={slides[current].alt}
              fill
              priority={current === 0}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <div className="noise absolute inset-0 opacity-60" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-20 sm:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-gold">
              25 Years of Excellence in Construction in GTA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 text-5xl font-bold uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Superior
            <br />
            Construction &amp;
            <br />
            <span className="text-gold">Renovation</span> Excellence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/70"
          >
            We believe that the spaces where we work, either constructing a
            sleek corporate office, remodeling a retail space, or building a
            residential property, our mission remains the same: to deliver
            exceptional craftsmanship that enhances lives today and lasts for
            decades to come.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-gold px-8 py-4 font-display text-sm font-medium uppercase tracking-wider text-ink transition-all duration-300 hover:bg-gold-light hover:shadow-[0_18px_50px_-15px_rgba(244,180,0,0.6)]"
            >
              Start Your Project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href={company.phoneHref}
              className="group inline-flex items-center justify-center gap-2 border border-white/25 px-8 py-4 font-display text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <Phone className="h-4 w-4" />
              {company.phone}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm text-white/60">
              Trusted by clients across the Greater Toronto Area
            </p>
          </motion.div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-10 right-8 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-gold" : "w-1.5 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <span className="h-12 w-px bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
