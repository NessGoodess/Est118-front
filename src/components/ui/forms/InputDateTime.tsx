import React, { useState, forwardRef } from 'react';
import { InputTextProps } from './BaseProps';
import {
  fieldControlClass,
  fieldErrorIconClass,
  fieldErrorTextClass,
  fieldHelperClass,
  fieldIconClass,
  fieldInfoIconClass,
  fieldLabelClass,
  fieldRequiredClass,
} from './fieldStyles';

export const InputDateTime = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, error, helperText, required, icon, iconPosition = 'left', className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;

    return (
      <div className={`w-full ${className ?? ''}`}>
        {label && (
          <label className={fieldLabelClass}>
            {label}
            {required && <span className={fieldRequiredClass}>*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className={`${fieldIconClass} left-3`}>{icon}</div>
          )}

          <input
            ref={ref}
            type="datetime-local"
            className={fieldControlClass({
              hasError,
              isFocused,
              extra: [
                'appearance-none',
                icon && iconPosition === 'left' ? 'pl-11' : '',
                icon && iconPosition === 'right' ? 'pr-11' : '',
              ]
                .filter(Boolean)
                .join(' '),
            })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className={`${fieldIconClass} right-3`}>{icon}</div>
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-2 flex items-start gap-1.5">
            {error ? (
              <>
                <svg className={fieldErrorIconClass} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className={fieldErrorTextClass}>{error}</p>
              </>
            ) : (
              <>
                <svg className={fieldInfoIconClass} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className={fieldHelperClass}>{helperText}</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

InputDateTime.displayName = 'InputDateTime';
