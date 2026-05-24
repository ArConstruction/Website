import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "outline" | "ghost";
  className?: string;
  withArrow?: boolean;
};

const base =
  "group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium uppercase tracking-wider font-display transition-all duration-300";

const styles = {
  gold: "bg-gold text-ink hover:bg-gold-light hover:shadow-[0_18px_50px_-15px_rgba(244,180,0,0.6)]",
  outline:
    "border border-white/25 text-white hover:border-gold hover:text-gold",
  ghost: "text-white hover:text-gold",
};

export default function Button({
  href,
  children,
  variant = "gold",
  className = "",
  withArrow = true,
}: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
      {withArrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </Link>
  );
}
