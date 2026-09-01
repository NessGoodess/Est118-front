/**
 * Helpers for post-login return URLs and the session-expired notice on /login.
 */

export type LoginReason = 'expired';

/** Rejects open redirects and auth routes. */
export function safeRedirectPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
  if (path === '/login' || path.startsWith('/login?') || path.startsWith('/login/')) {
    return null;
  }
  return path;
}

export function buildLoginUrl(options: {
  reason?: LoginReason;
  redirect?: string | null;
} = {}): string {
  const params = new URLSearchParams();
  if (options.reason) params.set('reason', options.reason);
  const redirect = safeRedirectPath(options.redirect ?? null);
  if (redirect) params.set('redirect', redirect);
  const qs = params.toString();
  return qs ? `/login?${qs}` : '/login';
}

/** Path + query to return to after re-authenticating. */
export function currentReturnPath(pathname: string, search = ''): string {
  return `${pathname}${search}`;
}
