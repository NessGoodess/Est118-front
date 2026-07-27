'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeOwnPassword } from '@/lib/services/user.service';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FloatingPassword } from '@/components/ui/FloatingInputs';
import { IconByName } from '@/components/ui/icons/global.icons';
import { globalToast } from '@/lib/toast';
import { formatError } from '@/lib/api';
import { ApiError } from '@/lib/types/auth';
import { changeOwnPasswordSchema } from '@/lib/validations/user/changeOwnPassword.schema';
import { z } from 'zod';

type ChangeOwnPasswordFormData = z.infer<typeof changeOwnPasswordSchema>;

interface ChangeOwnPasswordFormProps {
    onSuccess?: () => void;
}

export default function ChangeOwnPasswordForm({
    onSuccess,
}: ChangeOwnPasswordFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangeOwnPasswordFormData>({
        resolver: zodResolver(changeOwnPasswordSchema),
    });

    const onSubmit = async (data: ChangeOwnPasswordFormData) => {
        setIsSubmitting(true);

        try {
            await changeOwnPassword(
                data.current_password,
                data.password,
                data.password_confirmation
            );
            globalToast.success('Contraseña actualizada correctamente');
            reset();
            onSuccess?.();
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const message = formatError(apiError)
            globalToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FloatingPassword
                label="Contraseña actual"
                type="password"
                placeholder=""
                autoComplete="current-password"
                required
                {...register('current_password')}
                error={errors.current_password?.message}
                icon={<IconByName name="password" className="h-5 w-5" />}
            />

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
                label="Confirmar nueva contraseña"
                type="password"
                placeholder=""
                autoComplete="new-password"
                required
                {...register('password_confirmation')}
                error={errors.password_confirmation?.message}
                icon={<IconByName name="password" className="h-5 w-5" />}
            />

            <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Requisitos de contraseña:</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                </ul>
            </div>

            <SubmitButton pending={isSubmitting} loadingText="Actualizando...">
                Actualizar contraseña
            </SubmitButton>
        </form>
    );
}
