/** Shared token-based styles for form controls */

export const fieldLabelClass =
  'block text-sm font-semibold text-foreground mb-2';

export const fieldRequiredClass = 'text-danger ml-1';

export const fieldIconClass =
  'absolute top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none';

export const fieldHelperClass = 'text-sm text-fg-muted';

export const fieldErrorTextClass = 'text-sm text-danger font-medium';

export const fieldErrorIconClass =
  'w-4 h-4 text-danger flex-shrink-0 mt-0.5';

export const fieldInfoIconClass =
  'w-4 h-4 text-fg-muted flex-shrink-0 mt-0.5';

export function fieldControlClass({
  hasError,
  isFocused,
  extra = '',
}: {
  hasError: boolean;
  isFocused: boolean;
  extra?: string;
}): string {
  const state = hasError
    ? 'border-danger/40 bg-danger/5 text-danger placeholder:text-danger/50 focus:border-danger focus:ring-4 focus:ring-danger/15'
    : isFocused
      ? 'border-ring bg-surface-elevated shadow-md focus:ring-4 focus:ring-primary-soft'
      : 'border-border bg-surface-elevated hover:border-fg-muted/50';

  return [
    'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-foreground',
    'focus:outline-none',
    'disabled:bg-surface-muted disabled:text-fg-muted disabled:cursor-not-allowed',
    state,
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}
