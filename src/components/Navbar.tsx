"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { company, navLinks } from "@/lib/data";

function Logo({ scrolled }: { scrolled: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={company.name}>
      <span className="flex h-10 w-10 items-center justify-center bg-gold font-display text-lg font-bold text-ink transition-transform duration-300 group-hover:rotate-3">
        AR
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-bold tracking-wide transition-colors ${
            scrolled ? "text-white" : "text-white"
          }`}
        >
          AR CONSTRUCTION
        </span>
        <span className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
          Build · Renovate · Restore
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-ink/85 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo scrolled={scrolled} />

        {/* Desktop links */}
        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`link-underline font-display text-sm font-medium uppercase tracking-wider transition-colors ${
                  active ? "text-gold" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={company.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-gold"
          >
            <Phone className="h-4 w-4 text-gold" />
            {company.phone}
          </a>
          <Link
            href="/contact"
            className="bg-gold px-6 py-3 font-display text-sm font-medium uppercase tracking-wider text-ink transition-all duration-300 hover:bg-gold-light"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-6">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`border-b border-white/5 py-4 font-display text-lg uppercase tracking-wider ${
                      active ? "text-gold" : "text-white/85"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={company.phoneHref}
                onClick={closeMenu}
                className="mt-4 flex items-center gap-2 text-white/80"
              >
                <Phone className="h-4 w-4 text-gold" />
                {company.phone}
              </a>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="mt-4 bg-gold px-6 py-4 text-center font-display text-sm font-medium uppercase tracking-wider text-ink"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
