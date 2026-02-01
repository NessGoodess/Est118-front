import { useMemo, useState } from "react";
import { TableColumn, TableConfig, DataTableProps } from "@/lib/types/data-table";

export function DataTable<T>({
    config,
    data,
    renderers = {},
    icons = {},
    onSelectionChange,
    emptyMessage = 'No hay datos disponibles',
    loading = false,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
    const [selectedRows, setSelectedRows] = useState<T[]>([]);

    // Extraer valores de la configuración
    const {
        columns,
        actions = [],
        itemsPerPage = 10,
        searchable = true,
        sortable = true,
        selectable = false,
    } = config;

    // Búsqueda
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

    // Ordenamiento
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

    // Paginación
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

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

    // Función para renderizar celdas
    const renderCell = (value: unknown, row: T, column: TableColumn<T>) => {
        if (column.render) {
            if (typeof column.render === 'string') {
                // Usar renderer por nombre
                const renderer = renderers[column.render];
                if (renderer) {
                    return renderer(value, row);
                }
            } else if (typeof column.render === 'function') {
                // Usar función render personalizada
                return column.render(value, row);
            }
        }
        return String(value ?? '-');
    };

    // Función para obtener icono
    const getIcon = (iconName?: string) => {
        if (!iconName) return null;
        return icons[iconName] || (
            <span className="text-xs">[{iconName}]</span>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header con búsqueda */}
            {searchable && (
                <div className="flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {selectedRows.length > 0 && (
                        <div className="text-sm text-slate-600">
                            {selectedRows.length} seleccionado{selectedRows.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {selectable && (
                                    <th className="w-12 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                                        />
                                    </th>
                                )}
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className={`px-4 py-3 text-${column.align || 'left'} text-sm font-semibold text-slate-700 ${(column.sortable !== false && sortable) ? 'cursor-pointer hover:bg-slate-100' : ''
                                            }`}
                                        style={{ width: column.width }}
                                        onClick={() => (column.sortable !== false && sortable) && handleSort(column.key as keyof T)}
                                    >
                                        <div className="flex items-center gap-2">
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
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                                        Acciones
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-4 py-12 text-center">
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
                                    <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-4 py-12 text-center text-slate-500">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                                        {selectable && (
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected(row)}
                                                    onChange={(e) => handleSelectRow(row, e.target.checked)}
                                                    className="rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                                                />
                                            </td>
                                        )}
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`px-4 py-3 text-${column.align || 'left'} text-sm text-slate-700`}
                                                style={{ width: column.width }}
                                            >
                                                {renderCell(row[column.key as keyof T], row, column)}
                                            </td>
                                        ))}
                                        {actions.length > 0 && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {actions.map((action, actionIndex) => {
                                                        if (action.show && !action.show(row)) return null;
                                                        return (
                                                            <button
                                                                key={actionIndex}
                                                                onClick={() => action.onClick(row)}
                                                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${action.variant === 'danger'
                                                                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                                    : action.variant === 'primary'
                                                                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                                    }`}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer con paginación */}
                {totalPages > 1 && (
                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedData.length)} de {sortedData.length} resultados
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
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
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}