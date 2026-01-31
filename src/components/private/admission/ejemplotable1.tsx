// ============================================================================
// lib/tables/students.table.ts
// Configuración de tabla de estudiantes
// ============================================================================

import { TableColumn, TableAction } from '@/components/DataTable';

export interface Student {
  id: number;
  name: string;
  controlNumber: string;
  grade: string;
  group: string;
  status: 'active' | 'inactive' | 'suspended';
  email: string;
  phone: string;
  enrollmentDate: string;
  photo?: string;
}

export const studentsTableColumns: TableColumn<Student>[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
    sortable: true,
    align: 'center',
  },
  {
    key: 'photo',
    label: 'Foto',
    width: '80px',
    render: (value, row) => (
      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
        {value ? (
          <img src={value} alt={row.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
            {row.name.charAt(0)}
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'name',
    label: 'Nombre Completo',
    sortable: true,
    searchable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">{row.controlNumber}</div>
      </div>
    ),
  },
  {
    key: 'grade',
    label: 'Grado',
    width: '100px',
    align: 'center',
    sortable: true,
    render: (value, row) => (
      <div className="font-medium">{value}{row.group}</div>
    ),
  },
  {
    key: 'status',
    label: 'Estado',
    width: '120px',
    sortable: true,
    render: (value) => {
      const statusConfig = {
        active: { label: 'Activo', color: 'emerald' },
        inactive: { label: 'Inactivo', color: 'slate' },
        suspended: { label: 'Suspendido', color: 'red' },
      };
      const config = statusConfig[value as keyof typeof statusConfig];
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-50 text-${config.color}-700 border border-${config.color}-200`}>
          {config.label}
        </span>
      );
    },
  },
  {
    key: 'email',
    label: 'Email',
    searchable: true,
    render: (value) => (
      <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
        {value}
      </a>
    ),
  },
  {
    key: 'phone',
    label: 'Teléfono',
    width: '130px',
  },
  {
    key: 'enrollmentDate',
    label: 'Fecha de Inscripción',
    width: '150px',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString('es-MX'),
  },
];

export const studentsTableActions: TableAction<Student>[] = [
  {
    label: 'Ver',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    onClick: (student) => {
      window.location.href = `/students/${student.id}`;
    },
    variant: 'secondary',
  },
  {
    label: 'Editar',
    onClick: (student) => {
      window.location.href = `/students/${student.id}/edit`;
    },
    variant: 'primary',
  },
  {
    label: 'Eliminar',
    onClick: (student) => {
      if (confirm(`¿Estás seguro de eliminar a ${student.name}?`)) {
        // Llamar a API de eliminación
        console.log('Eliminar estudiante:', student.id);
      }
    },
    variant: 'danger',
    show: (student) => student.status === 'inactive',
  },
];

// ============================================================================
// lib/tables/attendance.table.ts
// Configuración de tabla de asistencia
// ============================================================================

export interface AttendanceRecord {
  id: number;
  studentName: string;
  studentId: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  checkIn: string;
  checkOut?: string;
  notes?: string;
}

export const attendanceTableColumns: TableColumn<AttendanceRecord>[] = [
  {
    key: 'date',
    label: 'Fecha',
    width: '120px',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  },
  {
    key: 'studentName',
    label: 'Estudiante',
    sortable: true,
    searchable: true,
  },
  {
    key: 'status',
    label: 'Estado',
    width: '130px',
    sortable: true,
    render: (value) => {
      const statusConfig = {
        present: { label: 'Presente', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        absent: { label: 'Ausente', color: 'bg-red-50 text-red-700 border-red-200' },
        late: { label: 'Retardo', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        justified: { label: 'Justificado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      };
      const config = statusConfig[value as keyof typeof statusConfig];
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    key: 'checkIn',
    label: 'Hora Entrada',
    width: '120px',
  },
  {
    key: 'checkOut',
    label: 'Hora Salida',
    width: '120px',
    render: (value) => value || '-',
  },
  {
    key: 'notes',
    label: 'Notas',
    render: (value) => value || '-',
  },
];

// ============================================================================
// lib/tables/admissions.table.ts
// Configuración de tabla de preinscripciones
// ============================================================================

export interface Admission {
  id: number;
  folio: string;
  studentName: string;
  guardianName: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  grade: string;
}

export const admissionsTableColumns: TableColumn<Admission>[] = [
  {
    key: 'folio',
    label: 'Folio',
    width: '120px',
    searchable: true,
    render: (value) => (
      <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono font-semibold">
        {value}
      </code>
    ),
  },
  {
    key: 'studentName',
    label: 'Aspirante',
    sortable: true,
    searchable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">Tutor: {row.guardianName}</div>
      </div>
    ),
  },
  {
    key: 'grade',
    label: 'Grado Solicitado',
    width: '140px',
    align: 'center',
  },
  {
    key: 'email',
    label: 'Email',
    searchable: true,
  },
  {
    key: 'phone',
    label: 'Teléfono',
    width: '130px',
  },
  {
    key: 'status',
    label: 'Estado',
    width: '130px',
    sortable: true,
    render: (value) => {
      const statusConfig = {
        pending: { label: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        approved: { label: 'Aprobado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        rejected: { label: 'Rechazado', color: 'bg-red-50 text-red-700 border-red-200' },
        completed: { label: 'Completado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      };
      const config = statusConfig[value as keyof typeof statusConfig];
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    key: 'createdAt',
    label: 'Fecha de Registro',
    width: '150px',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString('es-MX'),
  },
];

export const admissionsTableActions: TableAction<Admission>[] = [
  {
    label: 'Ver',
    onClick: (admission) => {
      window.location.href = `/admissions/${admission.id}`;
    },
    variant: 'secondary',
  },
  {
    label: 'Aprobar',
    onClick: (admission) => {
      // Llamar a API
      console.log('Aprobar:', admission.id);
    },
    variant: 'primary',
    show: (admission) => admission.status === 'pending',
  },
  {
    label: 'Rechazar',
    onClick: (admission) => {
      // Llamar a API
      console.log('Rechazar:', admission.id);
    },
    variant: 'danger',
    show: (admission) => admission.status === 'pending',
  },
];

// ============================================================================
// EJEMPLO DE USO EN UNA PÁGINA
// app/students/page.tsx
// ============================================================================

/*
import { DataTable } from '@/components/DataTable';
import { studentsTableColumns, studentsTableActions, Student } from '@/lib/tables/students.table';

export default async function StudentsPage() {
  // Fetch data desde tu API
  const students: Student[] = await fetch('http://localhost:8000/api/students')
    .then(res => res.json());

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Lista de Estudiantes</h1>
      
      <DataTable
        columns={studentsTableColumns}
        data={students}
        actions={studentsTableActions}
        itemsPerPage={10}
        searchable={true}
        sortable={true}
        selectable={true}
        onSelectionChange={(selected) => console.log('Selected:', selected)}
      />
    </div>
  );
}
*/

// ============================================================================
// ÍNDICE DE EXPORTACIÓN
// lib/tables/index.ts
// ============================================================================

/*
export * from './students.table';
export * from './attendance.table';
export * from './admissions.table';
*/