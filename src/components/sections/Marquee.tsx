const items = [
  "Office Buildings",
  "Retail Spaces",
  "Commercial Properties",
  "Residential Builds",
  "Renovations",
  "Restorations",
  "Design & Build",
];

export default function Marquee() {
  return (
    <div className="marquee-pause overflow-hidden border-y border-white/10 bg-gold py-5">
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-8 font-display text-lg font-medium uppercase tracking-wider text-ink">
              {item}
            </span>
            <span className="text-ink/40">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
