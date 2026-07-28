'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserListItem } from '@/lib/types/user';
import { getUsers } from '@/lib/services/users.service';
import { PaginatedResponse } from '@/lib/types/paginated-response';

import { IconByName } from '@/components/ui/icons/global.icons';

interface UsersTableProps {
    onFilterChange?: (filters: UserFilters) => void;
}

interface UserFilters {
    search: string;
    role: string;
    verified: boolean | undefined;
}

interface GetUsersParams {
    search?: string;
    role?: string;
    verified?: boolean;
    page?: number;
}

export default function UsersTable({ onFilterChange }: UsersTableProps) {
    const router = useRouter();

    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginatedResponse<UserListItem> | null>(null);
    const [filters, setFilters] = useState<UserFilters>({
        search: '',
        role: '',
        verified: undefined,
    });
    const [currentPage, setCurrentPage] = useState(1);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params: GetUsersParams = {
                page: currentPage,
            };

            if (filters.search) {
                params.search = filters.search;
            }
            if (filters.role) {
                params.role = filters.role;
            }
            if (filters.verified !== undefined) {
                params.verified = filters.verified;
            }

            const data = await getUsers(params);
            setUsers(data.data);
            setPagination(data);
            onFilterChange?.(filters);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, currentPage, onFilterChange]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleFilterChange = (key: keyof UserFilters, value: string | boolean | undefined) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleUserClick = (user: UserListItem) => {
        router.push(`/users/${user.id}`);
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-surface-elevated rounded-lg shadow-sm border border-border p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Buscar
                        </label>
                        <div className="relative">
                            <IconByName
                                name="search"
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted"
                            />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Nombre o email..."
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Rol
                        </label>
                        <select
                            aria-label='rol'
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary"
                        >
                            <option value="">Todos los roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Verificación
                        </label>
                        <select
                            aria-label='verificacion'
                            value={filters.verified === undefined ? '' : filters.verified ? 'true' : 'false'}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleFilterChange('verified', value === '' ? undefined : value === 'true');
                            }}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary"
                        >
                            <option value="">Todos</option>
                            <option value="true">Verificados</option>
                            <option value="false">No verificados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface-elevated rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-muted border-b border-border">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Roles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-surface-elevated divide-y divide-border">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-fg-muted">
                                        No se encontraron usuarios
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-surface-muted cursor-pointer transition-colors"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-foreground">
                                                {user.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-fg-muted">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {user.role_names.length === 0 ? (
                                                    <span className="text-xs text-fg-muted">Sin roles</span>
                                                ) : (
                                                    <>
                                                        {user.role_names.slice(0, 2).map((name) => (
                                                            <span
                                                                key={name}
                                                                className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-foreground bg-surface-muted rounded capitalize"
                                                            >
                                                                {name}
                                                            </span>
                                                        ))}
                                                        {user.role_names.length > 2 && (
                                                            <span className="text-xs text-fg-muted">
                                                                +{user.role_names.length - 2}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.email_verified_at ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-success bg-success/10 rounded">
                                                    <IconByName name="check" className="h-3 w-3" />
                                                    Verificado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-warning-foreground bg-warning/10 rounded">
                                                    <IconByName name="alert" className="h-3 w-3" />
                                                    No verificado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-muted">
                                            {user.created_at
                                                ? new Date(user.created_at).toLocaleDateString('es-MX')
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUserClick(user);
                                                }}
                                                className="text-primary hover:text-primary"
                                            >
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="bg-surface-muted px-6 py-4 border-t border-border flex items-center justify-between">
                        <div className="text-sm text-foreground">
                            Mostrando {pagination.from} a {pagination.to} de {pagination.total} usuarios
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-foreground bg-surface-elevated border border-border rounded-lg hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-foreground">
                                Página {currentPage} de {pagination.last_page}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(pagination!.last_page, prev + 1))}
                                disabled={currentPage === pagination.last_page}
                                className="px-3 py-2 text-sm font-medium text-foreground bg-surface-elevated border border-border rounded-lg hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
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

