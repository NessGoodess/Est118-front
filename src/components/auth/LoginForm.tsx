"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema';
import type { AuthState } from '@/lib/types/auth-state';
import { SubmitButton } from '../ui/SubmitButton';
import { FormField } from '../ui/FormField1';
import { useAuth } from '@/contexts/AuthContext';

const initialState: AuthState = { success: false, message: '', };

export default function LoginForm() {
  const [state, setState] = useState<AuthState>(initialState);
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (data: LoginFormData) => {
    setState({ success: false, message: '' });

    try {
      await login(data);
      setState({ success: true, message: 'Inicio de sesión exitoso' });
    } catch (err: any) {
      setState({ success: false, message: err?.message || 'Error al iniciar sesión' });
    }
  };

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" noValidate>
            <FormField
              label="Correo electrónico"
              type="email"
              placeholder=""
              autoComplete="email"
              required
              inputMode="email"
              {...register("email")}
              error={errors.email?.message}
              icon={
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            <FormField
              label="Contraseña"
              type="password"
              placeholder=""
              autoComplete="current-password"
              required
              {...register("password")}
              error={errors.password?.message}
              icon={
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
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
              <SubmitButton pending={loading} loadingText="Iniciando sesión...">
                Iniciar Sesión
              </SubmitButton>
            </div>

            <div className="text-center ">
              <div className={` -mt-3 p-1 rounded-lg text-sm transition-all duration-300 whitespace-nowrap
                ${state.message
                  ? state.success
                    ? 'bg-green-50 text-green-800 border border-green-100'
                    : 'bg-red-50 text-red-800 border border-red-100'
                  : 'opacity-0 '
                }
              `} style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.875rem)' }} role="alert">

                {state.message || '\u00A0'}

              </div>
              {/*<p className="text-xs sm:text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Regístrate aquí
                </Link>
              </p>*/}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}