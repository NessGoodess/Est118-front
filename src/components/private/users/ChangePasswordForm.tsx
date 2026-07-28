'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePassword } from '@/lib/services/users.service';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FloatingPassword } from '@/components/ui/FloatingInputs';
import { IconByName } from '@/components/ui/icons/global.icons';
import { globalToast } from '@/lib/toast';

const changePasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
    userId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ChangePasswordForm({
    userId,
    onSuccess,
    onCancel,
}: ChangePasswordFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            await changePassword(userId, data.password, data.password_confirmation);
            globalToast.success('Contraseña actualizada exitosamente');
            reset();
            onSuccess?.();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al actualizar la contraseña';
            setErrorMessage(message);
            globalToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FloatingPassword
                label="Nueva contraseña"
                type="password"
                placeholder=""
                autoComplete="new-password"
                required
                {...register('password')}
                error={errors.password?.message}
                icon={<IconByName name="password" className="h-5 w-5" />}
            />

            <FloatingPassword
                label="Confirmar contraseña"
                type="password"
                placeholder=""
                autoComplete="new-password"
                required
                {...register('password_confirmation')}
                error={errors.password_confirmation?.message}
                icon={<IconByName name="password" className="h-5 w-5" />}
            />

            {errorMessage && (
                <div className="p-3 rounded-lg text-sm bg-danger/10 text-danger border border-danger/30">
                    {errorMessage}
                </div>
            )}

            <div className="p-4 bg-primary-soft rounded-lg">
                <p className="text-sm text-primary font-medium mb-2">
                    Requisitos de contraseña:
                </p>
                <ul className="text-xs text-primary space-y-1 list-disc list-inside">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                </ul>
            </div>

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
                    Actualizar Contraseña
                </SubmitButton>
            </div>
        </form>
    );
}

