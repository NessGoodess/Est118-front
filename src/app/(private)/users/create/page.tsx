//app/(private)/users/create/page.tsx
'use client';

import RegisterUserForm from '@/components/private/users/RegisterUserForm';
import GenericHeader from '@/components/ui/GenericHeader';
import { withPagePermission } from '@/components/guards/withPagePermission';
import Loading from './loading';

function CreateUserPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <GenericHeader
                title="Crear Nuevo Usuario"
                description="Complete el formulario para registrar un nuevo usuario en el sistema"
            />

            <RegisterUserForm />
        </div>
    );
}

export default withPagePermission(CreateUserPage, {
    loadingComponent: <Loading />
});
