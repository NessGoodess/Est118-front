//app/(private)/admissions/loading.tsx
"use client"
import { useEffect, useState } from "react";

export default function PreEnrollmentsLoading() {
  const [isMobile, setIsmobile] = useState(false);
  const length = 10;
  const length2 = 3;

  useEffect(() => {
    const checkMobile = () => {
      setIsmobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="animate-pulse md:mt-4 mt-2 ">
      <div className="h-8 md:w-64 w-40 bg-surface-elevated rounded md:mb-6 mb-4"></div>

      {/* Búsqueda skeleton */}
      <div className="max-w-full mb-4 flex justify-between">
        <div className="max-w-md md:w-full w-52 h-10 bg-surface-elevated rounded-lg md:mb-6 mb-2"></div>
        <div className="h-10 flex gap-2 left-0 justify-end">
          <div className="md:w-30 w-20 bg-surface-elevated rounded-lg "></div>
          <div className="md:w-30 w-10 bg-surface-elevated rounded-lg"></div>
        </div>
      </div>

      {/* Tabla skeleton */}
      <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-surface-muted border-b border-border md:px-4 px-2 md:py-3 py-2">
          <div className="flex gap-4">
            {Array.from({ length: isMobile ? length2 : length }).map((_, index) => (
              <div key={index} className="h-4 w-24 bg-loading-base rounded"></div>
            ))}

          </div>
        </div>

        {/* Filas */}
        <div className="divide-y divide-border">
          {[...Array(length)].map((_, i) => (
            <div key={i} className="px-4 md:py-3 py-2">
              <div className="flex gap-4">
                {Array.from({ length: isMobile ? length2 : length }).map((_, index) => (
                  <div key={index} className="h-6 w-24 bg-surface-muted rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}