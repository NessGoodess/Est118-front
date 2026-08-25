"use client";

import { motion } from "framer-motion";

interface StepNavigationProps {
  onBack: () => void;
  onNext: () => void;

  /** State */
  isSubmitting?: boolean;

  /** Text */
  backLabel?: string;
  nextLabel?: string;
  submittingLabel?: string;

  /** Variant */
  variant?: "default" | "submit";
}

export default function StepNavigation({
  onBack,
  onNext,
  isSubmitting = false,
  backLabel = "← Atrás",
  nextLabel = "Continuar →",
  submittingLabel = "Enviando...",
  variant = "default",
}: StepNavigationProps) {
  const isSubmit = variant === "submit";

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg hover:bg-brand-600 rounded-full hover:text-white font-semibold transition-colors ${isSubmitting
          ? "text-fg-muted cursor-not-allowed"
          : "text-foreground hover:text-foreground"
          }`}
      >
        {backLabel}
      </button>

      <motion.button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
        whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
        className={`px-4 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-lg transition-all flex items-center gap-2 ${isSubmitting
            ? "bg-fg-muted text-fg-muted cursor-not-allowed"
            : isSubmit
              ? "bg-success hover:bg-success text-success-foreground shadow-lg hover:shadow-xl"
              : "bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:shadow-xl"
          }`}
      >
        {isSubmitting ? (
          <>
            <Spinner />
            {submittingLabel}
          </>
        ) : (
          nextLabel
        )}
      </motion.button>
    </div>
  );
}

/* Spinner */
function Spinner() {
  return (
    <span
      aria-hidden
      className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
