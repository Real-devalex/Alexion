import type { Metadata } from "next";
import AuthCard from "@/features/auth/components/AuthCard";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — Alexion OS",
};

export default function RegisterPage() {
  return (
    <AuthCard>
      <RegisterForm />
    </AuthCard>
  );
}
