import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { company } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arconstruction.ca"),
  title: {
    default: company.name,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  keywords: [
    "construction Toronto",
    "renovation Toronto",
    "commercial construction",
    "office build out",
    "drywall painting",
    "epoxy flooring",
    "AR Construction",
  ],
  openGraph: {
    title: `${company.name} | ${company.tagline}`,
    description: company.description,
    type: "website",
    locale: "en_CA",
    siteName: company.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ink text-white antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
