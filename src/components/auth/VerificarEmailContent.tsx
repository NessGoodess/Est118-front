'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconByName } from '@/components/ui/icons/global.icons';

export default function VerificarEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get('status');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (status === 'success' || status === 'already_verified') {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push('/login');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status, router]);

    const getStatusConfig = () => {
        switch (status) {
            case 'success':
                return {
                    icon: 'check',
                    iconColor: 'text-success',
                    bgColor: 'bg-success/10',
                    borderColor: 'border-success/30',
                    title: '¡Correo Verificado Exitosamente!',
                    message: 'Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.',
                    autoRedirect: true,
                };
            case 'already_verified':
                return {
                    icon: 'check',
                    iconColor: 'text-info',
                    bgColor: 'bg-info/10',
                    borderColor: 'border-info/30',
                    title: 'Correo Ya Verificado',
                    message: 'Tu correo electrónico ya había sido verificado anteriormente.',
                    autoRedirect: true,
                };
            case 'invalid':
                return {
                    icon: 'alert',
                    iconColor: 'text-danger',
                    bgColor: 'bg-danger/10',
                    borderColor: 'border-danger/30',
                    title: 'Enlace Inválido',
                    message: 'El enlace de verificación no es válido. Por favor, solicita un nuevo correo de verificación.',
                    autoRedirect: false,
                };
            case 'expired':
                return {
                    icon: 'alert',
                    iconColor: 'text-warning',
                    bgColor: 'bg-warning/10',
                    borderColor: 'border-warning/30',
                    title: 'Enlace Expirado',
                    message: 'El enlace de verificación ha expirado. Por favor, solicita un nuevo correo de verificación.',
                    autoRedirect: false,
                };
            default:
                return {
                    icon: 'alert',
                    iconColor: 'text-fg-muted',
                    bgColor: 'bg-surface-muted',
                    borderColor: 'border-border',
                    title: 'Estado Desconocido',
                    message: 'No se pudo determinar el estado de la verificación.',
                    autoRedirect: false,
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-app px-4">
            <div className="max-w-md w-full">
                <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 shadow-xl`}>
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className={`${config.iconColor} bg-surface-elevated rounded-full p-4 shadow-lg`}>
                            <IconByName name={config.icon as "check" | "alert"} className="h-12 w-12" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-foreground mb-3">
                        {config.title}
                    </h1>

                    {/* Message */}
                    <p className="text-center text-fg-muted mb-6">
                        {config.message}
                    </p>

                    {/* Auto-redirect countdown */}
                    {config.autoRedirect && countdown > 0 && (
                        <div className="text-center mb-4">
                            <p className="text-sm text-fg-muted">
                                Redirigiendo al login en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                            </p>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-md hover:shadow-lg"
                        >
                            Ir al Login
                        </button>

                        {!config.autoRedirect && (
                            <button
                                onClick={() => router.push('/')}
                                className="w-full px-6 py-3 bg-surface-elevated text-foreground border border-border rounded-lg hover:bg-surface-muted transition-colors font-medium"
                            >
                                Volver al Inicio
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-fg-muted">
                        ¿Necesitas ayuda? Contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}
