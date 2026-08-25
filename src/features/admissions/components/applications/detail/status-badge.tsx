import { IconByName } from "@/components/ui/icons";
import { resolveStatus, STATUS_CONFIG } from "./format";

export default function StatusBadge({ status }: { status?: string }) {
  const key = resolveStatus(status);
  const { label, className, icon } = STATUS_CONFIG[key];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <IconByName name={icon} className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
