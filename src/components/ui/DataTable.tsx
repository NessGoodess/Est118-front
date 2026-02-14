import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { TableColumn, DataTableProps, TableConfig, EnhancedTableConfig } from "@/lib/types/data-table";
import { useRouter } from "next/navigation";

export function DataTable<T>({
    config,
    data,
    renderers = {},
    icons = {},
    onSelectionChange,
    onRowClick,
    emptyMessage = 'No hay datos',
    loading = false,
    minRows = 10,
}: DataTableProps<T> & { config: TableConfig<T> | EnhancedTableConfig<T> }) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [itemsPerPageSelected, setItemsPerPageSelected] = useState<number>(10);


    const {
        columns,
        actions = [],
        itemsPerPage = 10,
        searchable = true,
        sortable = true,
        selectable = false,
    } = config;

    // Initialize items per page
    useEffect(() => {
        setItemsPerPageSelected(itemsPerPage);
    }, [itemsPerPage]);

    // Initialize visible columns
    useEffect(() => {
        if (visibleColumns.size === 0) {
            setVisibleColumns(new Set(columns.map(col => String(col.key))));
        }
    }, [columns, visibleColumns.size]);

    // Get visible columns
    const visibleColumnsList = useMemo(() => {
        return columns.filter(col => visibleColumns.has(String(col.key)));
    }, [columns, visibleColumns]);

    // Search
    const searchableColumns = columns.filter(col => col.searchable !== false);
    const filteredData = useMemo(() => {
        if (!searchQuery || !searchable) return data;

        return data.filter(row =>
            searchableColumns.some(col => {
                const value = row[col.key as keyof T];
                return String(value).toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, searchableColumns, searchable]);

    // Sort
    const sortedData = useMemo(() => {
        if (!sortConfig || !sortable) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, sortable]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPageSelected);
    const startIndex = (currentPage - 1) * itemsPerPageSelected;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPageSelected);

    // Reset to page 1 when items per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPageSelected]);

    // Add empty rows if needed
    const displayData = useMemo(() => {
        const rows = [...paginatedData];
        const emptyRowsNeeded = Math.max(0, minRows - rows.length);
        for (let i = 0; i < emptyRowsNeeded; i++) {
            rows.push(null as unknown as T);
        }
        return rows;
    }, [paginatedData, minRows]);

    // Handlers
    const handleSort = (key: keyof T) => {
        if (!sortable) return;

        setSortConfig(current => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        const newSelection = checked ? [...paginatedData] : [];
        setSelectedRows(newSelection);
        onSelectionChange?.(newSelection);
    };

    const handleSelectRow = (row: T, checked: boolean) => {
        const newSelection = checked
            ? [...selectedRows, row]
            : selectedRows.filter(r => r !== row);
        setSelectedRows(newSelection);
        onSelectionChange?.(newSelection);
    };

    const isRowSelected = (row: T) => selectedRows.includes(row);
    const allSelected = paginatedData.length > 0 && paginatedData.every(row => isRowSelected(row));

    const handleRowClick = (row: T, e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const enhancedConfig = config as EnhancedTableConfig<T>;

        if (target.closest('button') || target.closest('input[type="checkbox"]') || target.closest('a')) {
            return;
        }
        if (enhancedConfig.features?.rowClickable && enhancedConfig.features.rowClickRoute) {
            router.push(enhancedConfig.features.rowClickRoute(row));
        } else if (onRowClick) {
            onRowClick(row);
        }
    };

    const toggleColumn = (columnKey: string) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnKey)) {
                newSet.delete(columnKey);
            } else {
                newSet.add(columnKey);
            }
            return newSet;
        });
    };

    // Function to render cells
    const renderCell = (value: unknown, row: T, column: TableColumn<T>) => {
        if (column.render) {
            if (typeof column.render === 'string') {
                // Use renderer by name
                const renderer = renderers[column.render];
                if (renderer) {
                    return renderer(value, row);
                }
            } else if (typeof column.render === 'function') {
                // Use custom render function
                return column.render(value, row);
            }
        }
        return String(value ?? '-');
    };

    // Function to get icon
    const getIcon = (iconName?: string) => {
        if (!iconName) return null;
        return icons[iconName] || (
            <span className="text-xs">[{iconName}]</span>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header with search and column toggle */}
            <div className="flex items-center justify-between gap-4">
                {searchable && (
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                        <label className="hidden md:block text-sm text-slate-600 ">Mostrar:</label>
                        <select
                            value={itemsPerPageSelected}
                            aria-label="Mostrar"
                            onChange={(e) => setItemsPerPageSelected(Number(e.target.value))}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>150+</option>
                        </select>
                    </div>

                    {/* Column visibility toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowColumnMenu(!showColumnMenu)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-5 h-5 text-slate-600 hover:text-blue-900" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 5h8" /><path d="M13 12h8" /><path d="M13 19h8" /><path d="m3 17 2 2 4-4" /><rect x="3" y="4" width="6" height="6" rx="1" />
                            </svg>
                            <span className="hidden md:block text-sm text-slate-700">Columnas</span>
                        </button>

                        {showColumnMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowColumnMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                                    <div className="p-2">
                                        {columns.map((column) => {
                                            const isVisible = visibleColumns.has(String(column.key));
                                            return (
                                                <label
                                                    key={String(column.key)}
                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isVisible}
                                                        onChange={() => toggleColumn(String(column.key))}
                                                        className="rounded border-slate-300 text-slate-900 focus:outline-none"
                                                    />
                                                    <span className="text-sm text-slate-700">{column.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {selectedRows.length > 0 && (
                        <div className="text-sm text-slate-600 ">
                            {selectedRows.length} seleccionado{selectedRows.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {selectable && (
                                    <th className="w-8 md:w-12 px-2 md:px-4 py-2 md:py-3">
                                        <input
                                            type="checkbox"
                                            aria-label="Seleccionar todos"
                                            checked={allSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="rounded w-3 md:w-4 border-slate-300 text-slate-900 focus:outline-none"
                                        />
                                    </th>
                                )}
                                {visibleColumnsList.map((column, index) => (
                                    <th
                                        key={index}
                                        className={`px-1 py-1 md:px-2 md:py-2 text-${column.align || 'left'} md:text-sm text-xs font-semibold text-slate-400 ${(column.sortable !== false && sortable) ? 'cursor-pointer hover:bg-slate-100' : ''
                                            }`}
                                        style={{ width: column.width }}
                                        onClick={() => (column.sortable !== false && sortable) && handleSort(column.key as keyof T)}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span>{column.label}</span>
                                            {(column.sortable !== false && sortable) && (
                                                <div className="flex flex-col">
                                                    <svg
                                                        className={`w-3 h-3 ${sortConfig?.key === column.key && sortConfig?.direction === 'asc'
                                                            ? 'text-slate-900'
                                                            : 'text-slate-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M5 10l5-5 5 5H5z" />
                                                    </svg>
                                                    <svg
                                                        className={`w-3 h-3 -mt-1 ${sortConfig?.key === column.key && sortConfig?.direction === 'desc'
                                                            ? 'text-slate-900'
                                                            : 'text-slate-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M15 10l-5 5-5-5h10z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {actions.length > 0 && (
                                    <th className="px-1 md:px-2 py-1 md:py-2 text-right text-xs md:text-sm font-semibold text-slate-400">
                                        Acciones
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={visibleColumnsList.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="md:px-4 px-2 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-500">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Cargando...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleColumnsList.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="md:px-4 px-2 md:py-12 py-6 text-center text-slate-500">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                displayData.map((row, rowIndex) => {
                                    if (!row) {
                                        // Empty row
                                        return (
                                            <tr key={`empty-${rowIndex}`} className="h-12">
                                                {selectable && <td className="px-2 md:px-4 py-2 md:py-3" />}
                                                {visibleColumnsList.map((_, colIndex) => (
                                                    <td key={colIndex} className="px-2 md:px-4 py-2 md:py-3" />
                                                ))}
                                                {actions.length > 0 && <td className="px-2 md:px-4 py-2 md:py-3" />}
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr
                                            key={rowIndex}
                                            className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50'}`}
                                            onClick={(e) => handleRowClick(row, e)}
                                        >
                                            {selectable && (
                                                <td className="px-2 md:px-4 py-1 md:py-2" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        aria-label="Seleccionar"
                                                        checked={isRowSelected(row)}
                                                        onChange={(e) => handleSelectRow(row, e.target.checked)}
                                                        className="rounded w-3 md:w-4 border-slate-300 text-slate-900 focus:outline-none"
                                                    />
                                                </td>
                                            )}
                                            {visibleColumnsList.map((column, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className={`md:px-2 px-1 md:py-2 py-1 text-${column.align || 'left'} md:text-sm text-xs text-slate-700`}
                                                    style={{ width: column.width }}
                                                >
                                                    {renderCell(row[column.key as keyof T], row, column)}
                                                </td>
                                            ))}
                                            {actions.length > 0 && (
                                                <td className="md:px-2 px-1 md:py-2 py-1 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-2">
                                                        {actions.map((action, actionIndex) => {
                                                            if (action.show && !action.show(row)) return null;

                                                            const buttonClass = `inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${action.variant === 'danger'
                                                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                                : action.variant === 'primary'
                                                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                                }`;

                                                            if (action.href) {
                                                                return (
                                                                    <Link
                                                                        key={actionIndex}
                                                                        href={action.href(row)}
                                                                        className={buttonClass}
                                                                    >
                                                                        {getIcon(action.icon)}
                                                                        {action.label}
                                                                    </Link>
                                                                );
                                                            }

                                                            return (
                                                                <button
                                                                    key={actionIndex}
                                                                    onClick={() => action.onClick?.(row)}
                                                                    className={buttonClass}
                                                                >
                                                                    {getIcon(action.icon)}
                                                                    {action.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer with pagination */}
                {totalPages > 1 && (
                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex md:flex-row flex-col-reverse items-center justify-between">
                        <div className="text-sm text-slate-600 mt-2 md:mt-0">
                            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPageSelected, sortedData.length)} de {sortedData.length} resultados
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="hidden md:block">
                                    Anterior
                                </span>
                                <span className="md:hidden">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </span>
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${currentPage === pageNum
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="hidden md:block">
                                    Siguiente
                                </span>
                                <span className="md:hidden">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}