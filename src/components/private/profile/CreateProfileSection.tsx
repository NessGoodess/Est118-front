'use client';

import { useState, useEffect } from 'react';
import { updateUser, getRoles, Role } from '@/lib/services/users.service';
import { SubmitButton } from '@/components/ui/SubmitButton';
import PermissionSelector from '@/components/private/users/PermissionSelector';
import { globalToast } from '@/lib/toast';

interface CreateProfileSectionProps {
    userId: number;
    currentRoleNames: string[];
    currentPermissionNames: string[];
    onSuccess?: () => void;
}

export default function CreateProfileSection({
    userId,
    currentRoleNames,
    currentPermissionNames,
    onSuccess,
}: CreateProfileSectionProps) {
    const [assignNow, setAssignNow] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoleNames);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissionNames);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        getRoles()
            .then(setRoles)
            .catch(() => {})
            .finally(() => setLoadingRoles(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            await updateUser(userId, {
                roles: assignNow ? selectedRoles : undefined,
                permissions: assignNow ? selectedPermissions : undefined,
            });
            globalToast.success('Perfil actualizado correctamente');
            onSuccess?.();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al guardar';
            setErrorMessage(message);
            globalToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-slate-600">
                Puedes asignar roles y permisos ahora o dejarlo para que un administrador lo configure después.
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={assignNow}
                    onChange={(e) => setAssignNow(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Asignar roles y permisos ahora</span>
            </label>

            {assignNow && (
                <>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Roles</label>
                        {loadingRoles ? (
                            <div className="flex justify-center py-4">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {roles.map((role) => (
                                    <label
                                        key={role.id}
                                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors border ${
                                            selectedRoles.includes(role.name)
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'border-transparent hover:bg-slate-50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRoles([...selectedRoles, role.name]);
                                                } else {
                                                    setSelectedRoles(selectedRoles.filter((r) => r !== role.name));
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700 capitalize">{role.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Permisos</label>
                        <PermissionSelector
                            selectedPermissions={selectedPermissions}
                            onChange={setSelectedPermissions}
                        />
                    </div>
                </>
            )}

            {errorMessage && (
                <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                    {errorMessage}
                </div>
            )}

            <SubmitButton pending={isSubmitting} loadingText="Guardando...">
                {assignNow ? 'Crear perfil y asignar' : 'Crear perfil'}
            </SubmitButton>
        </form>
    );
}
