"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUserSchema, RegisterUserFormData } from '@/lib/validations/register.schema';
import { registerUser } from '@/lib/services/users.service';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FloatingInput, FloatingPassword } from '@/components/ui/FloatingInputs';
import { IconByName } from '@/components/ui/icons/global.icons';
import { globalToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/types/auth';
import { formatError } from '@/lib/config/axios.config';

export default function RegisterUserForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterUserFormData>({
        resolver: zodResolver(registerUserSchema),
    });

    const onSubmit = async (data: RegisterUserFormData) => {
        setIsSubmitting(true);

        try {
            const newUser = await registerUser(data);
            globalToast.success(`Usuario "${newUser.name}" creado exitosamente`);
            reset();
            router.push('/users');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const message = formatError(apiError);
            globalToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

                    <FloatingInput
                        label="Nombre completo"
                        type="text"
                        placeholder=""
                        autoComplete="name"
                        required
                        {...register("name")}
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
                        {...register("email")}
                        error={errors.email?.message}
                        icon={<IconByName name="atSign" className="h-5 w-5" />}
                    />

                    <FloatingPassword
                        label="Contraseña"
                        type="password"
                        placeholder=""
                        autoComplete="new-password"
                        required
                        {...register("password")}
                        error={errors.password?.message}
                        icon={<IconByName name="password" className="h-5 w-5" />}
                    />

                    <FloatingPassword
                        label="Confirmar contraseña"
                        type="password"
                        placeholder=""
                        autoComplete="new-password"
                        required
                        {...register("password_confirmation")}
                        error={errors.password_confirmation?.message}
                        icon={<IconByName name="password" className="h-5 w-5" />}
                    />

                    <div className="pt-4">
                        <SubmitButton pending={isSubmitting} loadingText="Creando usuario...">
                            Crear Usuario
                        </SubmitButton>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                            Requisitos de contraseña:
                        </p>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                            <li>Mínimo 8 caracteres</li>
                            <li>Al menos una letra mayúscula</li>
                            <li>Al menos una letra minúscula</li>
                            <li>Al menos un número</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
}
