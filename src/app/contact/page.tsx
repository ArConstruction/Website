import type { Metadata } from "next";
import { Phone, Mail, MapPin, Globe, Clock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/ui/Reveal";
import { company } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with AR Construction. Call ${company.phone} or visit us at ${company.address.line1}, ${company.address.line2}.`,
};

const details = [
  {
    icon: Phone,
    label: "Phone",
    value: company.phone,
    href: company.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: company.email,
    href: company.emailHref,
  },
  {
    icon: MapPin,
    label: "Office",
    value: `${company.address.line1}, ${company.address.line2}`,
  },
  {
    icon: Globe,
    label: "Website",
    value: company.website,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Let's Talk About Your Project"
        intro="Tell us what you're planning and we'll get back to you with a free, no-obligation consultation."
        image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="bg-ink py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Info column */}
          <div>
            <span className="eyebrow flex items-center gap-3 text-gold">
              <span className="h-px w-8 bg-gold" />
              Contact Details
            </span>
            <h2 className="font-display mt-4 text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
              We&apos;re Ready When You Are
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Reach out by phone or email, or send us the details of your project
              using the form. Our team serves clients across the Greater Toronto
              Area.
            </p>

            <div className="mt-10 space-y-px overflow-hidden border border-white/10 bg-white/10">
              {details.map((d) => {
                const Icon = d.icon;
                const content = (
                  <div className="flex items-center gap-5 bg-ink-800 p-6 transition-colors duration-300 hover:bg-ink-700">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-gold text-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-white/45">
                        {d.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">{d.value}</p>
                    </div>
                  </div>
                );
                return d.href ? (
                  <a key={d.label} href={d.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={d.label}>{content}</div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-5 border border-white/10 bg-ink-800 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-gold text-ink">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-white/45">
                  Business Hours
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Mon – Fri: 8:00 AM – 6:00 PM · Sat: By appointment
                </p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-white/10">
        <div className="relative h-[420px] w-full">
          <iframe
            title="AR Construction location map"
            src="https://www.google.com/maps?q=1180+250+Consumers+Rd+Toronto+Ontario+M2J+4V6&output=embed"
            className="h-full w-full grayscale-[0.4] invert-[0.9] hue-rotate-180 contrast-[0.9]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
