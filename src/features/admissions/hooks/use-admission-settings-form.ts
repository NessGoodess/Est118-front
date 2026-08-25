"use client";

import { useState } from "react";
import { useAdmissionCycles } from "@/features/admissions/hooks/use-admission-settings";
import type {
  AdmissionCycle,
  CreateAdmissionCyclePayload,
} from "@/features/admissions/types/settings";
import { useConfirm } from "@/components/ui/confirm";
import { formatWithoutYearWithTime } from "@/lib/utils/dateFormatter";

const emptyCycle: CreateAdmissionCyclePayload = {
  start_at: "",
  end_at: "",
  name: "",
};

export function toDatetimeLocal(value?: string) {
  if (!value) return "";
  return value.replace(" ", "T").slice(0, 16);
}

export function isCycleExpired(cycle: AdmissionCycle) {
  return new Date(cycle.end_at) < new Date() && cycle.status === "closed";
}

export function useAdmissionSettingsForm() {
  const {
    cycles,
    loading,
    creating,
    toggling,
    createCycle,
    activateCycle,
    closeCycle,
    reopenCycle,
    deleteCycle,
  } = useAdmissionCycles();
  const { confirm } = useConfirm();

  const [showCreate, setShowCreate] = useState(false);
  const [newCycle, setNewCycle] = useState<CreateAdmissionCyclePayload>(emptyCycle);
  const [createAndActivate, setCreateAndActivate] = useState(false);
  const [reopenEndDate, setReopenEndDate] = useState("");
  const [cycleToReopen, setCycleToReopen] = useState<AdmissionCycle | null>(null);

  const toggleCreate = () => setShowCreate((open) => !open);

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createCycle(newCycle);
    if (!created) return;
    if (createAndActivate) await activateCycle(created.id);
    setShowCreate(false);
    setNewCycle(emptyCycle);
    setCreateAndActivate(false);
  };

  const handleActivate = (cycle: AdmissionCycle) => {
    confirm({
      title: "Activar periodo de registro",
      description: `¿Está seguro de activar el periodo "${cycle.name}"?\n\nEste periodo estará activo desde ${formatWithoutYearWithTime(cycle.start_at)} hasta ${formatWithoutYearWithTime(cycle.end_at)}.\n\nSolo puede haber un periodo activo a la vez.\n\nLos folios comenzarán desde 001 para este nuevo periodo.`,
      confirmLabel: "Activar",
      cancelLabel: "Cancelar",
      variant: "default",
      onConfirm: async () => {
        await activateCycle(cycle.id);
      },
    });
  };

  const handleClose = (cycle: AdmissionCycle) => {
    confirm({
      title: "Cerrar periodo de registro",
      description: `¿Está seguro de cerrar el periodo "${cycle.name}"?\n\nUna vez cerrado, las preinscripciones ya no estarán disponibles para el público.\n\nPuede reabrir el periodo más tarde si es necesario.`,
      confirmLabel: "Cerrar",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: async () => {
        await closeCycle(cycle.id);
      },
    });
  };

  const handleReopen = (cycle: AdmissionCycle) => {
    if (new Date(cycle.end_at) < new Date()) {
      setCycleToReopen(cycle);
      setReopenEndDate("");
      return;
    }

    confirm({
      title: "Reabrir periodo de registro",
      description: `¿Está seguro de reabrir el periodo "${cycle.name}"?\n\nEste periodo volverá a estar activo desde ${formatWithoutYearWithTime(cycle.start_at)} hasta ${formatWithoutYearWithTime(cycle.end_at)}.\n\nSolo puede haber un periodo activo a la vez.\n\nLos folios continuarán donde se quedaron (último folio del periodo).`,
      confirmLabel: "Reabrir",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: async () => {
        await reopenCycle(cycle.id);
      },
    });
  };

  const cancelReopen = () => {
    setCycleToReopen(null);
    setReopenEndDate("");
  };

  const handleReopenWithDate = () => {
    if (!cycleToReopen || !reopenEndDate) return;

    confirm({
      title: "Reabrir periodo con nueva fecha",
      description: `¿Está seguro de reabrir el periodo "${cycleToReopen.name}" con nueva fecha de fin?\n\nNueva fecha de fin: ${formatWithoutYearWithTime(reopenEndDate)}\n\nSolo puede haber un periodo activo a la vez.\n\nLos folios continuarán donde se quedaron (último folio del periodo).`,
      confirmLabel: "Reabrir",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: async () => {
        await reopenCycle(cycleToReopen.id, reopenEndDate);
        cancelReopen();
      },
    });
  };

  const handleDelete = (cycle: AdmissionCycle) => {
    confirm({
      title: "Eliminar periodo en borrador",
      description: `¿Está seguro de eliminar el periodo "${cycle.name}"?\n\nEsta acción no se puede deshacer.\n\nSolo se pueden eliminar periodos en borrador que nunca han sido activados.`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: async () => {
        await deleteCycle(cycle.id);
      },
    });
  };

  return {
    cycles,
    loading,
    creating,
    toggling,
    showCreate,
    newCycle,
    setNewCycle,
    createAndActivate,
    setCreateAndActivate,
    reopenEndDate,
    setReopenEndDate,
    cycleToReopen,
    toggleCreate,
    handleSubmitCreate,
    handleActivate,
    handleClose,
    handleReopen,
    handleReopenWithDate,
    cancelReopen,
    handleDelete,
  };
}
