'use client';

import { useState } from 'react';
import { UserDetail } from '@/lib/types/user';
import { deleteUser, resendVerification } from '@/lib/services/users.service';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/components/ui/confirm/useConfirm';
import { globalToast } from '@/lib/toast';
import EditUserForm from './EditUserForm';
import ChangePasswordForm from './ChangePasswordForm';
import { IconByName } from '@/components/ui/icons/global.icons';
import { ApiError } from '@/lib/types/auth';
import { formatError } from '@/lib/config/axios.config';

interface UserDetailViewProps {
    user: UserDetail;
    onUpdate: () => void;
    onDelete?: () => void;
}

type ViewMode = 'view' | 'edit' | 'change-password';

export default function UserDetailView({ user, onUpdate, onDelete }: UserDetailViewProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('view');
    const { hasPermission } = useAuth();
    const { confirm } = useConfirm();

    const handleDelete = async () => {
        confirm({
            title: 'Eliminar Usuario',
            description: `¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`,
            variant: 'danger',
            confirmLabel: 'Eliminar',
            cancelLabel: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deleteUser(user.id);
                    globalToast.success('Usuario eliminado exitosamente');
                    onDelete?.();
                } catch (error) {
                    const apiError = error as ApiError;
                    const message = formatError(apiError);
                    globalToast.error(message);
                }
            },
        });
    };

    const handleResendVerification = async () => {
        try {
            await resendVerification(user.id);
            globalToast.success('Email de verificación enviado');
        } catch (error) {
            const apiError = error as ApiError;
            const message = formatError(apiError);  
            globalToast.error(message);
        }
    };

    if (viewMode === 'edit') {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Editar Usuario</h3>
                    <button
                        aria-label="Editar Usuario"
                        onClick={() => setViewMode('view')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <IconByName name="x" className="h-6 w-6" />
                    </button>
                </div>
                <EditUserForm
                    user={user}
                    onSuccess={() => {
                        setViewMode('view');
                        onUpdate();
                    }}
                    onCancel={() => setViewMode('view')}
                />
            </div>
        );
    }

    if (viewMode === 'change-password') {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Cambiar Contraseña</h3>
                    <button
                        aria-label="Cambiar Contraseña"
                        onClick={() => setViewMode('view')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <IconByName name="x" className="h-6 w-6" />
                    </button>
                </div>
                <ChangePasswordForm
                    userId={user.id}
                    onSuccess={() => setViewMode('view')}
                    onCancel={() => setViewMode('view')}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    {hasPermission('edit users') && (
                        <button
                            onClick={() => setViewMode('edit')}
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            Editar
                        </button>
                    )}
                    {hasPermission('delete users') && (
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Estado de Verificación
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                        {user.email_verified_at ? (
                            <>
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded">
                                    <IconByName name="check" className="h-3 w-3" />
                                    Verificado
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-50 rounded">
                                    <IconByName name="alert" className="h-3 w-3" />
                                    No verificado
                                </span>
                                {hasPermission('edit users') && (
                                    <button
                                        onClick={handleResendVerification}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Reenviar verificación
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Roles
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                                <span
                                    key={role.id}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded capitalize"
                                >
                                    {role.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-slate-400">Sin roles asignados</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Permisos
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {user.permissions && user.permissions.length > 0 ? (
                            user.permissions.map((permission) => (
                                <span
                                    key={permission.id}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded"
                                >
                                    {permission.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-slate-400">Sin permisos asignados</span>
                        )}
                    </div>
                </div>

                {user.created_at && (
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Fecha de Creación
                        </label>
                        <p className="mt-1 text-sm text-slate-700">
                            {new Date(user.created_at).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                )}

                {hasPermission('edit users') && (
                    <div className="pt-4 border-t border-slate-200">
                        <button
                            onClick={() => setViewMode('change-password')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

