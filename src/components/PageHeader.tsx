import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  image: string;
  crumbs?: Crumb[];
};

export default function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  crumbs = [],
}: PageHeaderProps) {
  return (
    <section className="relative flex min-h-[42vh] items-end overflow-hidden bg-ink pt-28">
      <div className="absolute inset-0">
        <Image src={image} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/50" />
        <div className="noise absolute inset-0 opacity-50" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 sm:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 text-gold" />
              {c.href ? (
                <Link href={c.href} className="transition-colors hover:text-gold">
                  {c.label}
                </Link>
              ) : (
                <span className="text-gold">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {eyebrow && (
          <span className="eyebrow mt-6 flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" />
            {eyebrow}
          </span>
        )}
        <h1 className="font-display mt-4 max-w-4xl text-4xl font-bold uppercase leading-[1] text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{intro}</p>
        )}
      </div>
    </section>
  );
}
