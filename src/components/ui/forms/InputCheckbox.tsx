import React, { forwardRef } from 'react';
import { InputCheckboxProps } from './BaseProps';
import {
  fieldErrorIconClass,
  fieldErrorTextClass,
  fieldHelperClass,
  fieldRequiredClass,
} from './fieldStyles';

export const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>(
  ({ label, error, helperText, required, labelClassName, className, ...props }, ref) => {
    return (
      <div className={`w-full ${className ?? ''}`}>
        <label className={`flex items-start gap-3 cursor-pointer group ${labelClassName ?? ''}`}>
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              className={`
                w-5 h-5 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${
                  error
                    ? 'border-danger/50 text-danger focus:ring-danger'
                    : 'border-border text-primary focus:ring-ring'
                }
                focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-app
                disabled:bg-surface-muted disabled:cursor-not-allowed
                group-hover:border-primary
              `}
              {...props}
            />
          </div>

          {label && (
            <div className="flex-1">
              <span
                className={`text-sm font-medium ${
                  error ? 'text-danger' : 'text-foreground'
                } group-hover:text-foreground`}
              >
                {label}
                {required && <span className={fieldRequiredClass}>*</span>}
              </span>
              {helperText && !error && (
                <p className={`${fieldHelperClass} mt-1`}>{helperText}</p>
              )}
            </div>
          )}
        </label>

        {error && (
          <div className="mt-2 ml-8 flex items-start gap-1.5">
            <svg className={fieldErrorIconClass} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className={fieldErrorTextClass}>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

InputCheckbox.displayName = 'InputCheckbox';
