import { EnhancedTableConfig } from "@/lib/types/data-table";
import { AttendanceTableRow } from "./attendance-list.renderers";

export const attendanceListTableConfig: EnhancedTableConfig<AttendanceTableRow> = {
  columns: [
    {
      key: "name",
      label: "Alumno",
      render: "attendance-student",
      sortable: true,
      searchable: true,
      align: "left",
    },
    {
      key: "groupLabel",
      label: "Grupo",
      sortable: true,
      searchable: true,
      align: "left",
    },
    {
      key: "status",
      label: "Estado",
      width: "120px",
      render: "attendance-status",
      sortable: true,
      searchable: true,
      align: "center",
    },
    {
      key: "entryTime",
      label: "Entrada",
      width: "100px",
      sortable: true,
      align: "center",
    },
    {
      key: "exitTime",
      label: "Salida",
      width: "100px",
      sortable: true,
      align: "center",
    },
    {
      key: "credential_status",
      label: "Credencial",
      render: "attendance-credential",
      sortable: true,
      searchable: true,
      align: "left",
    },
  ],
  itemsPerPage: 25,
  searchable: true,
  sortable: true,
  selectable: false,
};
