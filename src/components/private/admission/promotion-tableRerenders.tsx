export const promotionTableRenderers = {
  "grade-badge": (value: unknown) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
      {(value as string) || "N/A"}
    </span>
  ),
  "group-badge": (value: unknown) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
      {(value as string) || "N/A"}
    </span>
  ),
};

