interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
  selectable?: boolean;
  hasActions?: boolean;
}

export default function DataTableSkeleton({
  columnCount,
  rowCount = 8,
  selectable = false,
  hasActions = false,
}: DataTableSkeletonProps) {
  const cols = Math.max(columnCount, 1);

  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse" aria-hidden={rowIndex > 0}>
          {selectable && (
            <td className="px-2 md:px-4 py-2 md:py-3">
              <div className="h-3 w-3 md:h-4 md:w-4 rounded-lg bg-surface-panel" />
            </td>
          )}
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="px-1 py-2 md:px-2 md:py-3">
              <div
                className="h-4 rounded-lg bg-surface-panel"
                style={{ width: `${55 + ((rowIndex + colIndex) % 4) * 10}%` }}
              />
            </td>
          ))}
          {hasActions && (
            <td className="px-1 py-2 md:px-2 md:py-3">
              <div className="ml-auto flex justify-end gap-2">
                <div className="h-7 w-7 rounded-lg bg-surface-panel" />
                <div className="h-7 w-7 rounded-lg bg-surface-panel" />
              </div>
            </td>
          )}
        </tr>
      ))}
      <tr className="sr-only">
        <td colSpan={cols + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}>Cargando tabla…</td>
      </tr>
    </>
  );
}
