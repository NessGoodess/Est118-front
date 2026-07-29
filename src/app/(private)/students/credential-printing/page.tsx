"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GenericHeader from "@/components/ui/GenericHeader";
import GradeLevelsCard from "@/components/private/students/gradeLevelsCard";
import useGrades from "@/hooks/students/useGrades";
import { globalToast } from "@/lib/toast";
import { handleApiError } from "@/lib/api";
import type {
  ClassGroupOption,
  CredentialRow,
  CredentialRowsPayload,
  CredentialTrackingState,
} from "@/lib/types/credential-printing";
import {
  downloadCredentialExcel,
  downloadCredentialPhotosZip,
  fetchCredentialClassGroups,
  fetchCredentialRows,
  patchCredentialTracking,
} from "@/lib/services/credential-printing.service";

function BoolCell({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-border"
      checked={checked ?? false}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}

export default function CredentialPrintingPage() {
  const { grades, isLoading: gradesLoading, error: gradesError } = useGrades();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [classGroups, setClassGroups] = useState<ClassGroupOption[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [payload, setPayload] = useState<CredentialRowsPayload | null>(null);
  const [loadingRows, setLoadingRows] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [patchingId, setPatchingId] = useState<number | null>(null);

  useEffect(() => {
    if (gradesError) globalToast.error(gradesError.message);
  }, [gradesError]);

  useEffect(() => {
    if (!selectedGrade) {
      setClassGroups([]);
      setSelectedGroupId("");
      setPayload(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoadingGroups(true);
        const data = await fetchCredentialClassGroups(selectedGrade);
        if (cancelled) return;
        setClassGroups(data);
        setSelectedGroupId("");
        setPayload(null);
      } catch (e) {
        if (!cancelled) globalToast.error(handleApiError(e).message);
      } finally {
        if (!cancelled) setLoadingGroups(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedGrade]);

  useEffect(() => {
    if (!selectedGroupId || typeof selectedGroupId !== "number") {
      setPayload(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoadingRows(true);
        const data = await fetchCredentialRows(selectedGroupId);
        if (cancelled) return;
        setPayload(data);
      } catch (e) {
        if (!cancelled) globalToast.error(handleApiError(e).message);
      } finally {
        if (!cancelled) setLoadingRows(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedGroupId]);

  const academicYearId = payload?.meta.academic_year_id;

  const stats = useMemo(() => {
    if (!payload?.rows.length) {
      return { total: 0, withPhoto: 0, complete: 0 };
    }
    const rows = payload.rows;
    return {
      total: rows.length,
      withPhoto: rows.filter((r) => r.has_photo).length,
      complete: rows.filter((r) => r.data_complete).length,
    };
  }, [payload]);

  const applyTrackingPatch = useCallback(
    async (studentId: number, patch: Partial<CredentialTrackingState>) => {
      if (!academicYearId) return;
      try {
        setPatchingId(studentId);
        const { tracking } = await patchCredentialTracking(studentId, academicYearId, patch);
        setPayload((prev) => {
          if (!prev) return prev;
          const idx = prev.rows.findIndex((r) => r.student_id === studentId);
          if (idx === -1) return prev;
          const rows = [...prev.rows];
          const row = rows[idx];
          rows[idx] = { ...row, tracking: { ...row.tracking, ...tracking } };
          return { ...prev, rows };
        });
      } catch (e) {
        globalToast.error(handleApiError(e).message);
      } finally {
        setPatchingId(null);
      }
    },
    [academicYearId]
  );

  const onDownloadExcel = async () => {
    if (typeof selectedGroupId !== "number") return;
    try {
      setDownloadingExcel(true);
      await downloadCredentialExcel(selectedGroupId);
      globalToast.success("Excel descargado.");
    } catch (e) {
      globalToast.error(handleApiError(e).message);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const onDownloadZip = async () => {
    if (typeof selectedGroupId !== "number") return;
    try {
      setDownloadingZip(true);
      await downloadCredentialPhotosZip(selectedGroupId);
      globalToast.success("ZIP de fotos descargado.");
    } catch (e) {
      globalToast.error(e instanceof Error ? e.message : handleApiError(e).message);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <GenericHeader
        title="Impresión de credenciales"
        description="Por grupo: verificar foto y datos, exportar Excel con nombre de archivo de foto y seguimiento (impreso, NFC, entrega, pago, perdido, repuestos). Las fotos se pueden descargar en ZIP (compatible con Windows)."
      />

      <section className="rounded-lg border border-border bg-surface-elevated p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">1. Grado</h2>
        {gradesLoading ? (
          <p className="text-sm text-fg-muted">Cargando grados…</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {grades.map((g) => (
              <button
                key={g.grade_id}
                type="button"
                onClick={() => setSelectedGrade(g.grade_id)}
                className={`text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  selectedGrade === g.grade_id ? "ring-2 ring-primary" : ""
                }`}
              >
                <GradeLevelsCard {...g} isSelected={selectedGrade === g.grade_id} />
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedGrade && (
        <section className="rounded-lg border border-border bg-surface-elevated p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">2. Grupo</h2>
          {loadingGroups ? (
            <p className="text-sm text-fg-muted">Cargando grupos…</p>
          ) : classGroups.length === 0 ? (
            <p className="text-sm text-warning-foreground">No hay grupos registrados para este grado.</p>
          ) : (
            <select
              className="w-full max-w-xl rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground"
              value={selectedGroupId === "" ? "" : String(selectedGroupId)}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedGroupId(v === "" ? "" : Number(v));
              }}
            >
              <option value="">Selecciona un grupo…</option>
              {classGroups.map((cg) => (
                <option key={cg.id} value={cg.id}>
                  {cg.label} — {cg.active_students_count} alumno(s)
                </option>
              ))}
            </select>
          )}
        </section>
      )}

      {typeof selectedGroupId === "number" && selectedGroupId > 0 && (
        <section className="rounded-lg border border-border bg-surface-elevated p-4 shadow-sm space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">3. Descargas</h2>
              <p className="text-xs text-fg-muted mt-1">
                El Excel incluye columnas de seguimiento. El archivo comprimido de fotos es{" "}
                <strong>ZIP</strong> (no RAR: el servidor no genera RAR).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={downloadingExcel || loadingRows || !payload}
                onClick={onDownloadExcel}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {downloadingExcel ? "Descargando…" : "Descargar Excel"}
              </button>
              <button
                type="button"
                disabled={downloadingZip || loadingRows || !payload}
                onClick={onDownloadZip}
                className="rounded-md border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground disabled:opacity-50"
              >
                {downloadingZip ? "Generando…" : "Descargar fotos (ZIP)"}
              </button>
            </div>
          </div>

          {loadingRows ? (
            <p className="text-sm text-fg-muted">Cargando alumnos…</p>
          ) : payload ? (
            <>
              <div className="flex flex-wrap gap-3 text-xs text-foreground">
                <span className="rounded-full bg-surface-muted px-3 py-1">Total: {stats.total}</span>
                <span className="rounded-full bg-success/10 px-3 py-1 text-success">
                  Con foto: {stats.withPhoto}
                </span>
                <span className="rounded-full bg-warning/10 px-3 py-1 text-warning-foreground">
                  Datos completos: {stats.complete}
                </span>
                {payload.meta.academic_year ? (
                  <span className="rounded-full bg-surface-muted px-3 py-1">
                    Ciclo: {payload.meta.academic_year}
                  </span>
                ) : null}
              </div>

              <div className="overflow-x-auto rounded-md border border-border">
                <table className="min-w-[1400px] w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-surface-muted text-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-2 py-2 font-semibold">Alumno</th>
                      <th className="px-2 py-2 font-semibold">Foto</th>
                      <th className="px-2 py-2 font-semibold">Datos</th>
                      <th className="px-2 py-2 font-semibold">Taller</th>
                      <th className="px-2 py-2 font-semibold">CURP</th>
                      <th className="min-w-[180px] px-2 py-2 font-semibold">Dirección</th>
                      <th className="px-2 py-2 font-semibold">Tutor</th>
                      <th className="px-2 py-2 font-semibold">Tel.</th>
                      <th className="px-2 py-2 font-semibold">Archivo foto</th>
                      <th className="min-w-[220px] px-2 py-2 font-semibold">Línea impresión</th>
                      <th className="px-2 py-2 font-semibold">Impresa</th>
                      <th className="px-2 py-2 font-semibold">NFC</th>
                      <th className="px-2 py-2 font-semibold">Listo entrega</th>
                      <th className="px-2 py-2 font-semibold">Pagado</th>
                      <th className="px-2 py-2 font-semibold">Entregado</th>
                      <th className="px-2 py-2 font-semibold">Perdido</th>
                      <th className="px-2 py-2 font-semibold">Repuesto #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payload.rows.map((row: CredentialRow) => (
                      <CredentialTableRow
                        key={row.student_id}
                        row={row}
                        disabled={patchingId === row.student_id}
                        onPatch={(patch) => applyTrackingPatch(row.student_id, patch)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </section>
      )}
    </div>
  );
}

function CredentialTableRow({
  row,
  disabled,
  onPatch,
}: {
  row: CredentialRow;
  disabled: boolean;
  onPatch: (p: Partial<CredentialTrackingState>) => void;
}) {
  const t = row.tracking;
  return (
    <tr className="border-t border-border odd:bg-surface-elevated even:bg-surface-muted/60">
      <td className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
        <Link href={`/students/${row.student_id}`} className="text-primary hover:underline">
          {row.full_name}
        </Link>
      </td>
      <td className="px-2 py-2">{row.has_photo ? "Sí" : "No"}</td>
      <td className="px-2 py-2">{row.data_complete ? "OK" : row.data_missing.join(", ")}</td>
      <td className="max-w-[140px] truncate px-2 py-2" title={row.workshop_names}>
        {row.workshop_names || "—"}
      </td>
      <td className="max-w-[120px] truncate px-2 py-2 font-mono text-[11px]" title={row.curp}>
        {row.curp || "—"}
      </td>
      <td className="max-w-[220px] px-2 py-2 text-[11px] text-foreground" title={row.address}>
        {row.address || "—"}
      </td>
      <td className="max-w-[120px] truncate px-2 py-2" title={row.tutor_name}>
        {row.tutor_name || "—"}
      </td>
      <td className="whitespace-nowrap px-2 py-2 font-mono text-[11px]">{row.phone || "—"}</td>
      <td className="max-w-[120px] truncate px-2 py-2 font-mono text-[11px]" title={row.photo_filename || ""}>
        {row.photo_filename || "—"}
      </td>
      <td className="max-w-[260px] px-2 py-2 text-[10px] leading-snug text-fg-muted" title={row.linea_impresion}>
        {row.linea_impresion}
      </td>
      <td className="px-2 py-2 text-center">
        <BoolCell
          checked={t.credential_printed}
          disabled={disabled}
          onChange={(v) => onPatch({ credential_printed: v })}
        />
      </td>
      <td className="px-2 py-2 text-center">
        <BoolCell checked={t.nfc_ready} disabled={disabled} onChange={(v) => onPatch({ nfc_ready: v })} />
      </td>
      <td className="px-2 py-2 text-center">
        <BoolCell
          checked={t.ready_to_deliver}
          disabled={disabled}
          onChange={(v) => onPatch({ ready_to_deliver: v })}
        />
      </td>
      <td className="px-2 py-2 text-center">
        <BoolCell checked={t.paid} disabled={disabled} onChange={(v) => onPatch({ paid: v })} />
      </td>
      <td className="px-2 py-2 text-center">
        <BoolCell checked={t.delivered} disabled={disabled} onChange={(v) => onPatch({ delivered: v })} />
      </td>
      <td className="px-2 py-2 text-center">
        <BoolCell checked={t.lost} disabled={disabled} onChange={(v) => onPatch({ lost: v })} />
      </td>
      <td className="px-2 py-2">
        <select
          className="w-16 rounded border border-border bg-surface-elevated px-1 py-0.5 text-[11px]"
          disabled={disabled}
          value={t.replacement_count ?? 0}
          onChange={(e) => onPatch({ replacement_count: Number(e.target.value) })}
        >
          {Array.from({ length: 51 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
