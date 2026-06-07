import type { Metadata } from "next";
import TrackPortal from "./TrackPortal";

export const metadata: Metadata = {
  title: "Contractor Track",
  description: "AR Construction contractor task tracking portal.",
};

export default function TrackPage() {
  return <TrackPortal />;
}
