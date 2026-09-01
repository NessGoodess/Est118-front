/**
 * Remembers that this browser tab once had a valid session.
 *
 * Used to tell "session expired" apart from "never logged in" on bootstrap 401,
 * when the session cookie is not visible to Next middleware (local dev).
 */
const SESSION_HINT_KEY = 'est118-had-session';

export function markHadSession(): void {
  try {
    sessionStorage.setItem(SESSION_HINT_KEY, '1');
  } catch {
    /* private mode / SSR */
  }
}

export function clearHadSession(): void {
  try {
    sessionStorage.removeItem(SESSION_HINT_KEY);
  } catch {
    /* ignore */
  }
}

export function hadSessionHint(): boolean {
  try {
    return sessionStorage.getItem(SESSION_HINT_KEY) === '1';
  } catch {
    return false;
  }
}
