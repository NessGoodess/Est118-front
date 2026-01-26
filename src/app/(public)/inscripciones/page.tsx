import WizardForm from "@/components/public/admissions/WizardForm";
import { formatLongWithoutTime } from "@/lib/utils/dateFormatter";
import { getAdmissionStatus } from "@/lib/admissions/getAdmissionStatus";

const titleByStatus = {
    not_available: "Preinscripciones no disponibles",
    not_started: "Preinscripciones aún no inician",
    ended: "Preinscripciones finalizadas",
    active: "Preinscripciones activas",
} as const;

export default async function InscripcionesPage() {
    const data = await getAdmissionStatus();

    if (!data.enabled || data.status !== "active") {
        const status = data.status ?? "not_available";

        return (
            <div className="min-h-screen bg-public-background flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200 p-6 text-center space-y-4">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <svg
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-900">
                        {titleByStatus[status]}
                    </h1>

                    <p className="text-sm text-gray-600 leading-relaxed">
                        {data.message ??
                            "El periodo de preinscripción no se encuentra disponible."}
                    </p>

                    {data.start_date && status === "not_started" && (
                        <p className="text-xs text-gray-500">
                            Inician el{" "}
                            <span className="font-medium">
                                {formatLongWithoutTime(data.start_date)}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return <WizardForm />;
}
