import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

/** Skeleton de la matriz de permisos (filas × columnas). */
export default function PermissionTableSkeleton({
  rows = 8,
  cols = 5,
  label = "Cargando permisos",
}: {
  rows?: number;
  cols?: number;
  label?: string;
}) {
  return (
    <div
      className="w-full max-w-full animate-pulse overflow-x-auto overscroll-x-contain rounded-lg border border-border [-webkit-overflow-scrolling:touch]"
      aria-busy="true"
      aria-label={label}
    >
      <table className="min-w-[36rem] w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted">
            <th className="sticky left-0 z-10 bg-surface-muted px-3 py-2.5 text-left">
              <div className="flex items-center gap-2">
                <SkeletonBone className="h-4 w-4 rounded" />
                <SkeletonBone className="h-3 w-12" />
              </div>
            </th>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-2 py-2.5">
                <div className="flex flex-col items-center gap-1.5">
                  <SkeletonBone className="h-4 w-4 rounded" />
                  <SkeletonBone className="h-3 w-10" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface-elevated">
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              <td className="sticky left-0 z-10 bg-surface-elevated px-3 py-2">
                <div className="flex items-center gap-2">
                  <SkeletonBone className="h-4 w-4 rounded" />
                  <SkeletonBone className="h-4 w-28 max-w-full" />
                </div>
              </td>
              {Array.from({ length: cols }).map((_, col) => (
                <td key={col} className="px-2 py-2">
                  <div className="flex justify-center">
                    <SkeletonBone className="h-4 w-4 rounded" />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
