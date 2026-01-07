import { AuthEvent } from './auth-event';

type AuthEventHandler = (payload?: unknown) => void;

class AuthEventBus {
  private listeners: Map<AuthEvent, Set<AuthEventHandler>> = new Map();

  on(event: AuthEvent, handler: AuthEventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: AuthEvent, handler: AuthEventHandler) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: AuthEvent, payload?: unknown) {
    this.listeners.get(event)?.forEach(handler => handler(payload));
  }
}

export const authEventBus = new AuthEventBus();
