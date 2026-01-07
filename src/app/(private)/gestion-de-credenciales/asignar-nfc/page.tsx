

import ReaderStatus from "@/components/attendance/ReaderStatus";

export default function AsignarNFCPage() {
    return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Credenciales</h1>
                    <p className="text-gray-600">Aqui se escriben los datos al NFC por estudiante </p>
                </div>
                <ReaderStatus />
            </div>
    );
}

