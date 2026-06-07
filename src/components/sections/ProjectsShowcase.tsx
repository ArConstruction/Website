import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { projects, type Project } from "@/lib/data";

function ProjectTile({ project }: { project: Project }) {
  return (
    <div className="group relative h-full overflow-hidden border border-white/10">
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-7 transition-transform duration-500 group-hover:translate-y-0">
        <span className="eyebrow text-gold">{project.category}</span>
        <h3 className="mt-2 font-display text-2xl font-semibold text-white">
          {project.title}
        </h3>
      </div>
    </div>
  );
}

export default function ProjectsShowcase() {
  const featured = projects.slice(0, 4);
  return (
    <section className="bg-ink-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title="Projects Built to Last"
            intro="A glimpse of the office, retail, commercial and residential spaces we've brought to life across the GTA."
          />
          <Reveal className="hidden lg:block">
            <Button href="/projects" variant="outline">
              View Portfolio
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[280px] gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[300px]">
          <Reveal className="sm:col-span-1 lg:col-span-2 lg:row-span-2">
            <ProjectTile project={featured[0]} />
          </Reveal>
          <Reveal delay={1} className="lg:col-span-2">
            <ProjectTile project={featured[1]} />
          </Reveal>
          <Reveal delay={2}>
            <ProjectTile project={featured[2]} />
          </Reveal>
          <Reveal delay={3}>
            <ProjectTile project={featured[3]} />
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:hidden">
          <Button href="/projects" variant="outline">
            View Portfolio
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
