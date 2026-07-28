"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/components/ui/confirm";
import { useAcademicYears } from "@/hooks/academic-years/useAcademicYears";
import { assignFirstGradeGroups } from "@/lib/services/admissions.service";
import { handleApiError } from "@/lib/api";
import {
  FirstGradeAssignmentResult,
  ScoreSource,
} from "@/lib/types/admission/first-grade-assignment";

type OverrideMap = Record<number, number>;

const scoreSourceLabel: Record<ScoreSource, string> = {
  school_average: "Promedio escuela de procedencia",
  admission_exam: "Examen de admisión",
};

const FLAG_SIBLINGS = "possible_siblings_by_lastname";
const FLAG_SCHOOL = "same_previous_school";

function flagLabel(flag: string): string {
  if (flag === FLAG_SCHOOL) return "Misma escuela de procedencia";
  if (flag === FLAG_SIBLINGS) return "Posibles hermanos (apellido)";
  return flag;
}

/** Menor número = más prioritario para redistribuir (hermanos posibles antes que misma escuela). */
function conflictSeparationRank(flags: string[]): number {
  if (flags.includes(FLAG_SIBLINGS)) return 0;
  if (flags.includes(FLAG_SCHOOL)) return 1;
  return 2;
}

export default function FirstGradeAssignmentPanel() {
  const { data: years, loading: yearsLoading, error: yearsError } = useAcademicYears();
  const { showError, showSuccess, showWarning } = useToast();
  const { confirm } = useConfirm();

  const [academicYearId, setAcademicYearId] = useState<number | null>(null);
  const [scoreSource, setScoreSource] = useState<ScoreSource>("school_average");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<FirstGradeAssignmentResult | null>(null);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [onlyConflicts, setOnlyConflicts] = useState(false);

  useEffect(() => {
    if (yearsError) {
      showError("Error", yearsError.message || "No se pudieron cargar los ciclos.");
    }
  }, [yearsError, showError]);

  useEffect(() => {
    if (!academicYearId && years.length > 0) {
      const active = years.find((y) => y.is_active) ?? years[0];
      setAcademicYearId(active.id);
    }
  }, [years, academicYearId]);

  const groupOptions = useMemo(() => result?.group_loads ?? [], [result]);
  const filteredAssignments = useMemo(() => {
    if (!result) return [];
    if (!onlyConflicts) return result.assignments;
    return result.assignments.filter((item) => item.flags.length > 0);
  }, [result, onlyConflicts]);

  const conflictRows = useMemo(() => {
    if (!result) return [];
    return result.assignments
      .filter((item) => item.flags.length > 0)
      .sort((a, b) => {
        const ra = conflictSeparationRank(a.flags);
        const rb = conflictSeparationRank(b.flags);
        if (ra !== rb) return ra - rb;
        return a.enrollment_id - b.enrollment_id;
      });
  }, [result]);

  const autoSeparateConflicts = () => {
    if (!result) return;

    if (result.summary.total_candidates === 0) {
      showWarning(
        "Sin registros para asignar",
        "No hay alumnos de nuevo ingreso en 1° en este ciclo. Convierte preinscripciones válidas antes de repartir grupos."
      );
      return;
    }

    if (conflictRows.length === 0) {
      showWarning(
        "Sin conflictos marcados",
        "La simulación no detectó repetición de misma escuela ni apellido en el mismo grupo. No hay nada que separar automáticamente."
      );
      return;
    }

    const sortedGroups = [...result.group_loads].sort((a, b) => a.total - b.total);
    if (sortedGroups.length === 0) return;

    const nextOverrides: OverrideMap = { ...overrides };
    let pointer = 0;

    for (const item of conflictRows) {
      const target = sortedGroups[pointer % sortedGroups.length];
      nextOverrides[item.enrollment_id] = target.class_group_id;
      pointer += 1;
    }

    setOverrides(nextOverrides);
    showSuccess(
      "Separación aplicada en borrador",
      `Se sugieren ${conflictRows.length} cambios manual (prioridad: posibles hermanos, luego misma escuela). Simula de nuevo y revisa antes de aplicar.`
    );
  };

  const run = async (dryRun: boolean) => {
    if (!academicYearId) {
      showError("Faltan datos", "Selecciona el ciclo escolar.");
      return;
    }

    setRunning(true);
    try {
      const overridesArray = Object.entries(overrides).map(([enrollmentId, classGroupId]) => ({
        enrollment_id: Number(enrollmentId),
        class_group_id: Number(classGroupId),
      }));

      const data = await assignFirstGradeGroups({
        academic_year_id: academicYearId,
        score_source: scoreSource,
        dry_run: dryRun,
        overrides: overridesArray.length > 0 ? overridesArray : undefined,
      });

      setResult(data);

      if (data.summary.total_candidates === 0) {
        showWarning(
          "Sin candidatos para 1°",
          "No hay matrículas activas marcadas como nuevo ingreso en grupos de primer grado (A-H) para este ciclo. Convierte preinscripciones o revisa ciclo/grupos antes de usar esta herramienta."
        );
        return;
      }

      if (dryRun && data.summary.with_conflicts === 0) {
        showWarning(
          "Sin conflictos detectados",
          `Hay ${data.summary.total_candidates} alumno(s) candidato(s), pero nadie coincide en el mismo grupo por escuela ni por apellido. Puedes aplicar balance directo sin separación especial.`
        );
        return;
      }

      showSuccess(
        dryRun ? "Simulación lista" : "Asignación aplicada",
        `Alumnos: ${data.summary.total_candidates} · Conflictos: ${data.summary.with_conflicts}`
      );
    } catch (err: unknown) {
      const apiErr = handleApiError(err);
      showError("Error", apiErr.message || "No se pudo ejecutar la asignación.");
    } finally {
      setRunning(false);
    }
  };

  const handleSimulate = () => {
    confirm({
      title: "Simular asignación de grupos 1°",
      description:
        "No guarda cambios. Solo calcula sugerencias por puntaje, balance y marca conflictos.",
      confirmLabel: "Simular",
      onConfirm: () => run(true),
    });
  };

  const handleApply = () => {
    confirm({
      title: "Aplicar asignación de grupos 1°",
      description:
        "Esto actualiza grupo de los nuevos ingresos de 1° en el ciclo elegido, respetando los cambios manuales.",
      confirmLabel: "Aplicar",
      variant: "danger",
      onConfirm: () => run(false),
    });
  };

  return (
    <section className="bg-surface-elevated rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">Asignación grupos 1° (A-H)</h2>
        <p className="text-sm text-fg-muted">
          Reparte nuevos ingresos de primer grado por balance y puntaje; detecta posibles conflictos
          para revisión manual (misma escuela/apellido).
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-fg-muted">Ciclo escolar</label>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated"
            disabled={yearsLoading || running}
            value={academicYearId ?? ""}
            onChange={(e) => setAcademicYearId(Number(e.target.value))}
          >
            <option value="" disabled>
              Selecciona...
            </option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {y.description} {y.is_active ? "(activo)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-fg-muted">Puntaje para repartir</label>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated"
            disabled={running}
            value={scoreSource}
            onChange={(e) => setScoreSource(e.target.value as ScoreSource)}
          >
            <option value="school_average">{scoreSourceLabel.school_average}</option>
            <option value="admission_exam">{scoreSourceLabel.admission_exam}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="secondary" onClick={handleSimulate} loading={running}>
          Simular reparto
        </Button>
        <Button variant="danger" onClick={handleApply} loading={running} disabled={!result}>
          Aplicar asignación
        </Button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="text-xs bg-surface-muted border border-border rounded-lg p-3 text-fg-muted">
            Fuente: <strong>{scoreSourceLabel[result.score_source]}</strong> · Candidatos:{" "}
            <strong>{result.summary.total_candidates}</strong> · Conflictos:{" "}
            <strong>{result.summary.with_conflicts}</strong> · Fallback de puntaje:{" "}
            <strong>{result.summary.fallback_scores}</strong>
          </div>

          <div className="text-xs text-fg-muted">
            Cambia el grupo sugerido en filas con conflicto si deseas separar casos manualmente antes
            de aplicar.
          </div>
          <div className="text-xs text-fg-muted">
            Mostrando <strong>{filteredAssignments.length}</strong> de{" "}
            <strong>{result.assignments.length}</strong> alumnos.
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={onlyConflicts}
                onChange={(e) => setOnlyConflicts(e.target.checked)}
              />
              Ver solo conflictos
            </label>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={autoSeparateConflicts}
                disabled={!result || result.summary.total_candidates === 0}
                title={
                  conflictRows.length > 0
                    ? "Orden: primero posibles hermanos (apellido), luego misma escuela; reparto round-robin al grupo menos cargado."
                    : ""
                }
              >
                Separar automáticamente marcados
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOverrides({})}>
                Limpiar ajustes manuales
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-muted text-fg-muted">
                <tr>
                  <th className="text-left px-3 py-2">Alumno</th>
                  <th className="text-left px-3 py-2">Escuela</th>
                  <th className="text-left px-3 py-2">Puntaje</th>
                  <th className="text-left px-3 py-2">Conflictos</th>
                  <th className="text-left px-3 py-2">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((item) => {
                  const selectedGroup =
                    overrides[item.enrollment_id] ?? item.suggested_group_id;
                  return (
                    <tr key={item.enrollment_id} className="border-t border-border">
                      <td className="px-3 py-2">
                        <div className="font-medium text-foreground">{item.student_name}</div>
                        <div className="text-xs text-fg-muted">ID matrícula {item.enrollment_id}</div>
                      </td>
                      <td className="px-3 py-2">{item.previous_school || "—"}</td>
                      <td className="px-3 py-2">
                        <span className="font-medium">{item.score_used.toFixed(2)}</span>
                        {item.fallback_used && (
                          <span className="ml-2 text-xs text-warning-foreground">(fallback)</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {item.flags.length === 0 ? (
                          <span className="text-xs text-success">Sin banderas</span>
                        ) : (
                          <span className="text-xs text-warning-foreground">
                            {item.flags.map(flagLabel).join(" · ")}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          className="rounded-lg border border-border px-2 py-1 text-xs bg-surface-elevated"
                          value={selectedGroup}
                          onChange={(e) =>
                            setOverrides((prev) => ({
                              ...prev,
                              [item.enrollment_id]: Number(e.target.value),
                            }))
                          }
                        >
                          {groupOptions.map((g) => (
                            <option key={g.class_group_id} value={g.class_group_id}>
                              {g.group_name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

