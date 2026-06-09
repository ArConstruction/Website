import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="track-portal min-h-[100dvh] bg-ink supports-[min-height:100dvh]:min-h-dvh">
      {children}
    </div>
  );
}
