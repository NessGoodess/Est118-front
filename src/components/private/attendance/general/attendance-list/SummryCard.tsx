
interface SummaryCardProps {
  label: string;
  value: number;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
}
export default function SummaryCard({
  label,
  value,
  tone,
}: SummaryCardProps) {
  const tones = {
    neutral: "bg-surface-elevated text-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning-foreground",
    danger: "bg-danger/10 text-danger",
    info: "bg-primary-soft text-info",
  };

  return (
    <div className={`rounded-lg border-2 border-primary p-3 ${tones[tone]}`}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}