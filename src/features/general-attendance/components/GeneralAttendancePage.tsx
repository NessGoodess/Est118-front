"use client";

import { useEffect, useMemo, useState } from "react";
import StudentAttendanceCard from "@/features/general-attendance/components/live/StudentAttendanceCard";
import StudentAttendanceList from "@/features/general-attendance/components/history/StudentAttendanceList";
import ReadersAndRulesPage from "@/features/general-attendance/components/settings/ReadersAndRulesPage";
import CycleHint from "@/features/general-attendance/components/CycleHint";
import { GeneralAttendanceProvider } from "@/features/general-attendance/contexts/GeneralAttendanceContext";
import { MultiReaderEchoProvider } from "@/features/general-attendance/contexts/MultiReaderEchoContext";
import { useGeneralAttendanceCapabilities } from "@/features/general-attendance/hooks/capabilities/useGeneralAttendanceCapabilities";
import GenericHeader from "@/components/ui/GenericHeader";
import TabButton from "@/components/ui/TabButton";
import ReaderArmBar from "@/features/general-attendance/components/live/ReaderArmBar";

type TabKey = "live" | "history" | "ops";

type TabDef = { name: string; key: TabKey };

function GeneralAttendanceContent() {
  const { canView, canManageReadings, canEdit } =
    useGeneralAttendanceCapabilities();

  const tabs = useMemo<TabDef[]>(() => {
    const next: TabDef[] = [];
    if (canManageReadings) {
      next.push({ name: "Pase de Lista General", key: "live" });
    }
    if (canView) {
      next.push({ name: "Historial de Asistencia", key: "history" });
    }
    if (canManageReadings || canEdit) {
      next.push({ name: "Horarios y Lectores", key: "ops" });
    }
    return next;
  }, [canView, canManageReadings, canEdit]);

  const [selectedKey, setSelectedKey] = useState<TabKey | null>(null);

  useEffect(() => {
    if (tabs.length === 0) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !tabs.some((t) => t.key === selectedKey)) {
      setSelectedKey(tabs[0].key);
    }
  }, [tabs, selectedKey]);

  const activeKey = selectedKey ?? tabs[0]?.key;
  const selectedIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === activeKey)
  );

  if (tabs.length === 0) {
    return (
      <div className="space-y-6">
        <GenericHeader title="Asistencia General" description="" />
        <p className="rounded-lg border border-border bg-surface-elevated p-6 text-sm text-fg-muted">
          No tienes permisos para ver esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 lg:space-y-4 2xl:space-y-6">
      <GenericHeader
        title="Asistencia General"
        description=""
        bottomContent={canView ? <CycleHint /> : null}
      >
        <ReaderArmBar />
      </GenericHeader>

      <div className="rounded-lg">
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-6">
          <nav
            className="flex min-w-max gap-4 sm:gap-6 bg-surface-elevated rounded-xl border border-border shadow-sm"
            aria-label="Tabs de asistencia"
            role="tablist"
          >
            {tabs.map((tab, idx) => (
              <TabButton
                key={tab.key}
                tab={tab}
                idx={idx}
                selected={selectedIndex}
                onClick={(i) => setSelectedKey(tabs[i].key)}
              />
            ))}
          </nav>
        </div>


        <section
          role="tabpanel"
          id={`tabpanel-${activeKey}`}
          aria-labelledby={`tab-${activeKey}`}
          className="pt-4"
        >
          {activeKey === "live" && <StudentAttendanceCard />}
          {activeKey === "history" && <StudentAttendanceList />}
          {activeKey === "ops" && <ReadersAndRulesPage />}
        </section>
      </div>
    </div>
  );
}

export default function GeneralAttendancePage() {
  const { canView, canManageReadings } = useGeneralAttendanceCapabilities();

  const content = <GeneralAttendanceContent />;

  const withRoster = canView ? (
    <GeneralAttendanceProvider>{content}</GeneralAttendanceProvider>
  ) : (
    content
  );

  if (canManageReadings) {
    return <MultiReaderEchoProvider>{withRoster}</MultiReaderEchoProvider>;
  }

  return withRoster;
}
