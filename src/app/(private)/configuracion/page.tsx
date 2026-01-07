"use client";
import React from "react";
import { useState, useEffect } from "react";


export default function ConfiguracionPage() {
    const [settings, setSettings] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        fetch("/api/settings", { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setSettings(data);
                setError(null);
            })
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message || "Error fetching settings");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuración del Sistema</h1>
                <p className="text-gray-600">Ajusta las configuraciones del sistema escolar.</p>

                {loading && <p className="mt-4">Cargando...</p>}

                {error && (
                    <p className="mt-4 text-red-500">Error al cargar configuración: {error}</p>
                )}

                {!loading && !error && (
                    <pre className="mt-4 bg-gray-50 p-4 rounded">
                        {JSON.stringify(settings, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}


