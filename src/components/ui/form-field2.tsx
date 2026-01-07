


"use client";

import React, { useState, useRef, useEffect } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  id?: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  id,
  icon,
  error,
  required = false,
  value: controlledValue,
  defaultValue,
  onChange,
  onBlur: externalOnBlur,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = id || name;

  // Determinar si el campo tiene valor (para controlled y uncontrolled)
  useEffect(() => {
    if (inputRef.current) {
      const currentValue = controlledValue !== undefined 
        ? controlledValue 
        : inputRef.current.value || defaultValue || '';
      setHasValue(currentValue.length > 0);
    } else if (defaultValue || controlledValue) {
      // Si hay un valor por defecto o controlado, el label debe flotar
      setHasValue((defaultValue || controlledValue || '').length > 0);
    }
  }, [controlledValue, defaultValue]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputRef.current) {
      setHasValue(inputRef.current.value.length > 0);
    }
    if (externalOnBlur) {
      externalOnBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (onChange) {
      onChange(e);
    }
  };

  const isLabelFloating = isFocused || hasValue;
  const displayPlaceholder = !isLabelFloating ? placeholder : undefined;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className="text-gray-400">
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
              ? 'top-0 text-xs text-blue-600 font-semibold bg-white px-1.5 -translate-y-1/2 scale-100'
              : 'top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500 scale-100'
          } ${isFocused && !isLabelFloating ? 'text-blue-600' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <input
          ref={inputRef}
          type={type}
          id={fieldId}
          name={name}
          value={controlledValue}
          defaultValue={defaultValue}
          placeholder={displayPlaceholder}
          autoComplete={autoComplete}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`w-full ${
            icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'
          } ${
            isLabelFloating ? 'pt-5 sm:pt-6 pb-2 sm:pb-2.5' : 'py-2.5 sm:py-3'
          } pr-3 sm:pr-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  id?: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  rows?: number;
}

export function TextAreaField({
  label,
  name,
  placeholder,
  id,
  icon,
  error,
  required = false,
  value: controlledValue,
  defaultValue,
  onChange,
  onBlur: externalOnBlur,
  rows = 4,
}: TextAreaFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = id || name;

  // Determinar si el campo tiene valor (para controlled y uncontrolled)
  useEffect(() => {
    if (textareaRef.current) {
      const currentValue = controlledValue !== undefined 
        ? controlledValue 
        : textareaRef.current.value || defaultValue || '';
      setHasValue(currentValue.length > 0);
    } else if (defaultValue || controlledValue) {
      // Si hay un valor por defecto o controlado, el label debe flotar
      setHasValue((defaultValue || controlledValue || '').length > 0);
    }
  }, [controlledValue, defaultValue]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (textareaRef.current) {
      setHasValue(textareaRef.current.value.length > 0);
    }
    if (externalOnBlur) {
      externalOnBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    if (onChange) {
      onChange(e);
    }
  };

  const isLabelFloating = isFocused || hasValue;
  const displayPlaceholder = !isLabelFloating ? placeholder : undefined;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative">
        {icon && (
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
            <div className="text-gray-400">
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
              ? 'top-0 text-xs text-blue-600 font-semibold bg-white px-1.5 -translate-y-1/2 scale-100'
              : 'top-3 text-sm sm:text-base text-gray-500 scale-100'
          } ${isFocused && !isLabelFloating ? 'text-blue-600' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <textarea
          ref={textareaRef}
          id={fieldId}
          name={name}
          value={controlledValue}
          defaultValue={defaultValue}
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
          } pr-3 sm:pr-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm resize-vertical ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectFieldOption[];
  placeholder?: string;
  id?: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
}

export function SelectField({
  label,
  name,
  options,
  placeholder = "Selecciona...",
  id,
  icon,
  error,
  required = false,
  value: controlledValue,
  defaultValue,
  onChange,
  onBlur: externalOnBlur,
}: SelectFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const fieldId = id || name;

  // Determinar si el campo tiene valor (para controlled y uncontrolled)
  useEffect(() => {
    if (selectRef.current) {
      const currentValue = controlledValue !== undefined 
        ? controlledValue 
        : selectRef.current.value || defaultValue || '';
      setHasValue(currentValue.length > 0 && currentValue !== '');
    } else if (defaultValue || controlledValue) {
      setHasValue((defaultValue || controlledValue || '').length > 0 && (defaultValue || controlledValue) !== '');
    }
  }, [controlledValue, defaultValue]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (selectRef.current) {
      setHasValue(selectRef.current.value.length > 0 && selectRef.current.value !== '');
    }
    if (externalOnBlur) {
      externalOnBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasValue(e.target.value.length > 0 && e.target.value !== '');
    if (onChange) {
      onChange(e);
    }
  };

  const isLabelFloating = isFocused || hasValue;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className="text-gray-400">
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
              ? 'top-0 text-xs text-blue-600 font-semibold bg-white px-1.5 -translate-y-1/2 scale-100'
              : 'top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500 scale-100'
          } ${isFocused && !isLabelFloating ? 'text-blue-600' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <select
          ref={selectRef}
          id={fieldId}
          name={name}
          value={controlledValue}
          defaultValue={defaultValue}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`w-full ${
            icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'
          } ${
            isLabelFloating ? 'pt-5 sm:pt-6 pb-2 sm:pb-2.5' : 'py-2.5 sm:py-3'
          } pr-8 sm:pr-10 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm appearance-none ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Flecha del select */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
