"use client";

import { useState } from "react";

export default function EstudiantesPage() {

    const [estudiantes, setEstudiantes] = useState<any[]>([]);

    const consultarEstudiantes = async () => {
        const response = await fetch('http://localhost:8000/api/reader-status');
        const data = await response.json();
        console.log(data);
        setEstudiantes(data);
    }

    return (
        <div className="space-y-6">

            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={consultarEstudiantes}>
                consultar estudiantes
            </button>
           
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Estudiantes</h1>
                <p className="text-gray-600">Aquí podrás gestionar todos los estudiantes de la institución.</p>
            </div>
            <div>
            {/*}{estudiantes.map((estudiante) => (
                <div key={estudiante.id}>
                    <h1>{estudiante.profile.first_name} {estudiante.profile.last_name}</h1>
                </div>
            ))}{*/}
            </div>
            
        </div>
    );
}



