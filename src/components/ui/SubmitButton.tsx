"use client";

import React from 'react';

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  pending?: boolean; // Estado de carga desde el componente padre
  loadingText?: string; // Texto personalizado mientras carga
}

export function SubmitButton({ 
  children, 
  className,
  pending = false,
  loadingText = 'Procesando...'
}: SubmitButtonProps) {

  return (
    <button
      type="submit"
      disabled={pending}
      className={`group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
        className || ''
      }`}
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <svg 
          className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 group-hover:text-blue-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </span>
      {pending ? (
        <div className="flex items-center justify-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
