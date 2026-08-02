"use client"

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { IconByName } from '@/components/ui/icons/global.icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footerActions?: boolean;
  footerActionsContent?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'min-h-dvh';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  footerActionsContent,
  maxWidth = '2xl'
}: ModalProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '8xl': 'max-w-8xl',
    'min-h-dvh': 'min-h-dvh',
  };

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-modal-overlay transition-opacity" />

      {/* Modal — margen con padding; altura del panel = viewport − márgenes */}
      <div className="flex max-h-dvh min-h-dvh items-center justify-center p-3 sm:p-4 md:p-6">
        <div
          className={`relative flex max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-3rem)] w-full flex-col overflow-hidden rounded-xl border border-border bg-modal-bg/30 text-foreground shadow-card backdrop-blur-sm transform transition-all ${maxWidthClasses[maxWidth]}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-md font-semibold text-brand-strong md:text-xl">{title}</h2>
              <Button
                variant="ghost"
                onClick={onClose}
                aria-label="Cerrar"
              >
                <IconByName name="x" className="w-6 h-6" />
              </Button>
            </div>
          )}

          {/* Content — scroll interno; header/footer fijos */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 md:px-6 md:py-6">
            {children}
          </div>
          {footerActions && (
            <div className="flex shrink-0 items-center justify-end border-t border-border px-4 py-4">
              {footerActionsContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

