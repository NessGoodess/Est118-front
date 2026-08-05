type Listener = () => void;

const listeners = new Set<Listener>();

/** Avisa a la lista (soft-mounted bajo el modal) que debe volver a cargar. */
export function notifyUsersListChanged() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore listener errors */
    }
  });
}

export function subscribeUsersListChanged(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
