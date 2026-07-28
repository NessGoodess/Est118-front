//app/(private)/usuarios/page.tsx
'use client';

import UsersTable from '@/components/private/users/UsersTable';
import GenericHeader from '@/components/ui/GenericHeader';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { withPagePermission } from '@/components/guards/withPagePermission';
import Link from 'next/link';

function UsersPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <GenericHeader
                    title="Gestión de Usuarios"
                    description="Administra los usuarios del sistema"
                />

                <PermissionGuard permission="create users">
                    <Link
                        href="/users/create"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm"
                    >
                        Crear Usuario
                    </Link>
                </PermissionGuard>
            </div>

            <UsersTable />
        </div>
    );
}

export default withPagePermission(UsersPage);
