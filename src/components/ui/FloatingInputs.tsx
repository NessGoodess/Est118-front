"use client";

import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { IconByName } from './icons/global.icons';

// ============================================================================
// ESTILOS GLOBALES PARA INPUT DATE
// ============================================================================

const dateInputStyles = `
  .date-input-empty::-webkit-datetime-edit { opacity: 0; }
  .date-input-empty::-webkit-datetime-edit-text { opacity: 0; }
  .date-input-empty::-webkit-datetime-edit-month-field { opacity: 0; }
  .date-input-empty::-webkit-datetime-edit-day-field { opacity: 0; }
  .date-input-empty::-webkit-datetime-edit-year-field { opacity: 0; }
  .date-input-empty::-webkit-inner-spin-button { opacity: 0; }
  .date-input-empty::-webkit-calendar-picker-indicator { opacity: 0; }
  
  /* Mostrar el calendar picker cuando hay hover o focus */
  input[type="date"]:hover::-webkit-calendar-picker-indicator,
  input[type="date"]:focus::-webkit-calendar-picker-indicator {
    opacity: 1 !important;
    cursor: pointer;
  }
`;

// ============================================================================
// HOOKS PERSONALIZADOS
// ============================================================================

function useFloatingLabel(ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkValue = () => {
      setHasValue(element.value.length > 0);
    };

    checkValue(); // Verificar valor inicial

    element.addEventListener('input', checkValue);
    element.addEventListener('change', checkValue);

    return () => {
      element.removeEventListener('input', checkValue);
      element.removeEventListener('change', checkValue);
    };
  }, [ref]);

  return {
    isFocused,
    hasValue,
    isFloating: isFocused || hasValue,
    setIsFocused,
    setHasValue
  };
}

function useDateInputStyles(type?: string) {
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
}

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface BaseFloatingInputProps {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  // Props específicas para react-hook-form
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  name?: string;
}

interface FloatingInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange' | 'onBlur'>,
  BaseFloatingInputProps { }

interface FloatingTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'onChange' | 'onBlur'>,
  BaseFloatingInputProps { }

// ============================================================================
// COMPONENTE: FloatingInput
// ============================================================================

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({
    label,
    name,
    type = 'text',
    icon,
    error,
    helperText,
    required = false,
    placeholder,
    id,
    onChange,
    onBlur,
    onFocus,
    className,
    value,
    defaultValue,
    ...props
  }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const { isFocused, hasValue, isFloating, setIsFocused, setHasValue } = useFloatingLabel(internalRef as React.RefObject<HTMLInputElement>);

    useDateInputStyles(type);

    const fieldId = id || name || `floating-input-${Math.random().toString(36).substr(2, 9)}`;

    // Combinar refs de manera segura
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && typeof ref === 'object') {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    // Sincronizar el valor externo (de react-hook-form) con el estado interno
    useEffect(() => {
      if (internalRef.current && value !== undefined) {
        const hasExternalValue = value.toString().length > 0;
        setHasValue(hasExternalValue);
      }
    }, [value, setHasValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (internalRef.current) {
        setHasValue(internalRef.current.value.length > 0);
      }
      // Llamar al onBlur de react-hook-form si existe
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      // Llamar al onChange de react-hook-form si existe
      onChange?.(e);
    };

    // Para inputs tipo date, ocultar placeholder cuando no está flotando
    const shouldHideDatePlaceholder = type === 'date' && !isFocused && !hasValue;

    return (
      <div className={`relative mb-4 ${className || ''}`}>
        <div className="relative">
          {/* Icono */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <div className={`transition-colors duration-200 ${isFocused
                ? 'text-blue-600'
                : error
                  ? 'text-red-400'
                  : 'text-slate-400'
                }`}>
                <div className="h-5 w-5">
                  {icon}
                </div>
              </div>
            </div>
          )}

          {/* Label Flotante */}
          <label
            htmlFor={fieldId}
            className={`
              absolute transition-all duration-200 ease-out pointer-events-none z-10
              ${icon ? 'left-11' : 'left-4'}
              
              ${isFloating
                ? error
                  ? 'top-0 text-xs font-semibold bg-gradient-to-t from-red-50 to-white px-2 -translate-y-1/2'
                  : 'top-0 text-xs font-semibold bg-white px-2 -translate-y-1/2'
                : 'top-1/2 -translate-y-1/2 text-base'
              }

              ${isFocused
                ? 'text-blue-600 '
                : error
                  ? 'text-red-600'
                  : isFloating
                    ? 'text-slate-700'
                    : 'text-slate-500'
              }
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Input */}
          <input
            ref={setRefs}
            type={type}
            id={fieldId}
            name={name}
            placeholder={isFloating ? placeholder : undefined}
            required={required}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
            className={`
              w-full rounded-xl border-2 transition-all duration-200 dark:text-black
              ${icon ? 'pl-11' : 'pl-4'}
              pt-6 pb-2
              pr-4 
              focus:outline-none
              ${error
                ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500'
                : isFocused
                  ? 'border-blue-500 bg-white shadow-lg shadow-blue-100 '
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }
              disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
              ${shouldHideDatePlaceholder ? 'date-input-empty' : ''}
            `}
            style={shouldHideDatePlaceholder ? { color: 'transparent' } : undefined}
          />
        </div>

        {/* Error or Helper Text */}
        <div className="mt-2 flex h-2">
          {(error || helperText) && (
            <div className="flex items-start gap-x-0.5">
              {error ? (
                <>
                  <IconByName name="error" className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </>
              ) : (
                <> <IconByName name="info" className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500">{helperText}</p>
                </>
              )}
            </div>
          )}
        </div>
        {/* Error o Helper Text 
        {(error || helperText) && (
          <div className="mt-2 flex items-start gap-1.5">
            {error ? (
              <>
                <svg className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-slate-500">{helperText}</p>
              </>
            )}
          </div>
        )}
        */}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

// ============================================================================
// COMPONENTE: FloatingTextarea
// ============================================================================

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({
    label,
    name,
    icon,
    error,
    helperText,
    required = false,
    placeholder,
    id,
    rows = 4,
    onChange,
    onBlur,
    onFocus,
    className,
    value,
    defaultValue,
    ...props
  }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const { isFocused, isFloating, setIsFocused, setHasValue } = useFloatingLabel(internalRef as React.RefObject<HTMLTextAreaElement>);

    const fieldId = id || name || `floating-textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Combinar refs de manera segura
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && typeof ref === 'object') {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref]
    );

    // Sincronizar el valor externo (de react-hook-form) con el estado interno
    useEffect(() => {
      if (internalRef.current && value !== undefined) {
        const hasExternalValue = value.toString().length > 0;
        setHasValue(hasExternalValue);
      }
    }, [value, setHasValue]);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (internalRef.current) {
        setHasValue(internalRef.current.value.length > 0);
      }
      // Llamar al onBlur de react-hook-form si existe
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0);
      // Llamar al onChange de react-hook-form si existe
      onChange?.(e);
    };

    return (
      <div className={`relative ${className || ''}`}>
        <div className="relative">
          {/* Icono */}
          {icon && (
            <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none z-10">
              <div className={`transition-colors duration-200 ${isFocused
                ? 'text-blue-600'
                : error
                  ? 'text-red-400'
                  : 'text-slate-400'
                }`}>
                <div className="h-5 w-5">
                  {icon}
                </div>
              </div>
            </div>
          )}

          {/* Label Flotante */}
          <label
            htmlFor={fieldId}
            className={`
              absolute transition-all duration-200 ease-out pointer-events-none z-10
              ${icon ? 'left-11' : 'left-4'}
              ${isFloating
                ? 'top-0 text-xs font-semibold bg-white px-2 -translate-y-1/2'
                : 'top-3.5 text-base'
              }
              ${isFocused
                ? 'text-blue-600'
                : error
                  ? 'text-red-600'
                  : isFloating
                    ? 'text-slate-700'
                    : 'text-slate-500'
              }
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Textarea */}
          <textarea
            ref={setRefs}
            id={fieldId}
            name={name}
            placeholder={isFloating ? placeholder : undefined}
            required={required}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
            className={`
              w-full rounded-xl border-2 transition-all duration-200 resize-vertical
              ${icon ? 'pl-11' : 'pl-4'}
              pt-6 pb-2
              pr-4 text-base
              focus:outline-none
              ${error
                ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500'
                : isFocused
                  ? 'border-blue-500 bg-white shadow-lg shadow-blue-100'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }
              disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            `}
          />
        </div>

        {/* Error o Helper Text */}
        {(error || helperText) && (
          <div className="mt-2 flex items-start gap-1.5">
            {error ? (
              <>
                <IconByName name="error" className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </>
            ) : (
              <>
                <IconByName name="info" className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-500">{helperText}</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';

// ============================================================================
// COMPONENTE: FloatingPassword (con toggle de visibilidad)
// ============================================================================

export const FloatingPassword = forwardRef<HTMLInputElement, FloatingInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);

    // Combinar refs de manera segura
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && typeof ref === 'object') {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    return (
      <div className="relative">
        <FloatingInput
          {...props}
          ref={setRefs}
          type={showPassword ? 'text' : 'password'}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 z-20"
          tabIndex={-1}
        >
          {showPassword ? (
            <IconByName name="eyeOpen" className="w-5 h-5" />
          ) : (
            <IconByName name="eyeClosed" className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }
);

FloatingPassword.displayName = 'FloatingPassword';

// ============================================================================
// HOOK DE CONVENIENCIA PARA REACT-HOOK-FORM
// ============================================================================

interface UseFloatingFieldOptions {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  validate?: (value: unknown) => boolean | string;
}

export function useFloatingField(options: UseFloatingFieldOptions = {}) {
  return {
    required: options.required,
    pattern: options.pattern,
    minLength: options.minLength,
    maxLength: options.maxLength,
    min: options.min,
    max: options.max,
    validate: options.validate,
  };
}

// ============================================================================
// DEMO DE USO CON REACT-HOOK-FORM
// ============================================================================

import { useForm } from 'react-hook-form';

interface FormData {
  email: string;
  password: string;
  nombre: string;
  fecha: string;
  comentarios: string;
}

export function FloatingInputFormDemo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Datos del formulario:', data);
    // Aquí puedes enviar los datos a tu API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Iniciar Sesión</h1>
            <p className="text-slate-600">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FloatingInput
              label="Correo Electrónico"
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              error={errors.email?.message}
              required
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <FloatingPassword
              label="Contraseña"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'Mínimo 8 caracteres',
                },
              })}
              error={errors.password?.message}
              helperText="Mínimo 8 caracteres"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <FloatingInput
              label="Nombre Completo"
              {...register('nombre', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 3,
                  message: 'Mínimo 3 caracteres',
                },
              })}
              error={errors.nombre?.message}
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <FloatingInput
              label="Fecha de Nacimiento"
              type="date"
              {...register('fecha', {
                required: 'La fecha es requerida',
              })}
              error={errors.fecha?.message}
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />

            <FloatingTextarea
              label="Comentarios"
              rows={4}
              {...register('comentarios')}
              error={errors.comentarios?.message}
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              }
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => reset()}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-3.5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT POR DEFECTO (versión sin react-hook-form para compatibilidad)
// ============================================================================

export default function FloatingInputDemo() {
  return <FloatingInputFormDemo />;
}