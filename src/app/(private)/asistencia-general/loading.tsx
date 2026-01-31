
export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-amber-950">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600">
                <p className="text-white">Cargando...</p>
            </div>
        </div>
    );
}