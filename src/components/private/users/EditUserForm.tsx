'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser, getRoles, Role } from '@/lib/services/users.service';
import { UserDetail } from '@/lib/types/user';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FloatingInput } from '@/components/ui/FloatingInputs';
import { IconByName } from '@/components/ui/icons/global.icons';
import { globalToast } from '@/lib/toast';
import PermissionSelector from './PermissionSelector';

const editUserSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre es demasiado largo'),
    email: z.string().email('El correo electrónico no es válido').max(255, 'El correo es demasiado largo'),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
    user: UserDetail;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles.map(role => role.name) || []);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permissions.map(p => p.name) || []);
    const [loadingRoles, setLoadingRoles] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
        },
    });
    useEffect(() => {
        setSelectedRoles(user.roles.map(role => role.name) || []);
        setSelectedPermissions(user.permissions.map(p => p.name) || []);
    }, [user]);
    
    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setLoadingRoles(false);
        }
    };

    const onSubmit = async (data: EditUserFormData) => {
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            await updateUser(user.id, {
                ...data,
                roles: selectedRoles,
                permissions: selectedPermissions,
            });
            globalToast.success('Usuario actualizado exitosamente');
            onSuccess?.();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al actualizar el usuario';
            setErrorMessage(message);
            globalToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FloatingInput
                label="Nombre completo"
                type="text"
                placeholder=""
                autoComplete="name"
                required
                {...register('name')}
                error={errors.name?.message}
                icon={<IconByName name="user" className="h-5 w-5" />}
            />

            <FloatingInput
                label="Correo electrónico"
                type="email"
                placeholder=""
                autoComplete="email"
                required
                inputMode="email"
                {...register('email')}
                error={errors.email?.message}
                icon={<IconByName name="atSign" className="h-5 w-5" />}
            />

            <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                    Roles
                </label>
                {loadingRoles ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {roles.map((role) => (
                            <label
                                key={role.id}
                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedRoles.includes(role.name)
                                        ? 'bg-primary-soft border border-border'
                                        : 'hover:bg-surface-muted border border-transparent'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedRoles.includes(role.name)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRoles([...selectedRoles, role.name]);
                                        } else {
                                            setSelectedRoles(selectedRoles.filter(r => r !== role.name));
                                        }
                                    }}
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-ring focus:ring-2"
                                />
                                <span className="text-sm text-foreground capitalize">
                                    {role.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                    Permisos
                </label>
                <PermissionSelector
                    selectedPermissions={selectedPermissions}
                    onChange={setSelectedPermissions}
                />
            </div>

            {errorMessage && (
                <div className="p-3 rounded-lg text-sm bg-danger/10 text-danger border border-danger/30">
                    {errorMessage}
                </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-surface-muted hover:bg-surface-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                )}
                <SubmitButton pending={isSubmitting} loadingText="Actualizando...">
                    Actualizar Usuario
                </SubmitButton>
            </div>
        </form>
    );
}

