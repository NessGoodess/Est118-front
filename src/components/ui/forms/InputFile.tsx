import React, { useState, forwardRef } from 'react';
import Image from 'next/image';
import { InputFileProps } from './BaseProps';
import {
  fieldErrorIconClass,
  fieldErrorTextClass,
  fieldHelperClass,
  fieldInfoIconClass,
  fieldLabelClass,
  fieldRequiredClass,
} from './fieldStyles';

export const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ label, error, helperText, required, acceptedFormats, maxSize, preview, className, ...props }, ref) => {
    const [fileName, setFileName] = useState<string>('');
    const [filePreview, setFilePreview] = useState<string>('');
    const hasError = !!error;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);

        if (preview && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
      props.onChange?.(e);
    };

    return (
      <div className={`w-full ${className ?? ''}`}>
        {label && (
          <label className={fieldLabelClass}>
            {label}
            {required && <span className={fieldRequiredClass}>*</span>}
          </label>
        )}

        <div
          className={`
            relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 text-foreground
            ${
              hasError
                ? 'border-danger/40 bg-danger/5'
                : 'border-border bg-surface-muted hover:border-primary hover:bg-primary-soft'
            }
          `}
        >
          <input
            ref={ref}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            {...props}
          />

          <div className="text-center">
            {filePreview ? (
              <div className="mb-4">
                <Image
                  src={filePreview}
                  alt="Preview"
                  width={160}
                  height={160}
                  className="max-h-40 mx-auto rounded-lg shadow-md"
                />
              </div>
            ) : (
              <svg
                className={`w-12 h-12 mx-auto mb-3 ${hasError ? 'text-danger' : 'text-fg-muted'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}

            {fileName ? (
              <p className="text-sm font-medium text-foreground mb-1">{fileName}</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Haz clic para cargar o arrastra el archivo
                </p>
                {acceptedFormats && (
                  <p className="text-xs text-fg-muted mb-1">
                    Formatos aceptados: {acceptedFormats}
                  </p>
                )}
                {maxSize && (
                  <p className="text-xs text-fg-muted">Tamaño máximo: {maxSize} MB</p>
                )}
              </>
            )}
          </div>
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

InputFile.displayName = 'InputFile';
