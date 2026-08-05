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
    disabled,
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

    const shellBg = disabled
      ? 'border-border bg-surface-muted'
      : error
        ? 'border-danger/40 bg-surface-elevated'
        : isFocused
          ? 'border-ring bg-surface-elevated shadow-md shadow-primary-soft'
          : 'border-border bg-surface-elevated hover:border-fg-muted/50';

    return (
      <div className={`relative mb-3 ${className || ''}`}>
        {/* Shell: border + bg viven aquí para que el label herede el mismo fondo */}
        <div className={`relative rounded-xl border-2 transition-all duration-200 ${shellBg}`}>
          {/* Icono */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <div className={`transition-colors duration-200 ${isFocused
                ? 'text-primary'
                : error
                  ? 'text-danger'
                  : 'text-fg-muted'
                }`}>
                <div className="h-4 w-4">
                  {icon}
                </div>
              </div>
            </div>
          )}

          {/* Label Flotante — bg-inherit corta el borde sin color fijo */}
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

          {/* Input */}
          <input
            ref={setRefs}
            type={type}
            id={fieldId}
            name={name}
            placeholder={isFloating ? placeholder : undefined}
            required={required}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
            className={`
              w-full bg-transparent rounded-xl border-0 transition-colors duration-200 text-sm text-foreground
              ${icon ? 'pl-9' : 'pl-3'}
              pt-4 pb-1.5 pr-3
              focus:outline-none
              ${error ? 'text-danger placeholder:text-danger/50' : ''}
              disabled:text-fg-muted disabled:cursor-not-allowed
              ${shouldHideDatePlaceholder ? 'date-input-empty' : ''}
            `}
            style={shouldHideDatePlaceholder ? { color: 'transparent' } : undefined}
          />
        </div>

        {/* Error or Helper Text */}
        <div className="mt-1.5 flex min-h-4">
          {(error || helperText) && (
            <div className="flex items-start gap-x-0.5">
              {error ? (
                <>
                  <IconByName name="error" className="w-3 h-3 text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-danger font-medium">{error}</p>
                </>
              ) : (
                <>
                  <IconByName name="info" className="w-3 h-3 text-fg-muted flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-fg-muted">{helperText}</p>
                </>
              )}
            </div>
          )}
        </div>
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
    disabled,
    ...props
  }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const { isFocused, isFloating, setIsFocused, setHasValue } = useFloatingLabel(internalRef as React.RefObject<HTMLTextAreaElement>);

    const fieldId = id || name || `floating-textarea-${Math.random().toString(36).substr(2, 9)}`;

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
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0);
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
      <div className={`relative mb-3 ${className || ''}`}>
        <div className={`relative rounded-xl border-2 transition-all duration-200 ${shellBg}`}>
          {icon && (
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
              <div className={`transition-colors duration-200 ${isFocused
                ? 'text-primary'
                : error
                  ? 'text-danger'
                  : 'text-fg-muted'
                }`}>
                <div className="h-4 w-4">
                  {icon}
                </div>
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
                : 'top-3 text-sm'
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

          <textarea
            ref={setRefs}
            id={fieldId}
            name={name}
            placeholder={isFloating ? placeholder : undefined}
            required={required}
            disabled={disabled}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
            className={`
              w-full bg-transparent rounded-xl border-0 transition-colors duration-200 resize-vertical text-sm text-foreground
              ${icon ? 'pl-9' : 'pl-3'}
              pt-4 pb-1.5 pr-3
              focus:outline-none
              ${error ? 'text-danger placeholder:text-danger/50' : ''}
              disabled:text-fg-muted disabled:cursor-not-allowed
            `}
          />
        </div>

        <div className="mt-1.5 flex min-h-4">
          {(error || helperText) && (
            <div className="flex items-start gap-x-0.5">
              {error ? (
                <>
                  <IconByName name="error" className="w-3 h-3 text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-danger font-medium">{error}</p>
                </>
              ) : (
                <>
                  <IconByName name="info" className="w-3 h-3 text-fg-muted flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-fg-muted">{helperText}</p>
                </>
              )}
            </div>
          )}
        </div>
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
          className="absolute right-2.5 top-5 -translate-y-1/2 text-fg-muted hover:text-foreground transition-colors p-1 z-20"
          tabIndex={-1}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <IconByName name="eyeOpen" className="w-4 h-4" />
          ) : (
            <IconByName name="eyeClosed" className="w-4 h-4" />
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
  validate?: (value: string) => boolean | string;
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
    <div className="min-h-screen bg-surface-app p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-surface-elevated rounded-3xl shadow-card border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
            <p className="text-fg-muted">Ingresa tus credenciales para continuar</p>
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
                className="flex-1 border-2 border-border text-foreground py-3.5 rounded-xl font-bold text-lg hover:bg-surface-muted transition-all"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all shadow-card hover:scale-[1.02] active:scale-[0.98]"
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