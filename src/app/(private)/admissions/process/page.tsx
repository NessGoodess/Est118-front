"use client";

import { AdmissionSettingsForm } from "@/features/admissions";
import AdmissionCyclesSkeleton from "@/features/admissions/components/skeletons/admission-cycles-skeleton";
import { withPagePermission } from "@/components/guards/withPagePermission";

function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <AdmissionSettingsForm />
        </div>
    );
}

export default withPagePermission(ConfiguracionPage, {
    loadingComponent: <AdmissionCyclesSkeleton />,
});
