import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import { stats } from "@/lib/data";

export default function StatsBar() {
  return (
    <section className="border-b border-white/10 bg-ink-800 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i}
            className="flex flex-col items-center border-white/10 text-center lg:border-l lg:first:border-l-0"
          >
            <span className="font-display text-5xl font-bold text-gold sm:text-6xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="mt-3 text-sm uppercase tracking-[0.18em] text-white/60">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
