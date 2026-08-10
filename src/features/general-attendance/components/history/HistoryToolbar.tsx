"use client";

import { formatLongWithoutTime } from "@/lib/utils/dateFormatter";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import { ALL_OPTION } from "./useAttendanceRosterFilters";

export type HistoryViewMode = "cards" | "list";

type HistoryToolbarProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  gradeFilter: string;
  groupFilter: string;
  gradeOptions: string[];
  groupOptions: string[];
  onGradeChange: (grade: string) => void;
  onGroupChange: (group: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  viewMode: HistoryViewMode;
  onViewModeChange: (mode: HistoryViewMode) => void;
};

const fieldClass = "w-full min-w-0";

export default function HistoryToolbar({
  selectedDate,
  onDateChange,
  gradeFilter,
  groupFilter,
  gradeOptions,
  groupOptions,
  onGradeChange,
  onGroupChange,
  query,
  onQueryChange,
  viewMode,
  onViewModeChange,
}: HistoryToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-x-3 gap-y-2">
        <h2 className="min-w-0 text-base font-semibold text-foreground sm:text-lg">
          Asistencia del {formatLongWithoutTime(selectedDate)}
        </h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            if (e.target.value) onDateChange(e.target.value);
          }}
          aria-label="Fecha"
          className="rounded-lg border border-border bg-surface-elevated w-max py-1.5 text-sm text-foreground lg:hidden"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-surface-elevated p-2 shadow-sm sm:gap-3 sm:p-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.5fr)_auto] xl:items-end">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:contents">
          <FloatingSelect
            label="Grado"
            value={gradeFilter}
            hideMessage
            onChange={(e) => onGradeChange(e.target.value)}
            className={fieldClass}
          >
            <option value={ALL_OPTION}>Todos</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </FloatingSelect>

          <FloatingSelect
            label="Grupo"
            value={groupFilter}
            hideMessage
            onChange={(e) => onGroupChange(e.target.value)}
            className={fieldClass}
          >
            <option value={ALL_OPTION}>Todos</option>
            {groupOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </FloatingSelect>
        </div>

        <div className="flex items-end gap-2 sm:gap-3 xl:contents">
          <FloatingInput
            type="text"
            id="history-roster-search"
            name="history-roster-search"
            label="Buscar"
            value={query}
            hideMessage
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Nombre o apellido…"
            className="min-w-0 flex-1 xl:w-full"
            autoComplete="off"
          />

          <div className="grid h-[2.85rem] w-[9rem] shrink-0 grid-cols-2 overflow-hidden rounded-xl sm:w-44">
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:px-4 border-2 border-border rounded-xl rounded-r-none ${
                viewMode === "cards"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface-elevated text-fg-muted hover:bg-surface-muted"
              }`}
            >
              Targeta
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:px-4 border-2 border-border rounded-xl rounded-l-none ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface-elevated text-fg-muted hover:bg-surface-muted"
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
