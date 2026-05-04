"use client";

export type CardStatus = "active" | "closed" | "upcoming";

export interface CardOptionData {
  id: string | number;
  title: string;
  subtitle: string;
  status: CardStatus;
  startDate: string;
  endDate: string;
  studentCount: number;
  lastFolio: string;
}

interface CardOptionProps {
  data: CardOptionData;
  selected?: boolean;
  onClick?: (data: CardOptionData) => void;
}

const statusConfig: Record<
  CardStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  active: {
    label: "Activo",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  closed: {
    label: "Cerrado",
    badgeClass: "bg-zinc-100 text-zinc-600 border border-zinc-200",
    dotClass: "bg-zinc-400",
  },
  upcoming: {
    label: "Próximo",
    badgeClass: "bg-sky-50 text-sky-700 border border-sky-200",
    dotClass: "bg-sky-500",
  },
};

export function CardOption({ data, selected = false, onClick }: CardOptionProps) {
  const status = statusConfig[data.status];

  return (
    <button
      type="button"
      onClick={() => onClick?.(data)}
      aria-pressed={selected}
      className={`relative w-full max-w-lg min-w-sm text-left rounded-xl border px-5 py-4 transition-all duration-200 cursor-pointer group focus-visible:outline-none  ${selected
        ? "border-blue-900 border-2 bg-white -translate-y-1 -translate-x-1 shadow-xl active:translate-y-0 active:translate-x-0 active:shadow-none"
        : "border-zinc-200 bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-xl hover:border-zinc-300 active:translate-y-0 active:translate-x-0 active:shadow-none"
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${selected ? "bg-sky-100" : "bg-zinc-100 group-hover:bg-sky-50"
              }`}
          >
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 leading-tight">
              {data.title}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{data.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100 my-3" />

      {/* Metadata grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-0.5">
            Fecha inicio
          </p>
          <p className="text-sm font-medium text-zinc-800">{data.startDate}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-0.5">
            Fecha fin
          </p>
          <p className="text-sm font-medium text-zinc-800">{data.endDate}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-0.5">
            Alumnos
          </p>
          <p className="text-sm font-medium text-zinc-800">
            {data.studentCount > 0 ? data.studentCount.toLocaleString("es-MX") : "Sin registros"}
          </p>
        </div>
      </div>

      {/* Last folio */}
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-0.5">
          Último folio
        </p>
        <p className="text-xs font-mono font-medium text-zinc-700 tracking-wide">
          {data.lastFolio || "0000"}
        </p>
      </div>
    </button>
  );
}
