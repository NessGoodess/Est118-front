
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: string | ((value: any, row: T) => React.ReactNode);
}

export interface TableAction<T = any> {
  label: string;
  icon?: string;
  onClick: (row: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  show?: (row: T) => boolean;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  itemsPerPage?: number;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
}

export interface DataTableProps<T extends Record<string, any>> {
  config: TableConfig<T>;
  data: T[];
  renderers?: Record<string, (value: any, row?: T) => React.ReactNode>;
  icons?: Record<string, React.ReactNode>;
  onSelectionChange?: (selected: T[]) => void;
  emptyMessage?: string;
  loading?: boolean;
}