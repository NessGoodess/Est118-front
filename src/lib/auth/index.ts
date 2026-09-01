/**
 * Auth module — Sanctum session + auth event bus.
 */
export {
  getCsrfCookie,
  login,
  logout,
  getCurrentUser,
  checkAuth,
  formatAuthError,
} from './session';

export { AuthEvent } from './events';
export { authEventBus } from './event-bus';
export {
  buildLoginUrl,
  safeRedirectPath,
  currentReturnPath,
} from './login-redirect';
export {
  markHadSession,
  clearHadSession,
  hadSessionHint,
} from './session-hint';
