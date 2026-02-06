"use client"
import { useState } from "react";
import StudentAttendanceCard from "@/components/private/attendance/StudentAttendanceCard";
import StudentAttendanceList from "@/components/private/attendance/StudentAttendanceList";
import { GeneralAttendanceProvider } from "@/contexts/GeneralAttendanceContext";
import GenericHeader from "@/components/ui/GenericHeader";

const tabs = [
  {
    name: "Pase de Lista General",
    component: <StudentAttendanceCard />,
  },
  {
    name: "Lista de Estudiantes",
    component: <StudentAttendanceList />,
  },
];

function GeneralAttendanceContent() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <section className="">
      <GenericHeader title="Asistencia General" description=""/>
      <div className="rounded-lg shadow-sm">

        <div className="border-b border-gray-200">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-6 pb-1">
            <nav
              className="flex gap-4 sm:gap-6 min-w-max"
              aria-label="Tabs de asistencia"
              role="tablist"
            >
              {tabs.map((tab, idx) => (
                <button
                  key={tab.name}
                  id={`tab-${idx}`}
                  className={`whitespace-nowrap py-3 sm:py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 
                      ${selectedTab === idx
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                    `}
                  onClick={() => handleTabChange(idx)}
                  type="button"
                  aria-selected={selectedTab === idx}
                  aria-controls={`tabpanel-${idx}`}
                  role="tab"
                  tabIndex={selectedTab === idx ? 0 : -1}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div
          className="p-4 sm:p-6"
          role="tabpanel"
          id={`tabpanel-${selectedTab}`}
          aria-labelledby={`tab-${selectedTab}`}
        >
          {tabs[selectedTab].component}
        </div>
      </div>
    </section>
  );
}

export default function GeneralAttendance() {
  return (
    <GeneralAttendanceProvider>
      <GeneralAttendanceContent />
    </GeneralAttendanceProvider>
  );
}