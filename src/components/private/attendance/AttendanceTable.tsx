
import AdvancedTable, { Column } from "@/components/ui/AdvancedTable";
import { Student, AttendanceStatus } from "@/lib/types/attendance";

interface AttendanceTableProps {
  students: Student[];
  onAttendanceChange: (studentId: number, status: AttendanceStatus) => void;
}

export default function AttendanceTable({ students, onAttendanceChange }: AttendanceTableProps) {
  // Reparar: Asegurarse de que los datos y columnas coincidan con la estructura real de Student
  // y que los parámetros de render estén tipados correctamente.

  const attendanceOptions: { status: AttendanceStatus; label: string; color: string }[] = [
    { status: "present", label: "P", color: "green" },
    { status: "absent", label: "F", color: "red" },
    { status: "late", label: "R", color: "yellow" },
    { status: "excused", label: "J", color: "blue" },
  ];

  const attendanceColumns: Column<Student>[] = [
    {
      key: "student_id",
      header: "ID",
      width: "80px",
      align: "center",
      render: (value: unknown) => (
        <span className="text-fg-muted font-mono">{value as Student["student_id"]}</span>
      ),
    },

    {
      key: "last_name",
      header: "Apellidos",
      render: (value: unknown, row: Student) => (
        <div>
          <div className="font-medium text-foreground">{row.last_name}</div>
        </div>
      ),
    },
    {
      key: "name",
      header: "Nombre",
      render: (value: unknown, row: Student) => (
        <div>
          <div className="font-medium text-foreground">{row.name}</div>
        </div>
      ),
    },
    {
      key: "current_attendance",
      header: "Asistencia Actual",
      render: (value: unknown) => {
        const attendance = value as Student["current_attendance"];
        return (
          <span className="text-primary text-sm">
            {attendance?.status ?? "Sin registrar"}
          </span>
        );
      },
    },
    {
      key: "attendance",
      header: "Asistencia",
      width: "300px",
      align: "center",
      render: (_: unknown, row: Student) => (
        <div className="flex justify-center gap-4">
          {
            attendanceOptions.map((item) => (
              <label key={item.status} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`attendance-${row.student_id}`}
                  value={item.status}
                  checked={row.current_attendance?.status === item.status}
                  onChange={() => onAttendanceChange(row.student_id, item.status)}
                  className="text-primary focus:ring-ring"
                />
                <span className={`text-${item.color}-600 font-medium`}>
                  {item.label}
                </span>
              </label>
            ))
            }
        </div>
      ),
    },
  ];

  return (
    <AdvancedTable
      data={students}
      columns={attendanceColumns}
      keyField="student_id"
      emptyMessage="No hay estudiantes en esta clase"
    />
  );
}