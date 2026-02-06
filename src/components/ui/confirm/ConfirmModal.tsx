"use client";

import { useEffect } from "react";
import { useConfirmContext } from "./ConfirmProvider";

/**
 * Confirm Modal
 * 
 * Ui component for confirm modal
 * 
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div
        className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {isDanger && (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
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

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {state.title}
        </h2>
        {state.description && (
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {state.description}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            {state.cancelLabel}
          </button>

          <button
            onClick={handleConfirm}
            className={`
              px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
              ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
          >
            {state.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

