'use client';

import { useAuth } from '@/contexts/AuthContext';
import GenericHeader from '@/components/ui/GenericHeader';
import VerifyEmailBlock from '@/components/private/profile/VerifyEmailBlock';
import ChangeOwnPasswordForm from '@/components/private/profile/ChangeOwnPasswordForm';
import CreateProfileSection from '@/components/private/profile/CreateProfileSection';

/*function getRoleNames(user: { roles?: string[] | { name?: string }[] }): string[] {
    if (!user.roles) return [];
    const r = user.roles;
    if (r.length === 0) return [];
    return r.map((x) => (typeof x === 'string' ? x : x?.name)).filter(Boolean) as string[];
}

function getPermissionNames(user: { permissions?: string[] | { name?: string }[] }): string[] {
    if (!user.permissions) return [];
    const p = user.permissions;
    if (p.length === 0) return [];
    return p.map((x) => (typeof x === 'string' ? x : x?.name)).filter(Boolean) as string[];
}*/

export default function UpdateProfilePage() {
    const { user, refreshUser, hasPermission } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    const emailUnverified = !user.email_verified_at;
    const canCreateProfile = hasPermission('create profile') && !emailUnverified;

    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <GenericHeader
                title="Completar cuenta"
                description="Verifica tu correo, actualiza tu contraseña y opcionalmente crea tu perfil."
            />

            <div className="mt-8 space-y-10">
                {emailUnverified && (
                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-4">Verificación de correo</h2>
                        <VerifyEmailBlock
                            email={user.email}
                            onResent={refreshUser}
                        />
                    </section>
                )}

                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Cambiar contraseña</h2>
                    <div className="rounded-xl border border-border bg-surface-elevated p-6 shadow-sm">
                        <ChangeOwnPasswordForm onSuccess={refreshUser} />
                    </div>
                </section>

                {canCreateProfile && (
                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-4">Crear perfil</h2>
                        <div className="rounded-xl border border-border bg-surface-elevated p-6 shadow-sm">
                            <CreateProfileSection
                                userId={user.id}
                                currentRoleNames={user.roles ?? []}
                                currentPermissionNames={user.permissions ?? []}
                                onSuccess={refreshUser}
                            />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
