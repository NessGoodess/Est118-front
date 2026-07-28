"use client";

import { useEffect } from "react";
import { useConfirmContext } from "./ConfirmProvider";

/**
 * Confirm Modal — token-based surfaces for light/dark
 */
export const ConfirmModal = () => {
  const { state, close } = useConfirmContext();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isOpen) {
        close();
      }
    };

    if (state.isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [state.isOpen, close]);

  if (!state.isOpen) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      await state.onConfirm();
    } catch (error) {
      console.error("Error en confirmación:", error);
    } finally {
      close();
    }
  };

  const handleCancel = () => {
    if (state.onCancel) {
      state.onCancel();
    }
    close();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const isDanger = state.variant === "danger";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-modal-overlay backdrop-blur-sm transition-opacity" />

      <div
        className="relative bg-surface-elevated text-foreground rounded-xl shadow-card border border-border max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {isDanger && (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-danger/15 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold text-brand-strong mb-2">
          {state.title}
        </h2>
        {state.description && (
          <p className="text-fg-muted mb-6">{state.description}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-foreground bg-surface-muted hover:bg-border rounded-lg transition-colors"
          >
            {state.cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-elevated
              ${
                isDanger
                  ? "bg-danger text-danger-foreground hover:opacity-90 focus:ring-danger"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-ring"
              }
            `}
          >
            {state.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
