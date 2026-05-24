import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data";

export default function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href="/services"
      className="group relative flex flex-col overflow-hidden border border-white/10 bg-ink-700 transition-colors duration-500 hover:border-gold/50"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-700 via-ink/40 to-transparent" />
        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center bg-gold text-ink transition-transform duration-500 group-hover:-translate-y-1">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-gold">
          {service.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
          {service.blurb}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold">
          Learn More
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
