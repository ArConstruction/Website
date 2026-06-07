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
  BrickWall,
  DoorOpen,
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
    "With over 25 years of experience, AR Construction has established itself as a leader in providing innovative and professional construction and renovation services, constructing and redesigning office buildings, retail spaces, and commercial & residential properties.",
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
    slug: "epoxy-flooring",
    title: "Epoxy Flooring",
    blurb:
      "Seamless, high-strength epoxy systems engineered for commercial, industrial and showroom environments.",
    icon: Layers,
    image: "/images/epoxy-exhibition-hall.jpg",
  },
  {
    slug: "carpet-flooring",
    title: "Carpet Flooring",
    blurb:
      "Expert supply and installation of commercial and residential carpet for comfort, acoustics and style.",
    icon: Footprints,
    image: "/images/carpet-corridor.jpg",
  },
  {
    slug: "redesign-spaces",
    title: "Redesign",
    blurb:
      "Full-scope reimagining of office buildings, retail and living spaces, from concept to a refined, functional finish.",
    icon: Ruler,
    image: "/images/office-polished-corridor.jpg",
  },
  {
    slug: "waterproofing",
    title: "Waterproofing",
    blurb:
      "Foundation and structural waterproofing systems built to keep spaces dry and protected for decades.",
    icon: Droplets,
    image: "/images/facility-exterior-dusk.jpg",
  },
  {
    slug: "concrete-masonry",
    title: "Concrete & Masonry",
    blurb:
      "Structural concrete and masonry, from grinding and surface prep to durable, precision block and stonework.",
    icon: BrickWall,
    image: "/images/concrete-grinding.jpg",
  },
  {
    slug: "drywall-painting",
    title: "Drywall & Paint",
    blurb:
      "Precision drywall installation, taping and premium painting that delivers flawless, durable surfaces.",
    icon: PaintRoller,
    image:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "doors",
    title: "Doors",
    blurb:
      "Supply and installation of interior, exterior and commercial doors, fitted for security, fit and finish.",
    icon: DoorOpen,
    image: "/images/warehouse-fitout.jpg",
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
      "Detailed drawings, material selection and permitting, with every detail engineered before we break ground.",
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
  image: string;
  size: "tall" | "wide" | "square";
};

export const projects: Project[] = [
  {
    title: "Convention Centre Polished Concrete",
    category: "Polished Concrete",
    image: "/images/polished-concrete-floor.jpg",
    size: "tall",
  },
  {
    title: "Self-Storage Facility Renovation",
    category: "Commercial Renovation",
    image: "/images/storage-units-interior.jpg",
    size: "wide",
  },
  {
    title: "Concrete Surface Preparation",
    category: "Concrete & Masonry",
    image: "/images/concrete-grinding.jpg",
    size: "square",
  },
  {
    title: "Pedway Carpet Renewal",
    category: "Carpet Flooring",
    image: "/images/carpet-pedway.jpg",
    size: "square",
  },
  {
    title: "Epoxy Floor Installation",
    category: "Epoxy Flooring",
    image: "/images/epoxy-team-prep.jpg",
    size: "wide",
  },
  {
    title: "Corporate Office Refinishing",
    category: "Redesign",
    image: "/images/office-polished-corridor.jpg",
    size: "square",
  },
  {
    title: "Exhibition Hall Polished Floor",
    category: "Polished Concrete",
    image: "/images/polished-concrete-hall.jpg",
    size: "square",
  },
  {
    title: "Skywalk Carpet Installation",
    category: "Carpet Flooring",
    image: "/images/carpet-walkway.jpg",
    size: "square",
  },
  {
    title: "Corporate Lounge Carpet",
    category: "Carpet Flooring",
    image: "/images/carpet-lounge.jpg",
    size: "square",
  },
  {
    title: "Commercial Carpet Fit-Out",
    category: "Carpet Flooring",
    image: "/images/carpet-team.jpg",
    size: "wide",
  },
  {
    title: "Self-Storage Corridor Build",
    category: "Commercial Renovation",
    image: "/images/storage-corridor.jpg",
    size: "square",
  },
  {
    title: "Warehouse Fit-Out",
    category: "Commercial Renovation",
    image: "/images/warehouse-fitout.jpg",
    size: "square",
  },
  {
    title: "Epoxy Application In Progress",
    category: "Epoxy Flooring",
    image: "/images/epoxy-application.jpg",
    size: "square",
  },
  {
    title: "Facility Exterior Renovation",
    category: "Waterproofing",
    image: "/images/facility-exterior-dusk.jpg",
    size: "wide",
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
