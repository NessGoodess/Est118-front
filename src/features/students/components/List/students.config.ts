import { EnhancedTableConfig } from "@/lib/types/data-table";
import { Student } from "@/features/students/types/students";
import { STUDENT_PERMISSIONS } from "@/features/students/permissions";

export const studentsTableConfig: EnhancedTableConfig<Student> = {
  columns: [
    {
      key: "photo_url",
      label: "Foto",
      sortable: false,
      searchable: false,
      width: "56px",
      align: "center",
      render: "student-photo",
    },
    {
      key: "name",
      label: "Nombre",
      sortable: true,
      searchable: true,
    },
    {
      key: "birth_date",
      label: "Fecha de Nacimiento",
      sortable: true,
      searchable: true,
    },
    {
      key: "gender",
      label: "Sexo",
      sortable: true,
      searchable: true,
    },
    {
      key: "phone",
      label: "Teléfono",
      sortable: true,
      searchable: true,
    },
    {
      key: "grade_level",
      label: "Grado",
      sortable: true,
      searchable: true,
    },
    {
      key: "class_group",
      label: "Grupo",
      sortable: true,
      searchable: true,
    },
  ],
  actions: [
    {
      label: "",
      icon: "eye",
      variant: "secondary" as const,
      permission: STUDENT_PERMISSIONS.view,
      href: (student: Student) => `/students/${student.id}`,
    },
    {
      label: "",
      icon: "camera",
      variant: "primary" as const,
      permission: STUDENT_PERMISSIONS.managePhotos,
      onClick: (student: Student) => student.id,
    },
    /*{
      label: '',
      icon: 'edit',
      permission: STUDENT_PERMISSIONS.edit,
      onClick: (student: Student) => console.log('Editar', student),
      variant: 'primary' as const,
    },
    {
      label: '',
      icon: 'trash',
      permission: STUDENT_PERMISSIONS.delete,
      onClick: (student: Student) => console.log('Eliminar', student),
      variant: 'danger' as const,
      show: (student: Student) => student.status === 'inactive',
    },*/
  ],

  features: {
    rowClickable: true,
    rowClickRoute: (item: Student) => `/students/${item.id}`,
    selectionEnabled: true,
    batchActions: [
      {
        label: "Exportar Seleccionados",
        icon: "download",
        action: (items: unknown[]) => console.log("Exportar", items),
      },
    ],
  },

  itemsPerPage: 15,
  searchable: true,
  sortable: true,
  selectable: true,
};
