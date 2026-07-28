import WizardForm from "@/components/public/admissions/WizardForm";
import { formatLongWithoutTime, formatLong } from "@/lib/utils/dateFormatter";
import { getAdmissionStatus } from "@/lib/admissions/getAdmissionStatus";

const titleByStatus = {
    not_available: "Preinscripciones no disponibles",
    not_started: "Preinscripciones aún no inician",
    ended: "Preinscripciones finalizadas",
    active: "Preinscripciones activas",
} as const;

export default async function InscripcionesPage() {
    const status = await getAdmissionStatus();
    console.log(status);
    if (!status.enabled) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:bg-gradient-to-b dark:from-transparent dark:to-transparent flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-surface-elevated p-8 rounded-2xl shadow-xl max-w-2xl w-full space-y-6">
                    {/* Ícono más amigable según el estado */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${status.status === 'not_started' ? 'bg-primary-soft' :
                        status.status === 'ended' ? 'bg-warning/15' : 'bg-surface-muted'
                        }`}>
                        {status.status === 'not_started' && (
                            <svg className="w-10 h-10 text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
                            </svg>
                        )}
                        {status.status === 'ended' && (
                            <svg className="w-10 h-10 text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />
                            </svg>
                        )}
                        {status.status === 'not_available' && (
                            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Título más claro */}
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-foreground">
                            {titleByStatus[status.status]}
                        </h1>
                        {status.message && (
                            <p className="text-lg text-fg-muted leading-relaxed">
                                {status.message}
                            </p>
                        )}
                    </div>

                    {/* Información de fechas más visible */}
                    <div className="pt-6 border-t border-border">
                        {status.status === 'not_started' && status.start_at && (
                            <div className="bg-primary-soft p-5 rounded-xl space-y-2">
                                <p className="text-base text-foreground font-medium">
                                    <svg className="w-4 h-4 inline mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                        <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
                                    </svg>
                                    Las inscripciones estarán disponibles:
                                </p>
                                <p className="text-lg font-bold text-primary">
                                    Del {formatLong(status.start_at)}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                    al {status.end_at ? formatLong(status.end_at) : 'No hay fecha de finalización'}
                                </p>
                                <p className="text-sm text-fg-muted mt-3">
                                    <svg className="w-4 h-4 inline mr-2 text-yellow-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" />
                                    </svg>
                                    Puede volver a esta página en esas fechas para inscribir a su hijo/a
                                </p>
                            </div>
                        )}
                        {status.status === 'ended' && status.end_at && (
                            <div className="bg-orange-50 p-5 rounded-xl space-y-2">
                                <p className="text-base text-foreground font-medium">
                                    El período de inscripciones finalizó el:
                                </p>
                                <p className="text-lg font-bold text-orange-700">
                                    {formatLongWithoutTime(status.end_at)}
                                </p>
                                <p className="text-sm text-fg-muted mt-3">
                                    <svg className="w-4 h-4 inline mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                                    </svg>
                                    Si necesita ayuda, por favor comuníquese con la institución
                                </p>
                            </div>
                        )}
                        {status.status === 'not_available' && (
                            <div className="bg-surface-muted p-5 rounded-xl">
                                <p className="text-base text-fg-muted">
                                    Aun no se ha habilitado el periodo de inscripciones
                                </p>
                                <p className="text-sm text-fg-muted mt-2">
                                    Si hay alguna duda, por favor comuníquese con la institución
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return <WizardForm admissionStatus={status} />;
}
