import {EnhancedTableConfig } from "@/lib/types/data-table";
import { PreEnrollmentListItem } from "@/features/admissions/types/pre-enrollment-api";

export const studentsTableConfig: EnhancedTableConfig<PreEnrollmentListItem> = {
  columns: [
    {
      key: 'folio',
      label: 'Folio',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      label: 'Etapa',
      width: '140px',
      render: 'pre-status',
      sortable: true,
      searchable: true,
    },
    {
      key: 'documents_status',
      label: 'Documentos',
      width: '140px',
      render: 'docs-status',
      sortable: true,
      searchable: true,
    },
    {
      key: 'payment_status',
      label: 'Pago',
      width: '140px',
      render: 'pay-status',
      sortable: true,
      searchable: true,
    },
    {
      key: 'converted_student_id',
      label: 'Inst.',
      width: '120px',
      render: 'enrollment-done',
      sortable: true,
      searchable: false,
    },
    {
      key: 'full_name',
      label: 'Nombre Completo',
      width: 'auto',
      align: 'left' as const,
      sortable: true,
    },
    {
      key: 'curp',
      label: 'CURP',
      width: 'auto',
      align: 'left' as const,
    },
    {
      key: 'gender',
      label: 'Sexo',
      width: 'auto',
      align: 'center' as const,
    },
    {
      key: 'age',
      label: 'Edad',
      width: 'auto',
      align: 'center' as const,
    },
    {
      key: 'guardian_name',
      label: 'Tutor',
      width: 'auto',
      align: 'left' as const,
    },
    {
      key: 'guardian_phone',
      label: 'Teléfono',
      width: 'auto',
      align: 'left' as const,
    },
    {
      key: 'contact_email',
      label: 'Email',
      width: 'auto',
      align: 'left' as const,
      render: 'email-link',
    },
    {
      key: 'created_at',
      label: 'Fecha de registro',
      width: 'auto',
      align: 'left' as const,
      render: 'date',
    },
  ],
  actions: [
    {
      label: '',
      icon: 'eye',
      href: (student: PreEnrollmentListItem) => `/admissions/applications/${student.id}`,
      variant: 'secondary' as const,
    },
    {
      label: '',
      icon: 'edit',
      href: (student: PreEnrollmentListItem) => `/admissions/applications/${student.id}/edit`,
      variant: 'primary' as const,
    },
    {
      label: '',
      icon: 'trash',
      onClick: (student: PreEnrollmentListItem) => console.log('Eliminar', student),
      variant: 'danger' as const,
      show: (student: PreEnrollmentListItem) => student.status === 'inactive',
    },
  ],

  features: {
    rowClickable: true,
    rowClickRoute: (item: PreEnrollmentListItem) => `/admissions/applications/${item.id}`,
    selectionEnabled: true,
    batchActions: [
      {
        label: 'Exportar Seleccionados',
        icon: 'download',
        action: (items: unknown[]) => console.log('Exportar', items),
      },
    ],
  },

  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  selectable: true,
};