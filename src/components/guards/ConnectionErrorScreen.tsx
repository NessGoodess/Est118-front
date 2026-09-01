'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Shown when the API could not be reached while resolving the session.
 *
 * The cookie may still be perfectly valid, so this replaces the old behaviour
 * of redirecting to /login — which looked like an involuntary logout every time
 * the API restarted.
 */
export default function ConnectionErrorScreen({
    onRetry,
}: {
    onRetry: () => Promise<void>;
}) {
    const [retrying, setRetrying] = useState(false);

    const handleRetry = async () => {
        setRetrying(true);
        try {
            await onRetry();
        } finally {
            setRetrying(false);
        }
    };

    return (
        <div className="flex min-h-dvh items-center justify-center bg-surface-app px-4">
            <div
                className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface-elevated p-6 text-center shadow-card"
                role="alert"
            >
                <h1 className="text-lg font-semibold text-foreground">
                    Sin conexión con el servidor
                </h1>
                <p className="text-sm text-fg-muted">
                    No pudimos contactar al servidor. Tu sesión sigue activa; vuelve a
                    intentarlo en un momento.
                </p>
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    fullWidth
                    loading={retrying}
                    loadingText="Reintentando…"
                    onClick={handleRetry}
                >
                    Reintentar
                </Button>
            </div>
        </div>
    );
}
