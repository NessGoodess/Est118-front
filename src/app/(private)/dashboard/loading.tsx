import ContentLayout from "@/components/ui/ContentLayout";
import SectionSkeleton, {
  SkeletonBone,
  SkeletonCard,
} from "@/components/ui/skeleton/SectionSkeleton";
import StudentsDashboardSectionSkeleton from "@/features/students/components/dashboard/StudentsDashboardSectionSkeleton";

function WelcomeSkeleton() {
  return (
    <SectionSkeleton
      showHeader={false}
      className="mb-2 lg:mb-6"
      label="Cargando bienvenida"
    >
      <SkeletonCard className="flex items-center justify-between p-5 sm:p-6">
        <div className="space-y-2 min-w-0 flex-1">
          <SkeletonBone className="h-6 w-56 max-w-full" />
          <SkeletonBone className="h-3.5 w-48 max-w-full bg-surface-muted/80" />
        </div>
        <SkeletonBone className="hidden h-14 w-14 shrink-0 rounded-full md:block" />
      </SkeletonCard>
    </SectionSkeleton>
  );
}

function CalendarSkeleton() {
  return (
    <SectionSkeleton as="section" showHeader={false} label="Cargando calendario">
      <SkeletonCard className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <SkeletonBone className="h-4 w-28" />
          <SkeletonBone className="h-7 w-16 rounded-lg" />
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <SkeletonBone key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </SkeletonCard>
    </SectionSkeleton>
  );
}

export default function DashboardLoading() {
  return (
    <ContentLayout side={<CalendarSkeleton />} sidePosition="right">
      <WelcomeSkeleton />
      <StudentsDashboardSectionSkeleton />
    </ContentLayout>
  );
}
