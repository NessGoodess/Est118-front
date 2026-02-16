import { PreEnrollmentListItem } from "@/lib/types/admission/preEnrollmentApi";
import {EnhancedTableConfig } from "@/lib/types/data-table";
import { Student } from "@/lib/types/students";

export const studentsTableConfig: EnhancedTableConfig<Student> = {
  columns: [
    {
      key: 'photo_url',
      label: 'Foto',
      sortable: false,
      searchable: false,
      width: '56px',
      align: 'center',
      render: 'student-photo',
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      searchable: true,
    },
    {
      key: 'birth_date',
      label: 'Fecha de Nacimiento',
      sortable: true,
      searchable: true,
    },
    {
      key: 'gender',
      label: 'Sexo',
      sortable: true,
      searchable: true,
    },
    {
      key: 'phone',
      label: 'Teléfono',
      sortable: true,
      searchable: true,
    },
    {
      key: 'grade_level',
      label: 'Grado',
      sortable: true,
      searchable: true,
    },
    {
      key: 'class_group',
      label: 'Grupo',
      sortable: true,
      searchable: true,
    },
  ],
  actions: [
    {
      label: '',
      icon: 'eye',
      onClick: (student: Student) => `/admissions/${student.id}`,
      variant: 'secondary' as const,
    },
    /*{
      label: '',
      icon: 'edit',
      onClick: (student: PreEnrollmentListItem) => console.log('Editar', student),
      variant: 'primary' as const,
    },
    {
      label: '',
      icon: 'trash',
      onClick: (student: Student) => console.log('Eliminar', student),
      variant: 'danger' as const,
      show: (student: Student) => student.status === 'inactive',
    },*/
  ],

  features: {
    rowClickable: true,
    rowClickRoute: (item: Student) => `/admissions/${item.id}`,
    selectionEnabled: true,
    batchActions: [
      {
        label: 'Exportar Seleccionados',
        icon: 'download',
        action: (items: unknown[]) => console.log('Exportar', items),
      },
    ],
  },

  itemsPerPage: 15,
  searchable: true,
  sortable: true,
  selectable: true,
};