"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons/global.icons";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  footerActions?: boolean;
  footerActionsContent?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "min-h-dvh";
  reopenKey?: string | number;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  footerActionsContent,
  maxWidth = "2xl",
  reopenKey,
}: ModalProps) {
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelKey, setPanelKey] = useState(0);
  const skipReopenRef = useRef(true);
  const lastReopenKey = useRef(reopenKey);

  useEffect(() => {
    if (!isOpen) {
      setPanelVisible(false);
      document.body.style.overflow = "";
      skipReopenRef.current = true;
      return;
    }

    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => setPanelVisible(true));
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || reopenKey === undefined) return;

    if (skipReopenRef.current) {
      skipReopenRef.current = false;
      lastReopenKey.current = reopenKey;
      return;
    }

    if (lastReopenKey.current === reopenKey) return;
    lastReopenKey.current = reopenKey;

    setPanelVisible(false);
    const t = window.setTimeout(() => {
      setPanelKey((k) => k + 1);
      requestAnimationFrame(() => setPanelVisible(true));
    }, 150);
    return () => window.clearTimeout(t);
  }, [reopenKey, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    "8xl": "max-w-8xl",
    "min-h-dvh": "min-h-dvh",
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop — recibe el click de cierre (antes el overlay hijo bloqueaba el padre) */}
      <div
        className={[
          "fixed inset-0 bg-modal-overlay transition-opacity duration-200",
          panelVisible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={() => onClose?.()}
        aria-hidden
      />

      <div className="pointer-events-none flex max-h-dvh min-h-dvh items-center justify-center p-3 sm:p-4 md:p-6">
        <div
          key={panelKey}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={[
            "pointer-events-auto relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-xl border border-border bg-modal-bg/30 text-foreground shadow-card backdrop-blur-sm sm:max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-3rem)]",
            "transition-all duration-200 ease-out",
            panelVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-2 scale-[0.97] opacity-0",
            maxWidthClasses[maxWidth],
          ].join(" ")}
        >
          {title ? (
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-md font-semibold text-brand-strong md:text-xl">
                {title}
              </h2>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onClose?.()}
                aria-label="Cerrar"
              >
                <IconByName name="x" className="h-6 w-6" />
              </Button>
            </div>
          ) : null}

          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-2 md:px-6 md:py-6 [-webkit-overflow-scrolling:touch]">
            {children}
          </div>
          {footerActions ? (
            <div className="flex shrink-0 items-center justify-end border-t border-border px-4 py-4">
              {footerActionsContent}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
