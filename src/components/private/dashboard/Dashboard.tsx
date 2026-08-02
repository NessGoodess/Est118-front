"use client";

import StudentsDashboardSection from "@/features/students/components/dashboard/StudentsDashboardSection";
import ContentLayout from "@/components/ui/ContentLayout";
import MonthlyCalendar from "@/components/ui/MonthlyCalendar";

export default function Dashboard() {
  return (
    <ContentLayout side={<MonthlyCalendar />} sidePosition="right">
      <article className="mb-2 flex items-center justify-between rounded-xl border border-border bg-surface-elevated p-4 text-foreground shadow-sm sm:p-5 lg:mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            ¡Bienvenido de vuelta!
          </h3>
          <p className="mt-0.5 text-sm text-fg-muted">
            Escuela Secundaria Técnica 118
          </p>
        </div>
        <div className="hidden md:block">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-muted">
            <svg
              className="h-6 w-6 text-fg-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
      </article>

      <StudentsDashboardSection />
    </ContentLayout>
  );
}
