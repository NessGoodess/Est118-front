'use client';

import { useState, useEffect } from 'react';
import {
    updateUser,
    getRoles,
    PermissionSelector,
    labelRole,
    type Role,
} from '@/features/users';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FloatingSelect } from '@/components/ui/FloatingSelect';
import { IconByName } from '@/components/ui/icons';
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
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        currentRoleNames[0] ? [currentRoleNames[0]] : []
    );
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
            <p className="text-sm text-fg-muted">
                Puedes asignar roles y permisos ahora o dejarlo para que un administrador lo configure después.
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={assignNow}
                    onChange={(e) => setAssignNow(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                />
                <span className="text-sm font-medium text-foreground">Asignar roles y permisos ahora</span>
            </label>

            {assignNow && (
                <>
                    <FloatingSelect
                        label="Rol"
                        value={selectedRoles[0] ?? ''}
                        onChange={(e) =>
                            setSelectedRoles(e.target.value ? [e.target.value] : [])
                        }
                        disabled={loadingRoles}
                        icon={<IconByName name="users" className="h-5 w-5" />}
                    >
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                                {labelRole(role.name)}
                            </option>
                        ))}
                    </FloatingSelect>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Permisos</label>
                        <PermissionSelector
                            selectedPermissions={selectedPermissions}
                            onChange={setSelectedPermissions}
                        />
                    </div>
                </>
            )}

            {errorMessage && (
                <div className="p-3 rounded-lg text-sm bg-danger/10 text-danger border border-danger/30">
                    {errorMessage}
                </div>
            )}

            <SubmitButton pending={isSubmitting} loadingText="Guardando...">
                {assignNow ? 'Crear perfil y asignar' : 'Crear perfil'}
            </SubmitButton>
        </form>
    );
}
