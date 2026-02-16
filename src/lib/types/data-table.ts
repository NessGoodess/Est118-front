
export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: string | ((value: unknown, row: T) => React.ReactNode);
}

export interface TableAction<T = unknown> {
  label: string;
  icon?: string;
  onClick?: (row: T) => void;
  href?: (row: T) => string;
  variant?: 'primary' | 'secondary' | 'danger';
  show?: (row: T) => boolean;
}

export interface TableConfig<T = unknown> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  itemsPerPage?: number;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
}
export interface EnhancedTableConfig<T> extends TableConfig<T> {
  features?: {
    rowClickable?: boolean;
    rowClickRoute?: (item: T) => string;
    selectionEnabled?: boolean;
    batchActions?: Array<{
      label: string;
      icon?: string;
      action: (items: T[]) => void;
    }>;
  };
}

export interface DataTableProps<T> {
  config: TableConfig<T> | EnhancedTableConfig<T>;
  data: T[];
  renderers?: Record<string, (value: unknown, row?: T) => React.ReactNode>;
  icons?: Record<string, React.ReactNode>;
  onSelectionChange?: (selected: T[]) => void;
  emptyMessage?: string;
  loading?: boolean;
  minRows?: number;
  onRowClick?: (item: T) => void;
  exportable?: boolean;
  exportFunction?: () => void;
}