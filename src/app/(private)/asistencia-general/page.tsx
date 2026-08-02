"use client";

import { useState } from "react";
import StudentAttendanceCard from "@/components/private/attendance/general/attendance-card/StudentAttendanceCard";
import StudentAttendanceList from "@/components/private/attendance/general/attendance-list/StudentAttendanceList";
import ReaderOpsPage from "@/components/private/attendance/general/readers-config/ReaderOpsPage";
import { GeneralAttendanceProvider } from "@/contexts/GeneralAttendanceContext";
import { MultiReaderEchoProvider } from "@/contexts/MultiReaderEchoContext";
import GenericHeader from "@/components/ui/GenericHeader";
import TabButton from "@/components/ui/TabButton";
import CycleHint from "@/components/private/attendance/CycleHint";

const tabs = [
  { name: "Pase de Lista General", key: "live" as const },
  { name: "Historial de Asistencia", key: "history" as const },
  { name: "Lectores", key: "ops" as const },
];

function GeneralAttendanceContent() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <section className="space-y-6">
      <GenericHeader title="Asistencia General" description=""  bottomContent={<CycleHint />} />
      <div className="rounded-lg">
        <div className="border-b border-border">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-6 pb-1">
            <nav
              className="flex gap-4 sm:gap-6 min-w-max"
              aria-label="Tabs de asistencia"
              role="tablist"
            >
              {tabs.map((tab, idx) => (
                <TabButton
                  key={tab.key}
                  tab={tab}
                  idx={idx}
                  selected={selectedTab}
                  onClick={setSelectedTab}
                />
              ))}
            </nav>
          </div>
        </div>

        <div
          role="tabpanel"
          id={`tabpanel-${selectedTab}`}
          aria-labelledby={`tab-${selectedTab}`}
          className="pt-4"
        >
          {selectedTab === 0 && <StudentAttendanceCard />}
          {selectedTab === 1 && <StudentAttendanceList />}
          {selectedTab === 2 && <ReaderOpsPage />}
        </div>
      </div>
    </section>
  );
}

export default function GeneralAttendance() {
  return (
    <GeneralAttendanceProvider>
      <MultiReaderEchoProvider>
        <GeneralAttendanceContent />
      </MultiReaderEchoProvider>
    </GeneralAttendanceProvider>
  );
}
