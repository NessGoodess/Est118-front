import React, { useState, forwardRef, } from 'react';
import { InputTextareaProps} from './BaseProps';


export const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
    ({ label, error, helperText, required, maxLength, showCount, className, ...props }, ref) => {
      const [isFocused, setIsFocused] = useState(false);
      const [charCount, setCharCount] = useState(0);
      const hasError = !!error;
  
      return (
        <div className={`w-full ${className}`}>
          {label && (
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          <div className="relative">
            <textarea
              ref={ref}
              maxLength={maxLength}
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none text-slate-900
                ${hasError 
                  ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : isFocused
                    ? 'border-blue-500 bg-white shadow-lg shadow-blue-100 focus:ring-4 focus:ring-blue-100'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }
                focus:outline-none
                disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
              `}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                setCharCount(e.target.value.length);
                props.onChange?.(e);
              }}
              {...props}
            />
            
            {showCount && maxLength && (
              <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                {charCount}/{maxLength}
              </div>
            )}
          </div>
          
          {(error || helperText) && (
            <div className="mt-2 flex items-start gap-1.5">
              {error ? (
                <>
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-slate-500">{helperText}</p>
                </>
              )}
            </div>
          )}
        </div>
      );
    }
  );
  
  InputTextarea.displayName = 'InputTextarea';