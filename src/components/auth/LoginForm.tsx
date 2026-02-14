"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema';
import { SubmitButton } from '../ui/SubmitButton';
import { FloatingInput, FloatingPassword } from '../ui/FloatingInputs';
import { useAuth } from '@/contexts/AuthContext';
import { IconByName } from '../ui/icons/global.icons';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { login, error: authError, clearError } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage('');
    clearError();
    setIsSubmitting(true);

    try {
      await login(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const displayError = errorMessage || authError;

  return (
    <div className="flex items-center justify-center py-4 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-md space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Logo SVG */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center shadow-lg">
            <Image src="/logo.PNG" alt="Logo" width={100} height={100} />
          </div>
        </div>

        <div className="text-center">
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Bienvenido de vuelta
          </h2>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-600 px-2 ">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>

        <div className="bg-white py-6 px-4 sm:py-8 sm:px-6 lg:px-8 shadow-xl rounded-xl sm:rounded-2xl">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 min-w-64 max-w-72" noValidate>
            <FloatingInput
              label="Correo electrónico"
              type="email"
              placeholder=""
              autoComplete="email"
              required
              inputMode="email"
              {...register("email")}
              error={errors.email?.message}
              icon={<IconByName name="atSign" className="h-4 w-4 sm:h-5 sm:w-5" />}
            />

            <FloatingPassword
              label="Contraseña"
              type="password"
              placeholder=""
              autoComplete="current-password"
              required
              {...register("password")}
              error={errors.password?.message}
              icon={<IconByName name="password" className="h-4 w-4 sm:h-5 sm:w-5" />}
            />

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div>
              <SubmitButton pending={isSubmitting} loadingText="Iniciando sesión...">
                Iniciar Sesión
              </SubmitButton>
            </div>

            {displayError && (
              <div className="text-center">
                <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200 transition-all duration-300"
                  style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}
                  role="alert">
                  {displayError}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}