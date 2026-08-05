"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type CheckboxSize = "sm" | "md";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "className"
> & {
  /** Controlled indeterminate state (header “select all” rows/cols). */
  indeterminate?: boolean;
  size?: CheckboxSize;
  label?: ReactNode;
  className?: string;
  inputClassName?: string;
};

const sizeClasses: Record<CheckboxSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

const iconSizeClasses: Record<CheckboxSize, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 8h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      size = "sm",
      indeterminate = false,
      checked,
      disabled,
      className,
      inputClassName,
      onChange,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const innerRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      const el = innerRef.current;
      if (el) el.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const isOn = Boolean(checked) || indeterminate;

    return (
      <label
        htmlFor={fieldId}
        className={[
          "inline-flex items-center gap-2",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="relative inline-flex shrink-0 items-center justify-center">
          <input
            ref={setRefs}
            id={fieldId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className={[
              "peer appearance-none rounded border-2 transition-colors duration-150",
              "border-border bg-surface-elevated",
              "checked:border-primary checked:bg-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-app",
              "disabled:cursor-not-allowed",
              sizeClasses[size],
              isOn && !checked ? "border-primary bg-primary" : "",
              inputClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          <span
            className={[
              "pointer-events-none absolute inset-0 flex items-center justify-center text-primary-foreground opacity-0",
              "peer-checked:opacity-100",
              indeterminate ? "opacity-100" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {indeterminate && !checked ? (
              <MinusIcon className={iconSizeClasses[size]} />
            ) : (
              <CheckIcon className={iconSizeClasses[size]} />
            )}
          </span>
        </span>
        {label != null ? (
          <span className="text-sm text-foreground">{label}</span>
        ) : null}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
