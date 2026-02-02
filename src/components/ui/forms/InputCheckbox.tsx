import React, { forwardRef, } from 'react';
import { InputCheckboxProps} from './BaseProps';

export const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>(
    ({ label, error, helperText, required, labelClassName, className, ...props }, ref) => {
      return (
        <div className={`w-full ${className}`}>
          <label className={`flex items-start gap-3 cursor-pointer group ${labelClassName}`}>
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                ref={ref}
                type="checkbox"
                className={`
                  w-5 h-5 rounded-lg border-2 transition-all duration-200 cursor-pointer text-slate-900
                  ${error 
                    ? 'border-red-300 text-red-600 focus:ring-red-500' 
                    : 'border-slate-300 text-blue-600 focus:ring-blue-500'
                  }
                  focus:ring-2 focus:ring-offset-2
                  disabled:bg-slate-100 disabled:cursor-not-allowed
                  group-hover:border-blue-400
                `}
                {...props}
              />
            </div>
            
            {label && (
              <div className="flex-1">
                <span className={`text-sm font-medium ${error ? 'text-red-900' : 'text-slate-700'} group-hover:text-slate-900`}>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </span>
                {helperText && !error && (
                  <p className="text-sm text-slate-500 mt-1">{helperText}</p>
                )}
              </div>
            )}
          </label>
          
          {error && (
            <div className="mt-2 ml-8 flex items-start gap-1.5">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
        </div>
      );
    }
  );
  
  InputCheckbox.displayName = 'InputCheckbox';
  