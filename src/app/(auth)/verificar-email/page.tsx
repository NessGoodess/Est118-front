
import { Suspense } from 'react';
import VerificarEmailContent from '@/components/auth/VerificarEmailContent';

export default function VerificarEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
            <VerificarEmailContent />
        </Suspense>
    );
}
