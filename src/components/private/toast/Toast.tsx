'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-success/15 border-success border-2 text-success',
          icon: 'text-success',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'error':
        return {
          container: 'bg-danger/15 border-danger border-2 text-danger',
          icon: 'text-danger',
          iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'warning':
        return {
          container: 'bg-warning/15 border-warning border-2 text-warning-foreground',
          icon: 'text-warning-foreground',
          iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
        };
      default:
        return {
          container: 'bg-primary-soft border-primary border-2 text-primary',
          icon: 'text-primary',
          iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 0.95, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        relative flex items-start p-4 mb-4 rounded-lg shadow-card max-w-md w-full
        backdrop-blur-sm
        ${styles.container}
      `}
    >
      <div className={`flex-shrink-0 ${styles.icon}`}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
        </svg>
      </div>

      <div className="ml-3 flex-1">
        <h3 className="text-md font-semibold">
          {title}
        </h3>
        {message && (
          <p className="mt-1 text-sm opacity-90">
            {message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-4 text-fg-muted hover:text-foreground focus:outline-none transition-colors hover:bg-surface-muted/50 rounded-full p-1"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

export default Toast;
