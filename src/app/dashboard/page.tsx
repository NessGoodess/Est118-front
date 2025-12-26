'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Configurar axios para usar cookies y XSRF token automáticamente
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

interface User {
    id?: number;
    name?: string;
    email?: string;
    [key: string]: any;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // axios maneja automáticamente XSRF token y cookies
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                setUser(response.data);
            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    setError('No autenticado');
                    router.push('/login');
                } else {
                    setError('Error de conexión');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/logout', {}, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            router.push('/login');
        } catch (err: any) {
            console.error('Error en logout:', err);
            // Redirigir de todas formas
            router.push('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Bienvenido, {user?.name || user?.email}!
                        </h2>
                        <p className="text-gray-600">
                            Esta es una página protegida. Has iniciado sesión correctamente usando Laravel Sanctum con cookies HTTP-only.
                        </p>
                        <pre className="mt-4 bg-gray-100 p-4 rounded">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>
                </div>
            </main>
        </div>
    );
}