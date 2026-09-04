"use client";

import { Button } from "@/components/ui/Button";

interface StepNavigationProps {
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  backLabel?: string;
  nextLabel?: string;
  submittingLabel?: string;
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
  return (
    <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={onBack}
        disabled={isSubmitting}
      >
        {backLabel}
      </Button>

      <Button
        type="button"
        variant={variant === "submit" ? "success" : "primary"}
        size="lg"
        loading={isSubmitting}
        loadingText={submittingLabel}
        onClick={onNext}
        className="shadow-lg hover:shadow-xl"
      >
        {nextLabel}
      </Button>
    </div>
  );
}
