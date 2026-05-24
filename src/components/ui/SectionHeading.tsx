import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start";
  return (
    <div className={`flex flex-col ${alignment} max-w-3xl`}>
      {eyebrow && (
        <Reveal>
          <span className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={1}>
        <h2
          className={`font-display mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.4rem] ${
            light ? "text-ink" : "text-white"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={2}>
          <p
            className={`mt-5 text-base leading-relaxed sm:text-lg ${
              light ? "text-ink/70" : "text-white/60"
            }`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
