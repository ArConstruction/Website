import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, ArrowUpRight } from "lucide-react";
import { company, navLinks, services } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-800">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-center">
          <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Ready to build something <span className="text-gold">exceptional?</span>
          </h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 bg-gold px-8 py-4 font-display text-sm font-medium uppercase tracking-wider text-ink transition-all duration-300 hover:bg-gold-light"
          >
            Start Your Project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-mark.png"
              alt={company.name}
              width={52}
              height={50}
              className="h-12 w-auto"
            />
            <span className="font-display text-lg font-bold tracking-wide text-white">
              AR CONSTRUCTION
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            {company.mission} Over {company.years} years of innovative, professional
            construction and renovation across the Greater Toronto Area.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="eyebrow text-gold">Explore</h3>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/65 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="eyebrow text-gold">Services</h3>
          <ul className="mt-5 space-y-3">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  href="/services"
                  className="text-sm text-white/65 transition-colors hover:text-gold"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="eyebrow text-gold">Get In Touch</h3>
          <ul className="mt-5 space-y-4 text-sm text-white/65">
            <li>
              <a
                href={company.phoneHref}
                className="flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {company.phone}
              </a>
            </li>
            <li>
              <a
                href={company.emailHref}
                className="flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {company.address.line1}
                <br />
                {company.address.line2}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {company.website}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/45 sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.2em]">
            Superior Construction &amp; Renovation Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
