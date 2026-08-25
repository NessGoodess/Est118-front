"use client";

import { Button } from "@/components/ui/Button";
import GenericHeader from "@/components/ui/GenericHeader";
import { IconByName } from "@/components/ui/icons";
import { useAdmissionCapabilities } from "@/features/admissions/hooks/capabilities/useAdmissionCapabilities";
import { useAdmissionSettingsForm } from "@/features/admissions/hooks/use-admission-settings-form";
import AdmissionCyclesSkeleton from "@/features/admissions/components/skeletons/admission-cycles-skeleton";
import AdmissionCycleCreateForm from "./cycles/admission-cycle-create-form";
import AdmissionCycleHelpAside from "./cycles/admission-cycle-help-aside";
import AdmissionCycleList from "./cycles/admission-cycle-list";
import AdmissionCycleReopenPanel from "./cycles/admission-cycle-reopen-panel";

export default function AdmissionSettingsForm() {
    const { canCreate } = useAdmissionCapabilities();
    const { cycles, loading, creating, toggling, showCreate, newCycle, setNewCycle, setCreateAndActivate, reopenEndDate,
        setReopenEndDate, cycleToReopen, toggleCreate, handleSubmitCreate, handleActivate, handleClose, handleReopen,
        handleReopenWithDate, cancelReopen, handleDelete, } = useAdmissionSettingsForm();

    if (loading) {
        return <AdmissionCyclesSkeleton />;
    }

    return (
        <>
            <GenericHeader
                title="Periodos de registro"
                description="Configura las fechas en las que estará disponible el registro de aspirantes."
            >
                {!showCreate && canCreate ?
                    <Button
                        type="button"
                        variant="primary"
                        leftIcon={<IconByName name="plus" className="w-4 h-4" />}
                        onClick={toggleCreate}
                    >
                        Nuevo periodo
                    </Button>
                    : null}
            </GenericHeader>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <section className="min-w-0 space-y-4 lg:space-y-6">
                    {showCreate && canCreate && (
                        <AdmissionCycleCreateForm
                            value={newCycle}
                            creating={creating}
                            onChange={setNewCycle}
                            onCancel={toggleCreate}
                            onSubmit={handleSubmitCreate}
                            onSaveDraft={() => setCreateAndActivate(false)}
                            onCreateAndActivate={() => setCreateAndActivate(true)}
                        />
                    )}

                    {cycleToReopen && (
                        <AdmissionCycleReopenPanel
                            cycle={cycleToReopen}
                            endDate={reopenEndDate}
                            onEndDateChange={setReopenEndDate}
                            onConfirm={handleReopenWithDate}
                            onCancel={cancelReopen}
                        />
                    )}

                    <AdmissionCycleList
                        cycles={cycles}
                        toggling={toggling}
                        onActivate={handleActivate}
                        onClose={handleClose}
                        onReopen={handleReopen}
                        onDelete={handleDelete}
                    />

                </section>
                <aside className="min-w-0">
                    <AdmissionCycleHelpAside />
                </aside>
            </div>
        </>
    );
}
