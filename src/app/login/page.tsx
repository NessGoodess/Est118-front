'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Configurar axios para usar cookies y XSRF token automáticamente
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default function LoginPage() {
    const [email, setEmail] = useState('test@example.com'); // Email por defecto para pruebas
    const [password, setPassword] = useState('password'); // Password por defecto
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // PASO 1: Obtener cookie CSRF
            console.log('Paso 1: Obteniendo cookie CSRF...');
            const csrfResponse = await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('CSRF Response:', csrfResponse.status, csrfResponse.statusText);

            // PASO 2: Hacer login (axios maneja automáticamente XSRF token y cookies)
            console.log('Paso 2: Enviando login...');
            const loginResponse = await axios.post('http://localhost:8000/login', {
                email: email.trim(),
                password: password.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            console.log('Login Response:', {
                status: loginResponse.status,
                statusText: loginResponse.statusText,
                data: loginResponse.data
            });

            if (loginResponse.status === 200) {
                console.log('Login exitoso:', loginResponse.data);
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Error completo:', err);
            if (err.response) {
                setError(err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`);
            } else if (err.request) {
                setError('Error de conexión: No se recibió respuesta del servidor');
            } else {
                setError('Error de conexión: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para limpiar cookies (para depuración)
    const clearCookies = () => {
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        alert('Cookies limpiadas');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Usuario: test@example.com / Contraseña: password
                    </p>
                </div>
                
                <button 
                    onClick={clearCookies}
                    className="text-xs text-blue-500 underline"
                >
                    Limpiar Cookies (Debug)
                </button>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="test@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}