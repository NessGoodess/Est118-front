"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto o nodo dentro del botón */
  children: ReactNode;
  /** Estilo visual del botón */
  variant?: ButtonVariant;
  /** Tamaño del botón */
  size?: ButtonSize;
  /** Muestra spinner y bloquea interacción */
  loading?: boolean;
  /** Texto que aparece junto al spinner (default: "Cargando…") */
  loadingText?: string;
  /** Ícono a la izquierda del texto (ReactNode) */
  leftIcon?: ReactNode;
  /** Ícono a la derecha del texto (ReactNode) */
  rightIcon?: ReactNode;
  /** Ocupa el 100% del ancho del contenedor */
  fullWidth?: boolean;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={["animate-spin", className].filter(Boolean).join(" ")}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary text-primary-foreground",
    "hover:bg-primary-hover",
    "active:scale-[0.97]",
    "focus-visible:ring-ring",
    "disabled:opacity-50",
    "cursor-pointer",
  ].join(" "),

  secondary: [
    "bg-surface-elevated text-primary border border-primary",
    "hover:bg-primary-soft hover:border-primary-hover hover:text-primary-hover",
    "active:scale-[0.97]",
    "focus-visible:ring-ring",
    "disabled:opacity-50",
    "cursor-pointer",
  ].join(" "),

  ghost: [
    "bg-transparent text-primary",
    "hover:bg-primary-soft hover:text-primary-hover",
    "active:scale-[0.97]",
    "focus-visible:ring-ring",
    "disabled:opacity-50",
    "cursor-pointer",
  ].join(" "),

  danger: [
    "bg-danger text-danger-foreground",
    "hover:opacity-90",
    "active:scale-[0.97]",
    "focus-visible:ring-danger",
    "disabled:opacity-50",
    "cursor-pointer",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8  px-3   text-sm   gap-1.5 [&_svg]:size-3.5",
  md: "h-10 px-4   text-sm   gap-2   [&_svg]:size-4",
  lg: "h-12 px-6   text-base gap-2.5 [&_svg]:size-5",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  children,
  variant    = "primary",
  size       = "md",
  loading    = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth  = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={[
        // Base
        "relative inline-flex items-center justify-center rounded-lg font-medium",
        "transition-all duration-150 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-app",
        "disabled:cursor-not-allowed",
        "select-none",
        // Variant + size
        variantClasses[variant],
        sizeClasses[size],
        // Full width
        fullWidth && "w-full",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {/* Loading state */}
      {loading ? (
        <>
          <Spinner className={
            size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4"
          } />
          <span>{loadingText ?? "Cargando…"}</span>
        </>
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
    </button>
  );
}
