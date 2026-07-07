"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Camera, Upload, X } from "lucide-react";
import type { RegisterSchema } from "@/lib/validations/auth";

interface StepAvatarProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepAvatar({ onNext, onBack }: StepAvatarProps) {
  const { register, setValue, watch, formState: { errors } } =
    useFormContext<RegisterSchema>();
  const fileInputRef                            = useRef<HTMLInputElement>(null);
  const [preview, setPreview]                  = useState<string | null>(null);
  const displayName                            = watch("displayName");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("avatar", e.target.files as unknown as FileList, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setPreview(null);
    setValue("avatar", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white">Add a profile picture</h2>
        <p className="text-white/40 mt-2">
          Put a face to your name. You can always change this later.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4"
      >
        {/* Avatar circle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden hover:border-alexion-500/50 transition-colors focus-visible:ring-2 focus-visible:ring-alexion-500 outline-none group"
            aria-label="Upload profile picture"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Avatar preview"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/30 group-hover:text-white/50 transition-colors">
                <Camera className="w-8 h-8" />
                <span className="text-xs">Upload</span>
              </div>
            )}
          </button>

          {/* Remove button */}
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-surface-elevated border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-red-500/20 transition-colors"
              aria-label="Remove avatar"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Initials fallback preview */}
        {!preview && displayName && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-xs">Or use your initials</span>
            <div className="w-12 h-12 rounded-full bg-alexion-500/20 border border-alexion-500/30 flex items-center justify-center">
              <span className="text-alexion-400 font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {errors.avatar && (
          <p className="text-xs text-red-400">{errors.avatar.message as string}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Profile picture file input"
          onChange={handleFile}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 w-full"
      >
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button variant="ghost" onClick={onNext} className="flex-1 text-white/50">
          Skip for now
        </Button>
        {preview && (
          <Button onClick={onNext} className="flex-1">Continue</Button>
        )}
      </motion.div>
    </div>
  );
}
