import type { SummaryTone } from "./summary-filters.config";

interface SummaryCardProps {
  label: string;
  value: number;
  tone: SummaryTone;
  selected?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

const tones: Record<SummaryTone, string> = {
  neutral: "bg-surface-elevated text-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning-foreground",
  danger: "bg-danger/10 text-danger",
  info: "bg-primary-soft text-info",
};

export default function SummaryCard({
  label,
  value,
  tone,
  selected = false,
  onClick,
  loading = false,
}: SummaryCardProps) {
  return (
    <button
      type="button"
      onClick={loading ? undefined : onClick}
      disabled={loading}
      aria-pressed={selected}
      aria-busy={loading}
      className={`w-full rounded-lg border p-2 text-left transition-colors lg:p-3 ${tones[tone]} ${
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-border"
      } ${loading ? "pointer-events-none animate-pulse" : ""}`}
    >
      {loading ? (
        <>
          <span className="mb-1.5 block h-7 w-10 rounded-md bg-foreground/10" />
          <span className="block h-3 w-14 rounded-md bg-foreground/10" />
          <span className="sr-only">Cargando {label}</span>
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-xs font-medium opacity-80">{label}</p>
        </>
      )}
    </button>
  );
}
