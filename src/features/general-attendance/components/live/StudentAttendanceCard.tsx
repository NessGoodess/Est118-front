"use client";

import { useEffect, useState } from "react";
import ReaderPanelGrid from "./ReaderPanelGrid";
import ReaderLogList from "./ReaderLogList";
import { useAttendanceStore } from "@/features/general-attendance/stores/attendance-store";
import { getRecentReadings, getCurrentStudent } from "@/features/general-attendance/services/attendance.service";

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
    <div className="space-y-4 2xl:space-y-6">
      <ReaderPanelGrid />
      <ReaderLogList records={records} loading={isLoadingInitial} />
    </div>
  );
}
