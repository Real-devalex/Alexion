"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Globe } from "lucide-react";
import { COUNTRIES } from "@/lib/constants/countries";
import type { RegisterSchema } from "@/lib/validations/auth";

interface StepCountryProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepCountry({ onNext, onBack }: StepCountryProps) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<RegisterSchema>();

  const handleNext = async () => {
    const valid = await trigger("country");
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
        <h2 className="text-3xl font-bold text-white">Where are you based?</h2>
        <p className="text-white/40 mt-2">
          Select the country you&apos;re in.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <Select
          id="country"
          placeholder="Select your country"
          options={COUNTRIES}
          error={errors.country?.message}
          {...register("country")}
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
