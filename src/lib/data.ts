import {
  Hammer,
  PaintRoller,
  Layers,
  Footprints,
  Wrench,
  Zap,
  Droplets,
  Fence,
  Bomb,
  ShieldCheck,
  Building2,
  Ruler,
  type LucideIcon,
} from "lucide-react";

export const company = {
  name: "AR Construction",
  tagline: "Superior Construction & Renovation Excellence",
  mission: "Enhancing Lives Through Superior Construction and Renovation Excellence.",
  years: 25,
  phone: "+1 (647) 286-6271",
  phoneHref: "tel:+16472866271",
  email: "info@arconstruction.ca",
  emailHref: "mailto:info@arconstruction.ca",
  website: "www.arconstruction.ca",
  address: {
    line1: "1180 - 250 Consumers Rd",
    line2: "Toronto, Ontario M2J 4V6",
  },
  description:
    "With over 25 years of experience, AR Construction has established itself as a leader in providing innovative and professional construction and renovation services — constructing and redesigning office buildings, retail spaces, and commercial & residential properties.",
};

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  image: string;
};

export const services: Service[] = [
  {
    slug: "redesign-spaces",
    title: "Redesign Spaces",
    blurb:
      "Full-scope reimagining of office buildings, retail and living spaces — from concept to a refined, functional finish.",
    icon: Ruler,
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "drywall-painting",
    title: "Drywalling & Painting",
    blurb:
      "Precision drywall installation, taping and premium painting that delivers flawless, durable surfaces.",
    icon: PaintRoller,
    image:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "epoxy-flooring",
    title: "Epoxy Flooring",
    blurb:
      "Seamless, high-strength epoxy systems engineered for commercial, industrial and showroom environments.",
    icon: Layers,
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "carpet-flooring",
    title: "Carpet Flooring",
    blurb:
      "Expert supply and installation of commercial and residential carpet for comfort, acoustics and style.",
    icon: Footprints,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "plumbing",
    title: "Plumbing",
    blurb:
      "Certified rough-in, fixture and system plumbing for renovations, new builds and tenant improvements.",
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "electrical",
    title: "Electrical",
    blurb:
      "Safe, code-compliant electrical installation, upgrades and lighting design for every property type.",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "waterproofing-masonry",
    title: "Waterproofing & Concrete Masonry",
    blurb:
      "Foundation waterproofing and structural concrete & masonry built to protect and last for decades.",
    icon: Droplets,
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "fences-decks",
    title: "Fences & Decks",
    blurb:
      "Custom-built fences and decks that combine craftsmanship, durability and clean architectural lines.",
    icon: Fence,
    image:
      "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "demolition",
    title: "Demolition",
    blurb:
      "Controlled interior and structural demolition executed safely, cleanly and on schedule.",
    icon: Bomb,
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "mold-asbestos",
    title: "Mold Abatement & Asbestos Restoration",
    blurb:
      "Certified mold abatement and asbestos restoration that makes spaces safe, healthy and compliant.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  },
];

export type Sector = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const sectors: Sector[] = [
  {
    title: "Office Buildings",
    description: "Workplace construction and redesign that elevates how teams operate.",
    icon: Building2,
  },
  {
    title: "Retail Spaces",
    description: "Customer-facing environments built to perform and impress.",
    icon: Layers,
  },
  {
    title: "Commercial Properties",
    description: "Large-scale commercial builds delivered to the highest standard.",
    icon: Hammer,
  },
  {
    title: "Residential Properties",
    description: "Homes and multi-unit residences crafted with precision and care.",
    icon: Ruler,
  },
];

export const stats = [
  { value: 25, suffix: "+", label: "Years of Experience" },
  { value: 850, suffix: "+", label: "Projects Completed" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
  { value: 40, suffix: "+", label: "Skilled Tradespeople" },
];

export type ProcessStep = {
  no: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    no: "01",
    title: "Consultation",
    description:
      "We listen to your vision, assess the site and define scope, timeline and budget with full transparency.",
  },
  {
    no: "02",
    title: "Design & Planning",
    description:
      "Detailed drawings, material selection and permitting — every detail engineered before we break ground.",
  },
  {
    no: "03",
    title: "Construction",
    description:
      "Our skilled trades execute with precision, safety and rigorous quality control at every stage.",
  },
  {
    no: "04",
    title: "Handover",
    description:
      "A meticulous final walkthrough and clean handover, backed by our workmanship guarantee.",
  },
];

export type Project = {
  title: string;
  category: string;
  location: string;
  image: string;
  size: "tall" | "wide" | "square";
};

export const projects: Project[] = [
  {
    title: "Consumers Road Office Tower",
    category: "Commercial Build",
    location: "Toronto, ON",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    size: "tall",
  },
  {
    title: "Modern Retail Flagship",
    category: "Retail Redesign",
    location: "North York, ON",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    size: "wide",
  },
  {
    title: "Executive Residence",
    category: "Residential Renovation",
    location: "Toronto, ON",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    size: "square",
  },
  {
    title: "Industrial Epoxy Facility",
    category: "Epoxy Flooring",
    location: "Mississauga, ON",
    image:
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1400&q=80",
    size: "square",
  },
  {
    title: "Corporate Workspace Fit-Out",
    category: "Office Redesign",
    location: "Toronto, ON",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=80",
    size: "wide",
  },
  {
    title: "Waterfront Concrete Works",
    category: "Concrete & Masonry",
    location: "Etobicoke, ON",
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1400&q=80",
    size: "tall",
  },
];

export type ValueItem = {
  title: string;
  description: string;
};

export const values: ValueItem[] = [
  {
    title: "Craftsmanship",
    description:
      "A quarter-century of refined trade skill in every joint, surface and finish we deliver.",
  },
  {
    title: "Integrity",
    description:
      "Transparent pricing, honest timelines and clear communication from first call to handover.",
  },
  {
    title: "Safety",
    description:
      "Rigorous, code-compliant practices that protect our people, clients and communities.",
  },
  {
    title: "Innovation",
    description:
      "Modern methods and materials that make spaces smarter, stronger and more beautiful.",
  },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];
