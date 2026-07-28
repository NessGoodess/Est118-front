import Image from 'next/image';
import { useAdmissionsForm } from '../context/AdmissionsFormContext';
import { formatWithoutYearWithTime } from '@/lib/utils/dateFormatter';

export default function HeaderMain() {
    const { admissionStatus } = useAdmissionsForm();

    return (
        <header className="bg-surface-elevated border-b border-border top-0 z-40 shadow-sm" >
            <div className="max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center md:gap-6">
                        <div className="relative h-12 md:h-16 w-auto">
                            <Image src="/Logo_IEEPO.png" alt="IEEPO" width={64} height={64} className="h-12 md:h-16 object-contain" />
                        </div>
                        <div className="h-12 md:h-16 w-px bg-surface-muted" />
                        <div className="relative h-12 md:h-16 w-auto">
                            <Image src="/Logo_EST118.png" alt="EST118" width={64} height={64} className="h-12 md:h-16 object-contain" />
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="text-xl md:text-2xl font-bold text-foreground">
                            {admissionStatus?.cycle_name || 'Preinscripciones'}
                        </h1>
                        <p className="text-xs md:text-sm text-fg-muted">Escuela Secundaria Técnica No. 118</p>
                        {admissionStatus?.start_at && admissionStatus?.end_at && (
                            <p className="text-xs md:text-sm text-primary font-medium mt-1">
                                {formatWithoutYearWithTime(admissionStatus.start_at)} - {formatWithoutYearWithTime(admissionStatus.end_at)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
