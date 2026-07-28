// components/ui/AdvancedTable.tsx
import React from "react";

export type Column<T = Record<string, unknown>> = {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  valueType?: 'string' | 'number' | 'boolean' | 'object' | 'unknown';
};

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField?: string;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
}

export default function AdvancedTable<T>({
  data,
  columns,
  keyField = "id",
  emptyMessage = "No hay datos para mostrar",
  className = "",
  onRowClick
}: TableProps<T>) {

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-fg-muted bg-surface-elevated rounded-lg border border-border">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto bg-surface-elevated rounded-lg border border-border ${className}`}>
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-surface-muted">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider ${column.align === 'center' ? 'text-center' :
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-surface-elevated divide-y divide-border">
          {data.map((row, index) => (
            <tr
              key={(row as Record<string, unknown>)[keyField] as string || index}
              onClick={() => onRowClick?.(row, index)}
              className={onRowClick ? "cursor-pointer hover:bg-surface-muted transition-colors" : ""}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-foreground ${column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                >
                  {column.render
                    ? column.render((row as Record<string, unknown>)[column.key], row, index)
                    : String((row as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
