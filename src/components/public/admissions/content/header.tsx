import Image from 'next/image';

export default function PreregistrationHeader() {
    return (
        < section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative h-16 w-auto">
                            <Image src="/Logo_IEEPO.png" alt="IEEPO" width={64} height={64} className="h-16 object-contain" />
                        </div>
                        <div className="h-12 w-px bg-gray-300" />
                        <div className="relative h-16 w-auto">
                            <Image src="/Logo_EST118.png" alt="EST118" width={64} height={64} className="h-16 object-contain" />
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-gray-900">Preinscripción 2025-2026</h1>
                        <p className="text-sm text-gray-600">Escuela Secundaria Técnica No. 118</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
