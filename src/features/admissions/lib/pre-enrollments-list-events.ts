type Listener = () => void;

const listeners = new Set<Listener>();

/** Avisa a la lista (soft-mounted bajo el modal) que debe volver a cargar. */
export function notifyPreEnrollmentsListChanged() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore listener errors */
    }
  });
}

export function subscribePreEnrollmentsListChanged(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
