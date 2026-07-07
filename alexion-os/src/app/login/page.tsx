import type { Metadata } from "next";
import AuthCard from "@/features/auth/components/AuthCard";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — Alexion OS",
};

export default function LoginPage() {
  return (
    <AuthCard>
      <LoginForm />
    </AuthCard>
  );
}
