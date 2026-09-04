import { Grade } from "@/features/students/types/students";
import { IconByName } from "@/components/ui/icons";

export default function GradeLevelsCard({
  grade_name,
  total_students,
  total_groups,
  isSelected,
}: Grade & { isSelected: boolean }) {
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-xl border-2 bg-surface-elevated px-3 py-2.5 text-left text-foreground shadow-sm transition-colors
        ${isSelected ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40 hover:bg-surface-muted"}`}
    >
      <div
        className={`hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold
          ${isSelected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground"}`}
      >
        <IconByName name="book" className="w-5 h-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs lg:text-sm font-semibold leading-tight">
          {grade_name} grado
        </p>
        <p className="mt-0.5 truncate text-[10px] lg:text-xs text-fg-muted">
          {total_students} alumnos <span className="hidden lg:inline">· {total_groups} grupos </span> 
        </p>
      </div>

    </div>
  );
}
