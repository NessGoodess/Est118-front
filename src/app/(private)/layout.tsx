
import ClientLayout from './layout.client';

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <ClientLayout>
            {children}
        </ClientLayout>
    );
}