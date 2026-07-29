"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema';
import { SubmitButton } from '../ui/SubmitButton';
import { FloatingInput, FloatingPassword } from '../ui/FloatingInputs';
import { useAuth } from '@/contexts/AuthContext';
import { IconByName } from '../ui/icons/global.icons';

export default function LoginForm() {
  const { login, error: authError, clearError } = useAuth();
  const searchParams = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionNotice =
    searchParams.get('reason') === 'expired'
      ? 'Tu sesión ha caducado. Inicia sesión de nuevo.'
      : '';

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    setIsSubmitting(true);
    try {
      await login(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = authError;

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 my-8 px-4 2xl:px-0 2xl:py-10">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full mx-auto">
          <Image src="/logo.PNG" alt="Logo" width={100} height={100} />
        </div>
        <h1 className="text-xl font-semibold text-brand-strong hidden sm:block">Bienvenido</h1>
        <p className="text-sm text-fg-muted md:block hidden">Ingresa tus credenciales para acceder</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-elevated text-foreground py-6 px-6 md:py-8 md:px-8 lg:px-10 shadow-card border border-border rounded-xl sm:rounded-2xl text-sm space-y-2" noValidate>
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
            className="text-xs sm:text-sm text-primary hover:text-primary-hover font-medium transition-colors duration-200"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div>
          <SubmitButton pending={isSubmitting} loadingText="Iniciando sesión...">
            Iniciar Sesión
          </SubmitButton>
        </div>

        <div
          className="min-h-12 flex items-center justify-center"
          aria-live="polite"
        >
          {(displayError || sessionNotice) && (
            <div
              className={`w-full p-3 rounded-lg text-sm border text-center ${
                displayError
                  ? 'bg-danger/10 text-danger border-danger/30'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
              style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}
              role={displayError ? 'alert' : 'status'}
            >
              {displayError || sessionNotice}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
