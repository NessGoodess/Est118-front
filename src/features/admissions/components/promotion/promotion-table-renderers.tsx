export const promotionTableRenderers = {
  "grade-badge": (value: unknown) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-surface-muted text-foreground border-border">
      {(value as string) || "N/A"}
    </span>
  ),
  "group-badge": (value: unknown) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-primary-soft text-primary border-border">
      {(value as string) || "N/A"}
    </span>
  ),
};

