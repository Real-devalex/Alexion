"use client";

// ============================================================
// ALEXION OS — Onboarding Flow Orchestrator
// Manages the step flow → done screen.
// Boot animation now lives at the root route.
// ============================================================

import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterSchema } from "@/lib/validations/auth";
import { register } from "@/features/auth/services/authService";

import OnboardingProgress from "./OnboardingProgress";
import OnboardingStep     from "./OnboardingStep";
import StepWelcome        from "./StepWelcome";
import StepUsername       from "./StepUsername";
import StepDisplayName    from "./StepDisplayName";
import StepCountry        from "./StepCountry";
import StepPassword       from "./StepPassword";
import StepAvatar         from "./StepAvatar";
import StepCreating       from "./StepCreating";
import StepDone           from "./StepDone";

const TOTAL_STEPS = 5;

type FlowState =
  | { stage: "steps"; step: number }
  | { stage: "creating" }
  | { stage: "done"; alexionEmail: string }
  | { stage: "error"; message: string };

export default function OnboardingFlow() {
  const [flow,      setFlow]      = useState<FlowState>({ stage: "steps", step: 0 });
  const [direction, setDirection] = useState<1 | -1>(1);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username:        "",
      displayName:     "",
      password:        "",
      confirmPassword: "",
      country:         "",
    },
    mode: "onTouched",
  });

  // ── Navigation ───────────────────────────────────────────
  const goNext = useCallback(() => {
    setDirection(1);
    setFlow((prev) => {
      if (prev.stage !== "steps") return prev;
      return { stage: "steps", step: prev.step + 1 };
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setFlow((prev) => {
      if (prev.stage !== "steps") return prev;
      if (prev.step === 0) return prev; // already at welcome
      return { stage: "steps", step: prev.step - 1 };
    });
  }, []);

  // ── Registration call (passed to StepCreating) ───────────
  const executeRegister = useCallback(async () => {
    const values = methods.getValues();
    const avatarFile = values.avatar?.[0] as File | undefined;

    // Capture preview before upload
    if (avatarFile && !avatarPreview) {
      setAvatarPreview(URL.createObjectURL(avatarFile));
    }

    const { user, error } = await register({
      username:     values.username,
      displayName:  values.displayName,
      password:     values.password,
      country:      values.country,
      avatarFile,
    });

    if (error) {
      return { alexionEmail: null, error };
    }

    return {
      alexionEmail: user?.alexionEmail ?? `${values.username.toLowerCase()}@alexion.com`,
      error: null,
    };
  }, [methods, avatarPreview]);

  // ── Kick off creating step ────────────────────────────────
  const startCreating = useCallback(async () => {
    // Final full validation before we submit
    const valid = await methods.trigger();
    if (!valid) {
      // Something failed — send back to step 1 (username)
      setDirection(-1);
      setFlow({ stage: "steps", step: 1 });
      return;
    }
    setDirection(1);
    setFlow({ stage: "creating" });
  }, [methods]);

  // ── Render ───────────────────────────────────────────────
  return (
    <FormProvider {...methods}>
      <div className="relative min-h-screen bg-surface overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-alexion-600/8 blur-[140px]" />
        </div>

        {/* Progress bar (hidden on welcome + creating + done) */}
        {flow.stage === "steps" && flow.step > 0 && (
          <OnboardingProgress current={flow.step - 1} total={TOTAL_STEPS} />
        )}

        {/* Error banner */}
        {flow.stage === "error" && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/30 rounded-os px-6 py-3 text-red-400 text-sm">
            {flow.message}{" "}
            <button
              onClick={() => setFlow({ stage: "steps", step: 1 })}
              className="underline ml-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Steps */}
        {flow.stage === "steps" && (
          <OnboardingStep stepKey={flow.step} direction={direction}>
            {flow.step === 0 && (
              <StepWelcome onNext={goNext} />
            )}
            {flow.step === 1 && (
              <StepUsername onNext={goNext} onBack={goBack} />
            )}
            {flow.step === 2 && (
              <StepDisplayName onNext={goNext} onBack={goBack} />
            )}
            {flow.step === 3 && (
              <StepCountry onNext={goNext} onBack={goBack} />
            )}
            {flow.step === 4 && (
              <StepPassword onNext={goNext} onBack={goBack} />
            )}
            {flow.step === 5 && (
              <StepAvatar
                onNext={startCreating}
                onBack={goBack}
              />
            )}
          </OnboardingStep>
        )}

        {/* Creating */}
        {flow.stage === "creating" && (
          <div className="flex items-center justify-center min-h-screen">
            <StepCreating
              execute={executeRegister}
              onSuccess={(email) => setFlow({ stage: "done", alexionEmail: email })}
              onError={(msg)   => setFlow({ stage: "error", message: msg })}
            />
          </div>
        )}

        {/* Done */}
        {flow.stage === "done" && (
          <div className="flex items-center justify-center min-h-screen px-6">
            <StepDone
              alexionEmail={flow.alexionEmail}
              avatarPreview={avatarPreview}
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
}
