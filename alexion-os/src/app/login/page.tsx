import type { Metadata } from "next";
import LoginPage from "@/features/auth/components/LoginPage";

export const metadata: Metadata = {
  title: "Sign In — Alexion OS",
};

export default function LoginRoute() {
  return <LoginPage />;
}
