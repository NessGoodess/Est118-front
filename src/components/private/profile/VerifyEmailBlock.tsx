'use client';

import { useState } from 'react';
import { mailVerification } from '@/lib/services/user.service';
import { IconByName } from '@/components/ui/icons/global.icons';
import { globalToast } from '@/lib/toast';

interface VerifyEmailBlockProps {
    email: string;
    onResent?: () => void;
}

export default function VerifyEmailBlock({ email, onResent }: VerifyEmailBlockProps) {
    const [sending, setSending] = useState(false);

    const [cooldown, setCooldown] = useState(0);

    const handleResend = async () => {
        if (cooldown > 0) return;

        setSending(true);
        try {
            const response = await mailVerification();
            globalToast.success(response.message || 'Correo de verificación reenviado. Revisa tu bandeja.');
            onResent?.();

            // Start 60s cooldown
            setCooldown(60);
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al reenviar el correo';
            globalToast.error(message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <IconByName name="alert" className="h-5 w-5 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-amber-900">Verifica tu correo</h3>
                    <p className="mt-1 text-sm text-amber-800">
                        Tu correo <span className="font-medium">{email}</span> no está verificado.
                        Debes verificarlo para acceder al resto de la aplicación.
                    </p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={sending || cooldown > 0}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Enviando...
                            </>
                        ) : cooldown > 0 ? (
                            <>
                                <IconByName name="clock" className="h-4 w-4" />
                                Reenviar en {cooldown}s
                            </>
                        ) : (
                            <>
                                <IconByName name="atSign" className="h-4 w-4" />
                                Reenviar correo de verificación
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
}
