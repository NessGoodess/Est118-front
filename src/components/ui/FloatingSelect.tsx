import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { IconByName } from './icons/global.icons';

interface BaseFloatingInputProps {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  id?: string;
  className?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

interface FloatingSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'>,
  BaseFloatingInputProps {
  children: React.ReactNode;
  placeholder?: string;
}

export const FloatingSelect = forwardRef<HTMLSelectElement, FloatingSelectProps>(
  (
    {
      label,
      name,
      icon,
      error,
      helperText,
      required = false,
      placeholder = "Selecciona una opción",
      id,
      onChange,
      onBlur,
      onFocus,
      className,
      value,
      defaultValue,
      children,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLSelectElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const fieldId = id || name || `floating-select-${Math.random().toString(36).slice(2, 9)}`;

    const setRefs = useCallback(
      (node: HTMLSelectElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
      },
      [ref]
    );

    const checkHasValue = useCallback(() => {
      if (internalRef.current) {
        const val = internalRef.current.value;
        setHasValue(val !== "" && val !== undefined && val !== null);
      }
    }, []);

    useEffect(() => {
      checkHasValue();
      const el = internalRef.current;
      if (!el) return;

      el.addEventListener('change', checkHasValue);
      return () => el.removeEventListener('change', checkHasValue);
    }, [checkHasValue]);

    useEffect(() => {
      if (value !== undefined) {
        setHasValue(!!value);
      }
    }, [value]);

    const isFloating = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      checkHasValue();
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      checkHasValue();
      onChange?.(e);
    };

    return (
      <div className={`relative mb-4 ${className || ''}`}>
        <div className="relative">
          {/* Icono */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <div
                className={`transition-colors duration-200 ${isFocused ? 'text-primary' : error ? 'text-danger' : 'text-fg-muted'
                  }`}
              >
                <div className="h-5 w-5">{icon}</div>
              </div>
            </div>
          )}

          <label
            htmlFor={fieldId}
            className={`
              absolute transition-all duration-200 ease-out pointer-events-none z-10
              ${icon ? 'left-11' : 'left-4'}
              ${isFloating
                ? error
                  ? 'top-0 text-xs font-semibold bg-gradient-to-t from-danger/5 to-surface-elevated px-2 -translate-y-1/2'
                  : 'top-0 text-xs font-semibold bg-surface-elevated px-2 -translate-y-1/2'
                : 'top-1/2 -translate-y-1/2 text-base'
              }
              ${isFocused
                ? 'text-primary'
                : error
                  ? 'text-danger'
                  : isFloating
                    ? 'text-foreground'
                    : 'text-fg-muted'
              }
            `}
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>

          {/* Select */}
          <select
            ref={setRefs}
            id={fieldId}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            required={required}
            {...props}
            className={`
    w-full rounded-xl border-2 transition-all duration-200 appearance-none
    ${icon ? 'pl-11' : 'pl-4'}
    pt-6 pb-2 pr-10
    focus:outline-none
    ${error
                ? 'border-danger/40 bg-danger/5 text-danger focus:border-danger'
                : isFocused
                  ? 'border-ring bg-surface-elevated shadow-lg shadow-primary-soft'
                  : 'border-border bg-surface-elevated hover:border-fg-muted/50'
              }
    disabled:bg-surface-muted disabled:text-fg-muted disabled:cursor-not-allowed
    text-base text-foreground  /* ← Quitamos la condición y siempre usamos text-foreground */
  `}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {children}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isFocused ? 'text-primary rotate-180' : 'text-fg-muted'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Error / Helper */}
        <div className="mt-2 flex h-6 items-start gap-x-0.5">
          {(error || helperText) && (
            <>
              {error ? (
                <>
                  <IconByName name="error" className="w-3.5 h-3.5 text-danger mt-0.5" />
                  <p className="text-xs text-danger font-medium">{error}</p>
                </>
              ) : (
                <>
                  <IconByName name="info" className="w-3.5 h-3.5 text-fg-muted mt-0.5" />
                  <p className="text-xs text-fg-muted">{helperText}</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

FloatingSelect.displayName = 'FloatingSelect';