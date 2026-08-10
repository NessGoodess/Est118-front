import React, { forwardRef, useState, useRef, useEffect, useCallback, useId } from 'react';
import { IconByName } from './icons/global.icons';

interface BaseFloatingInputProps {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  /** When true, skips the reserved error/helper slot under the field. */
  hideMessage?: boolean;
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
      hideMessage = false,
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
      disabled,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLSelectElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const reactId = useId();

    const fieldId = id || name || reactId;

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

    const shellBg = disabled
      ? 'border-border bg-surface-muted'
      : error
        ? 'border-danger/40 bg-surface-elevated'
        : isFocused
          ? 'border-ring bg-surface-elevated shadow-md shadow-primary-soft'
          : 'border-border bg-surface-elevated hover:border-fg-muted/50';

    return (
      <div className={`relative ${hideMessage ? 'mb-0' : 'mb-3'} ${className || ''}`}>
        <div className={`relative rounded-xl border-2 transition-all duration-200 ${shellBg}`}>
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <div
                className={`transition-colors duration-200 ${isFocused ? 'text-primary' : error ? 'text-danger' : 'text-fg-muted'
                  }`}
              >
                <div className="h-4 w-4">{icon}</div>
              </div>
            </div>
          )}

          <label
            htmlFor={fieldId}
            className={`
              absolute transition-all duration-200 ease-out pointer-events-none z-10
              ${icon ? 'left-9' : 'left-3'}
              ${isFloating
                ? 'top-0 text-xs font-semibold bg-inherit px-1.5 -translate-y-1/2'
                : 'top-1/2 -translate-y-1/2 text-sm'
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
            disabled={disabled}
            {...props}
            className={`
              w-full bg-transparent rounded-xl border-0 appearance-none transition-colors duration-200
              ${icon ? 'pl-9' : 'pl-3'}
              pt-4 pb-1.5 pr-9
              focus:outline-none text-sm text-foreground
              ${error ? 'text-danger' : ''}
              disabled:text-fg-muted disabled:cursor-not-allowed
            `}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {children}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isFocused ? 'text-primary rotate-180' : 'text-fg-muted'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {!hideMessage && (
          <div className="mt-1.5 flex min-h-4 items-start gap-x-0.5">
            {(error || helperText) && (
              <>
                {error ? (
                  <>
                    <IconByName name="error" className="w-3 h-3 text-danger mt-0.5" />
                    <p className="text-xs text-danger font-medium">{error}</p>
                  </>
                ) : (
                  <>
                    <IconByName name="info" className="w-3 h-3 text-fg-muted mt-0.5" />
                    <p className="text-xs text-fg-muted">{helperText}</p>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

FloatingSelect.displayName = 'FloatingSelect';
