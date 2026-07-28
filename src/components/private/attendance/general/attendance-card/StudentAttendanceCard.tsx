"use client";

import { useEffect, useState } from "react";
import ReaderArmBar from "@/components/private/attendance/general/attendance-card/ReaderArmBar";
import ReaderPanelGrid from "@/components/private/attendance/general/attendance-card/ReaderPanelGrid";
import ReaderLogList from "@/components/private/attendance/general/attendance-card/ReaderLogList";
import { useAttendanceStore } from "@/stores/attendance-store";
import { getRecentReadings, getCurrentStudent } from "@/lib/services/attendance.service";

export default function StudentAttendanceCard() {
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const { records, addRecord, setInitialRecords } = useAttendanceStore();

  useEffect(() => {
    async function loadInitialData() {
      setIsLoadingInitial(true);
      try {
        const history = await getRecentReadings(20);
        if (history.length > 0) {
          setInitialRecords(history);
        } else {
          const current = await getCurrentStudent();
          if (current) {
            addRecord(current, "api");
          }
        }
      } catch (error) {
        console.error("Error loading initial attendance data:", error);
      } finally {
        setIsLoadingInitial(false);
      }
    }

    loadInitialData();
  }, [setInitialRecords, addRecord]);

  return (
    <div className="space-y-6">
      <ReaderArmBar />
      <ReaderPanelGrid />

      <article className="overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-2xl">
        <div className="border-b border-border bg-gradient-to-r from-surface-muted to-primary-soft px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-foreground">Lecturas recientes</h3>
            <span className="rounded-full bg-primary-soft px-2 py-0 text-sm font-bold text-primary">
              {records.length}
            </span>
          </div>
          <p className="text-sm text-fg-muted">
            Bitácora de eventos NFC (entrada, salida, ignoradas)
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <ReaderLogList records={records} loading={isLoadingInitial} />
        </div>
      </article>
    </div>
  );
}
