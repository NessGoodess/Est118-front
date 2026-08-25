"use client";

import { useEffect } from "react";
import {
  AdmissionCycleCard,
  PreEnrollmentsList,
  useAdmissionCycles,
  usePreEnrollments,
} from "@/features/admissions";
import { subscribePreEnrollmentsListChanged } from "@/features/admissions/lib/pre-enrollments-list-events";
import { useToast } from "@/contexts/ToastContext";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";
import PreEnrollmentsListSkeleton from "@/features/admissions/components/skeletons/pre-enrollments-list-skeleton";

function AdmissionsApplicationsPage() {
  const { data: cycles } = useAdmissionCycles();
  const {
    data,
    isInitialLoading,
    isRefetching,
    error,
    cycleId,
    setCycleId,
    refetch,
  } = usePreEnrollments();
  const { showError } = useToast();

  const activeCycleId =
    cycleId ||
    cycles.find((c) => c.status === "active")?.id ||
    cycles[0]?.id;

  useEffect(() => {
    if (!error) return;
    showError("Error", error.message || "Error al cargar las preinscripciones");
  }, [error, showError]);

  useEffect(() => subscribePreEnrollmentsListChanged(() => {
    void refetch();
  }), [refetch]);

  if (isInitialLoading) return <PreEnrollmentsListSkeleton />;

  return (
    <section>
      <GenericHeader
        title="Preinscripciones"
        description="Gestiona los aspirantes a la Institución"
      />

      <article className="flex gap-3 overflow-x-auto px-2 py-3">
        {cycles.map((cycle) => (
          <AdmissionCycleCard
            key={cycle.id}
            cycle={cycle}
            selected={activeCycleId === cycle.id}
            onClick={(c) =>
              setCycleId(activeCycleId === c.id ? null : c.id)
            }
          />
        ))}
      </article>
      <article className="">
        <PreEnrollmentsList
          data={data}
          loading={isRefetching}
          refetch={refetch}
        />
      </article>
    </section>
  );
}

export default withPagePermission(AdmissionsApplicationsPage, {
  loadingComponent: <PreEnrollmentsListSkeleton />,
});
