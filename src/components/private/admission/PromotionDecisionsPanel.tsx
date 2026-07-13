"use client";

import { useEffect, useMemo, useState } from "react";
import { usePromotionDecisions } from "@/hooks/admissions/use-promotion-decisions";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { promotionDecisionsTableConfig } from "./promotion-decisions.config";
import { promotionTableRenderers } from "./promotion-tableRerenders";
import { PendingPromotionDecisionItem } from "@/lib/types/admission/promotion";

export default function PromotionDecisionsPanel() {
  const {
    items,
    loading,
    bulkLoading,
    error,
    bulkSetDecision,
    refetch,
  } = usePromotionDecisions();
  const { showError, showSuccess, showWarning } = useToast();

  useEffect(() => {
    if (!error) return;
    showError("Error", error.message || "No se pudieron cargar las decisiones pendientes.");
  }, [error, showError]);

  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [selectedRows, setSelectedRows] = useState<PendingPromotionDecisionItem[]>([]);

  const gradeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.grade) set.add(item.grade);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const groupOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.group) set.add(item.group);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (gradeFilter !== "all") {
        if (!item.grade || item.grade !== gradeFilter) return false;
      }

      if (groupFilter !== "all") {
        if (!item.group || item.group !== groupFilter) return false;
      }

      return true;
    });
  }, [items, gradeFilter, groupFilter]);

  const handleBulk = async (isApproved: boolean) => {
    const ids = selectedRows.map((row) => row.enrollment_id);
    if (ids.length === 0) {
      showWarning("Sin selección", "Selecciona al menos un alumno con casillas.");
      return;
    }

    const { ok, failed } = await bulkSetDecision(ids, isApproved);

    if (failed > 0) {
      showError(
        "Casi listo",
        `Se actualizaron ${ok} y fallaron ${failed}.`
      );
      return;
    }

    showSuccess(
      "Proceso guardado",
      isApproved ? "Aprobado para los seleccionados." : "Reprobado para los seleccionados."
    );
    setSelectedRows([]);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Cierre de ciclo</h2>
          <p className="text-sm text-gray-500">Aprobado/Reprobado con casillas</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Pendientes: <strong>{items.length}</strong>
          </span>
          <Button variant="secondary" size="sm" onClick={refetch} loading={loading}>
            Actualizar
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Grado</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Grupo</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {groupOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 py-6">Cargando decisiones pendientes...</div>
      ) : items.length === 0 ? (
        <div className="border rounded-lg p-4 text-sm text-green-700 bg-green-50 border-green-200">
          No hay decisiones pendientes. Ya puedes ejecutar la promoción anual.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
            Flujo rápido para administrativos: 1) filtra por grado/grupo, 2) marca casillas, 3) aplica aprobar/reprobar.
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-600">
              Vista: <strong>{filteredItems.length}</strong> · Seleccionados:{" "}
              <strong>{selectedRows.length}</strong>
            </span>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRows([])}
                disabled={selectedRows.length === 0 || bulkLoading}
              >
                Limpiar
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulk(true)}
                disabled={selectedRows.length === 0 || bulkLoading}
                loading={bulkLoading}
              >
                Aprobar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleBulk(false)}
                disabled={selectedRows.length === 0 || bulkLoading}
                loading={bulkLoading}
              >
                Reprobar
              </Button>
            </div>
          </div>

          <DataTable
            config={promotionDecisionsTableConfig}
            data={filteredItems}
            renderers={promotionTableRenderers}
            onSelectionChange={setSelectedRows}
            emptyMessage="No hay alumnos pendientes con ese filtro."
            loading={loading || bulkLoading}
            minRows={8}
          />
        </div>
      )}
    </section>
  );
}
