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
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg hover:bg-slate-600 rounded-full hover:text-white font-semibold transition-colors ${isSubmitting
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:text-gray-900"
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
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : isSubmit
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
              : "bg-blue-600 hover:bg-blue-900 text-white shadow-lg hover:shadow-xl"
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
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
