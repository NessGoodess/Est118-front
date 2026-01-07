import { ToastProps } from '@/components/private/toast/Toast';

type ToastType = 'success' | 'error' | 'warning';

interface GlobalToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

class GlobalToastManager {
  private listeners: Set<(toast: ToastProps) => void> = new Set();

  // Suscribirse a nuevos toasts
  subscribe(listener: (toast: ToastProps) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notificar a todos los listeners
  private notify(options: GlobalToastOptions & { type: ToastType }) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastProps = {
      id,
      type: options.type,
      title: options.title,
      message: options.message,
      duration: options.duration || 5000,
      onClose: () => {} // Se manejará en el contexto
    };

    this.listeners.forEach(listener => listener(toast));
  }

  // Métodos públicos
  success(title: string, message?: string, duration?: number) {
    this.notify({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number) {
    this.notify({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number) {
    this.notify({ type: 'warning', title, message, duration });
  }
}

// Instancia global
export const globalToast = new GlobalToastManager();
