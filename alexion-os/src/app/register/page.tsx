import type { Metadata } from "next";
import OnboardingFlow from "@/features/auth/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Create Account — Alexion OS",
};

export default function RegisterPage() {
  return <OnboardingFlow />;
}
