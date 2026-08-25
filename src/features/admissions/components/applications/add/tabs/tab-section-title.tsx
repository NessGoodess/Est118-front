import { IconByName, type AppIconName } from "@/components/ui/icons";
import type { ReactNode } from "react";

export default function TabSectionTitle({
  title,
  icon,
  children,
}: {
  title: string;
  icon: AppIconName;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-surface-elevated p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-2">
        <div className="rounded-lg bg-surface-muted p-1.5">
          <IconByName name={icon} className="h-4 w-4 text-fg-muted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children ? children : null}
    </div>
  );
}

export function FieldIcon({ name }: { name: AppIconName }) {
  return <IconByName name={name} className="h-4 w-4" />;
}
