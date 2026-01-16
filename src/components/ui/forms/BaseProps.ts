
import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string | React.ReactNode;
  required?: boolean;
  className?: string;
}

export interface InputTextProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>, BaseInputProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export interface InputSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>, BaseInputProps {
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export interface InputCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'>, BaseInputProps {
  labelClassName?: string;
}

export interface InputTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>, BaseInputProps {
  maxLength?: number;
  showCount?: boolean;
}

export interface InputFileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'>, BaseInputProps {
  acceptedFormats?: string;
  maxSize?: number; // en MB
  preview?: boolean;
}
