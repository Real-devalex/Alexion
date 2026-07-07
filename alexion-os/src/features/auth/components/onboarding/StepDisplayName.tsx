"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { AtSign } from "lucide-react";
import type { RegisterSchema } from "@/lib/validations/auth";

interface StepDisplayNameProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepDisplayName({ onNext, onBack }: StepDisplayNameProps) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<RegisterSchema>();

  const handleNext = async () => {
    const valid = await trigger("displayName");
    if (valid) onNext();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white">What should we call you?</h2>
        <p className="text-white/40 mt-2">
          This is the name other people will see.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <Input
          id="displayName"
          placeholder="Your Name"
          icon={<AtSign className="w-4 h-4" />}
          error={errors.displayName?.message}
          autoComplete="name"
          autoFocus
          {...register("displayName")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 w-full"
      >
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={handleNext} className="flex-1">Continue</Button>
      </motion.div>
    </div>
  );
}
