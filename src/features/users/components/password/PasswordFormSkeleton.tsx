import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

/** Skeleton del formulario de cambio de contraseña (card + acciones). */
export default function PasswordFormSkeleton({
  label = "Cargando cambio de contraseña",
}: {
  label?: string;
}) {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-busy="true"
      aria-label={label}
    >
      <div className="space-y-4 rounded-lg border border-border bg-surface-elevated p-4 shadow-card">
        <SkeletonBone className="h-12 w-full" />
        <SkeletonBone className="h-12 w-full" />
        <SkeletonBone className="h-24 w-full rounded-lg" />
      </div>
      <div className="flex justify-end gap-3">
        <SkeletonBone className="h-10 w-24" />
        <SkeletonBone className="h-10 w-28" />
      </div>
    </div>
  );
}
