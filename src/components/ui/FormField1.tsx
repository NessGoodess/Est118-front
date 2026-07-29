"use client";

import React, { useState, useRef, useEffect, forwardRef } from 'react';

// Estilos para ocultar el placeholder del input date cuando no está enfocado
const dateInputStyles = `
  .date-input-empty::-webkit-datetime-edit-text {
    opacity: 0 !important;
  }
  .date-input-empty::-webkit-datetime-edit-month-field {
    opacity: 0 !important;
  }
  .date-input-empty::-webkit-datetime-edit-day-field {
    opacity: 0 !important;
  }
  .date-input-empty::-webkit-datetime-edit-year-field {
    opacity: 0 !important;
  }
  .date-input-empty::-webkit-inner-spin-button {
    opacity: 0 !important;
  }
  .date-input-empty::-webkit-calendar-picker-indicator {
    opacity: 0 !important;
  }
`;

interface FormFieldProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'onBlur' | 'name'> {
  label: string;
  name?: string; // Opcional porque puede venir de register()
  icon?: React.ReactNode;
  error?: string;
  // Props para react-hook-form
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  id,
  icon,
  error,
  required = false,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  ...inputProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = id || name;

  // Combinar ref interno con el ref de RHF
  const combinedRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  };

  // Inyectar estilos para inputs de fecha si es necesario
  useEffect(() => {
    if (type === 'date' && typeof document !== 'undefined') {
      const styleId = 'date-input-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = dateInputStyles;
        document.head.appendChild(style);
      }
    }
  }, [type]);

  // Determinar si el campo tiene valor (leer del DOM ya que RHF lo maneja)
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const checkValue = () => {
      setHasValue(input.value.length > 0);
    };
    
    // Verificar valor inicial
    checkValue();
    
    // Escuchar eventos de input para detectar cambios (incluyendo cambios programáticos de RHF)
    input.addEventListener('input', checkValue);
    // También escuchar el evento change para casos donde RHF actualiza el valor
    input.addEventListener('change', checkValue);
    
    return () => {
      input.removeEventListener('input', checkValue);
      input.removeEventListener('change', checkValue);
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (inputRef.current) {
      setHasValue(inputRef.current.value.length > 0);
    }
    // Llamar al onBlur de RHF si existe
    if (externalOnBlur) {
      externalOnBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    // Llamar al onChange de RHF si existe
    if (externalOnChange) {
      externalOnChange(e);
    }
  };

  const isLabelFloating = isFocused || hasValue;
  const displayPlaceholder = !isLabelFloating ? placeholder : undefined;

  return (
    <div className="mb-4 sm:mb-6 relative">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className="text-fg-muted">
              <div className="h-4 w-4 sm:h-5 sm:w-5">
                {icon}
              </div>
            </div>
          </div>
        )}
        
        {/* Label flotante */}
        <label
          htmlFor={fieldId}
          className={`absolute left-0 transition-all duration-300 ease-out pointer-events-none ${
            icon ? 'left-8 sm:left-10' : 'left-3 sm:left-4'
          } ${
            isLabelFloating
              ? 'top-0 text-xs text-primary font-semibold bg-surface-elevated px-1.5 -translate-y-1/2 scale-100'
              : 'top-1/2 -translate-y-1/2 text-sm sm:text-base text-fg-muted scale-100'
          } ${isFocused && !isLabelFloating ? 'text-primary' : ''}`}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>

        <input
          ref={combinedRef}
          type={type}
          id={fieldId}
          name={name}
          placeholder={displayPlaceholder}
          autoComplete={autoComplete}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...inputProps}
          className={`w-full ${
            icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'
          } ${
            isLabelFloating ? 'pt-5 sm:pt-6 pb-2 sm:pb-2.5' : 'py-2.5 sm:py-3'
          } pr-3 sm:pr-4 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-0 focus:border-ring transition-all duration-300 bg-surface-elevated shadow-sm ${
            error
              ? 'border-danger/40 focus:ring-danger focus:border-danger'
              : 'border-border'
          } ${type === 'date' && !isFocused && !hasValue ? 'date-input-empty' : ''}`}
          style={
            type === 'date' && !isFocused && !hasValue
              ? { color: 'transparent' }
              : type === 'date' && isFocused
              ? { color: 'inherit' }
              : undefined
          }
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-danger absolute" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  id?: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  // Props para react-hook-form
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  rows?: number;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(({
  label,
  name,
  placeholder,
  id,
  icon,
  error,
  required = false,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  rows = 4,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = id || name;

  // Combinar ref interno con el ref de RHF
  const combinedRef = (node: HTMLTextAreaElement | null) => {
    textareaRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    }
  };

  // Determinar si el campo tiene valor (leer del DOM ya que RHF lo maneja)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const checkValue = () => {
      setHasValue(textarea.value.length > 0);
    };
    
    // Verificar valor inicial
    checkValue();
    
    // Escuchar eventos de input para detectar cambios (incluyendo cambios programáticos de RHF)
    textarea.addEventListener('input', checkValue);
    // También escuchar el evento change para casos donde RHF actualiza el valor
    textarea.addEventListener('change', checkValue);
    
    return () => {
      textarea.removeEventListener('input', checkValue);
      textarea.removeEventListener('change', checkValue);
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (textareaRef.current) {
      setHasValue(textareaRef.current.value.length > 0);
    }
    // Llamar al onBlur de RHF si existe
    if (externalOnBlur) {
      externalOnBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    // Llamar al onChange de RHF si existe
    if (externalOnChange) {
      externalOnChange(e);
    }
  };

  const isLabelFloating = isFocused || hasValue;
  const displayPlaceholder = !isLabelFloating ? placeholder : undefined;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative">
        {icon && (
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
            <div className="text-fg-muted">
              <div className="h-4 w-4 sm:h-5 sm:w-5">
                {icon}
              </div>
            </div>
          </div>
        )}
        
        {/* Label flotante */}
        <label
          htmlFor={fieldId}
          className={`absolute left-0 transition-all duration-300 ease-out pointer-events-none ${
            icon ? 'left-8 sm:left-10' : 'left-3 sm:left-4'
          } ${
            isLabelFloating
              ? 'top-0 text-xs text-primary font-semibold bg-surface-elevated px-1.5 -translate-y-1/2 scale-100'
              : 'top-3 text-sm sm:text-base text-fg-muted scale-100'
          } ${isFocused && !isLabelFloating ? 'text-primary' : ''}`}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>

        <textarea
          ref={combinedRef}
          id={fieldId}
          name={name}
          placeholder={displayPlaceholder}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          rows={rows}
          className={`w-full ${
            icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'
          } ${
            isLabelFloating ? 'pt-5 sm:pt-6 pb-2 sm:pb-2.5' : 'pt-3 sm:pt-3.5 pb-2.5 sm:pb-3'
          } pr-3 sm:pr-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-300 bg-surface-elevated shadow-sm resize-vertical ${
            error
              ? 'border-danger/40 focus:ring-danger focus:border-danger'
              : 'border-border'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

TextAreaField.displayName = "TextAreaField";
