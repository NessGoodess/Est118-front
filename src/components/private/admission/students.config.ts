import { TableConfig } from "@/lib/types/data-table";
import { PreEnrollmentListItem } from "@/lib/types/admission/preEnrollmentApi";

export const studentsTableConfig: TableConfig<PreEnrollmentListItem> = {
  columns: [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      sortable: true,
    },
    {
      key: 'folio',
      label: 'Folio',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      label: 'Estado',
      width: '120px',
      render: 'status-badge', // ← Nombre del renderer
    },
    {
      key: 'full_name',
      label: 'Nombre',
      width: '100px',
      align: 'center' as const,
      sortable: true,
    },
    {
      key: 'curp',
      label: 'CURP',
      width: '100px',
      align: 'center' as const,
    },
    {
      key: 'gender',
      label: 'Sexo',
      width: '100px',
      align: 'center' as const,
    },
    {
      key: 'age',
      label: 'Edad',
      width: '100px',
      align: 'center' as const,
    },
    {
      key: 'guardian_name',
      label: 'Tutor',
      width: '100px',
      align: 'center' as const,
    },
    {
      key: 'guardian_phone',
      label: 'Tutor',
      width: '100px',
      align: 'center' as const,
    },
    {
      key: 'contact_email',
      label: 'Email',
      width: '100px',
      align: 'center' as const,
    },
    {
      key: 'created_at',
      label: 'Fecha',
      width: '100px',
      align: 'center' as const,
    },
  ],
  actions: [
    {
      label: 'Ver',
      icon: 'eye', // ← Nombre del icono
      onClick: (student: PreEnrollmentListItem) => console.log('Ver', student),
      variant: 'secondary' as const,
    },
    {
      label: 'Editar',
      icon: 'edit',
      onClick: (student: PreEnrollmentListItem) => console.log('Editar', student),
      variant: 'primary' as const,
    },
    {
      label: 'Eliminar',
      icon: 'trash',
      onClick: (student: PreEnrollmentListItem) => console.log('Eliminar', student),
      variant: 'danger' as const,
      show: (student: PreEnrollmentListItem) => student.status === 'inactive',
    },
  ],
  itemsPerPage: 5,
  searchable: true,
  sortable: true,
  selectable: true,
};