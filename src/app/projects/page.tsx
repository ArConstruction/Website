import Image from "next/image";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CTABanner from "@/components/sections/CTABanner";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A portfolio of office, retail, commercial and residential construction and renovation projects across the Greater Toronto Area.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Portfolio"
        title="Work We're Proud Of"
        intro="Office, retail, commercial and residential projects delivered with precision across the GTA."
        image="/images/epoxy-application.jpg"
        crumbs={[{ label: "Projects" }]}
      />

      <section className="bg-ink py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Selected Work"
            title="A Portfolio Built on Quality"
            intro="Every project reflects our commitment to craftsmanship, safety and on-time delivery."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal
                key={project.title}
                delay={i % 3}
                className={project.size === "wide" ? "sm:col-span-2" : ""}
              >
                <div className="group relative aspect-[4/3] overflow-hidden border border-white/10">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <span className="eyebrow text-gold">{project.category}</span>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">{project.location}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
