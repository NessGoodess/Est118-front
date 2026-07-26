
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
    neutral: "bg-white text-gray-900",
    success: "bg-green-50 text-green-800",
    warning: "bg-amber-50 text-amber-900",
    danger: "bg-red-50 text-red-800",
    info: "bg-sky-50 text-sky-800",
  };

  return (
    <div className={`rounded-lg border-2 border-blue-900 p-3 ${tones[tone]}`}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}