// ============================================================================
// HOOK DE REACT (OPCIONAL)
// ============================================================================

import { useState, useEffect } from 'react';
import { formatRelative } from './dateFormatter';

/**
 * Hook para fechas relativas que se actualizan automáticamente
 */
export function useRelativeDate(date: Date | string, updateInterval = 60000) {
  const [formattedDate, setFormattedDate] = useState(() => formatRelative(date));

  useEffect(() => {
    const timer = setInterval(() => {
      setFormattedDate(formatRelative(date));
    }, updateInterval);

    return () => clearInterval(timer);
  }, [date, updateInterval]);

  return formattedDate;
}
