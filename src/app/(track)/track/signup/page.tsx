import type { Metadata } from "next";
import TrackSignup from "./TrackSignup";

export const metadata: Metadata = {
  title: "Contractor Signup",
  description: "Create an AR Construction contractor tracking account.",
};

export default function SignupPage() {
  return <TrackSignup />;
}
