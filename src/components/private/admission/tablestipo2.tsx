// ============================================================================
// lib/tables/table.types.ts
// Tipos centralizados para todas las tablas
// ============================================================================

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T = any> {
  label: string;
  icon?: string; // Nombre del icono
  onClick: (row: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  show?: (row: T) => boolean;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  itemsPerPage?: number;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
}

// ============================================================================
// lib/tables/students.config.ts
// ⭐ CONFIGURACIÓN ESTILO SIDEBAR - SIMPLE Y LIMPIO
// ============================================================================

import { TableConfig } from './table.types';

export interface Student {
  id: number;
  name: string;
  controlNumber: string;
  grade: string;
  group: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
}

// 🎯 Configuración simple y declarativa
export const studentsTableConfig: TableConfig<Student> = {
  columns: [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      searchable: true,
    },
    {
      key: 'grade',
      label: 'Grado',
      width: '100px',
      align: 'center',
    },
    {
      key: 'group',
      label: 'Grupo',
      width: '100px',
      align: 'center',
    },
    {
      key: 'status',
      label: 'Estado',
      width: '120px',
      render: 'status-badge', // 👈 Nombre del renderer
    },
    {
      key: 'email',
      label: 'Email',
      searchable: true,
      render: 'email-link',
    },
    {
      key: 'phone',
      label: 'Teléfono',
      width: '130px',
    },
  ],
  actions: [
    {
      label: 'Ver',
      icon: 'eye',
      onClick: (student) => {
        window.location.href = `/students/${student.id}`;
      },
      variant: 'secondary',
    },
    {
      label: 'Editar',
      icon: 'edit',
      onClick: (student) => {
        window.location.href = `/students/${student.id}/edit`;
      },
      variant: 'primary',
    },
    {
      label: 'Eliminar',
      icon: 'trash',
      onClick: (student) => {
        if (confirm(`¿Eliminar a ${student.name}?`)) {
          console.log('Eliminar:', student.id);
        }
      },
      variant: 'danger',
      show: (student) => student.status === 'inactive',
    },
  ],
  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  selectable: true,
};

// ============================================================================
// lib/tables/attendance.config.ts
// ============================================================================

import { TableConfig } from './table.types';

export interface AttendanceRecord {
  id: number;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  checkIn: string;
  checkOut?: string;
}

export const attendanceTableConfig: TableConfig<AttendanceRecord> = {
  columns: [
    {
      key: 'date',
      label: 'Fecha',
      width: '120px',
      sortable: true,
      render: 'date',
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
      render: 'attendance-badge',
    },
    {
      key: 'checkIn',
      label: 'Entrada',
      width: '100px',
    },
    {
      key: 'checkOut',
      label: 'Salida',
      width: '100px',
      render: 'optional',
    },
  ],
  actions: [
    {
      label: 'Ver Detalle',
      icon: 'eye',
      onClick: (record) => console.log('Ver:', record),
      variant: 'secondary',
    },
  ],
  itemsPerPage: 15,
  searchable: true,
  sortable: true,
  selectable: false,
};

// ============================================================================
// lib/tables/admissions.config.ts
// ============================================================================

import { TableConfig } from './table.types';

export interface Admission {
  id: number;
  folio: string;
  studentName: string;
  guardianName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const admissionsTableConfig: TableConfig<Admission> = {
  columns: [
    {
      key: 'folio',
      label: 'Folio',
      width: '120px',
      searchable: true,
      render: 'folio-badge',
    },
    {
      key: 'studentName',
      label: 'Aspirante',
      sortable: true,
      searchable: true,
    },
    {
      key: 'guardianName',
      label: 'Tutor',
      searchable: true,
    },
    {
      key: 'email',
      label: 'Email',
      render: 'email-link',
    },
    {
      key: 'status',
      label: 'Estado',
      width: '130px',
      sortable: true,
      render: 'admission-status',
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      width: '120px',
      sortable: true,
      render: 'date',
    },
  ],
  actions: [
    {
      label: 'Ver',
      icon: 'eye',
      onClick: (admission) => console.log('Ver:', admission),
      variant: 'secondary',
    },
    {
      label: 'Aprobar',
      icon: 'check',
      onClick: (admission) => console.log('Aprobar:', admission),
      variant: 'primary',
      show: (admission) => admission.status === 'pending',
    },
    {
      label: 'Rechazar',
      icon: 'x',
      onClick: (admission) => console.log('Rechazar:', admission),
      variant: 'danger',
      show: (admission) => admission.status === 'pending',
    },
  ],
  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  selectable: true,
};

// ============================================================================
// lib/tables/index.ts
// ⭐ EXPORTACIÓN CENTRALIZADA - Todo en un solo lugar
// ============================================================================

export * from './table.types';
export * from './students.config';
export * from './attendance.config';
export * from './admissions.config';

// Lista de todas las configuraciones disponibles
export const tableConfigs = {
  students: () => import('./students.config').then(m => m.studentsTableConfig),
  attendance: () => import('./attendance.config').then(m => m.attendanceTableConfig),
  admissions: () => import('./admissions.config').then(m => m.admissionsTableConfig),
};

// ============================================================================
// lib/renderers/table-renderers.tsx
// 🎨 Renderers reutilizables (como los iconos del sidebar)
// ============================================================================

export const tableRenderers = {
  'status-badge': (value: string) => {
    const colors = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[value as keyof typeof colors]}`}>
        {value === 'active' ? 'Activo' : 'Inactivo'}
      </span>
    );
  },

  'attendance-badge': (value: string) => {
    const config = {
      present: { label: 'Presente', color: 'emerald' },
      absent: { label: 'Ausente', color: 'red' },
      late: { label: 'Retardo', color: 'amber' },
      justified: { label: 'Justificado', color: 'blue' },
    };
    const c = config[value as keyof typeof config];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${c.color}-50 text-${c.color}-700 border border-${c.color}-200`}>
        {c.label}
      </span>
    );
  },

  'admission-status': (value: string) => {
    const config = {
      pending: { label: 'Pendiente', color: 'amber' },
      approved: { label: 'Aprobado', color: 'emerald' },
      rejected: { label: 'Rechazado', color: 'red' },
    };
    const c = config[value as keyof typeof config];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${c.color}-50 text-${c.color}-700 border border-${c.color}-200`}>
        {c.label}
      </span>
    );
  },

  'email-link': (value: string) => (
    <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
      {value}
    </a>
  ),

  'folio-badge': (value: string) => (
    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono font-semibold">
      {value}
    </code>
  ),

  'date': (value: string) => new Date(value).toLocaleDateString('es-MX'),

  'optional': (value: any) => value || '-',
};

// ============================================================================
// lib/icons/table-icons.tsx
// 🎯 Iconos reutilizables (como los del sidebar)
// ============================================================================

export const tableIcons = {
  eye: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// ============================================================================
// EJEMPLO DE USO EN UNA PÁGINA
// app/students/page.tsx
// ============================================================================

/*
'use client';

import { DataTable } from '@/components/DataTable';
import { studentsTableConfig } from '@/lib/tables';
import { tableRenderers } from '@/lib/renderers/table-renderers';
import { tableIcons } from '@/lib/icons/table-icons';
import { useState, useEffect } from 'react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Lista de Estudiantes</h1>
      
      <DataTable
        config={studentsTableConfig}
        data={students}
        renderers={tableRenderers}
        icons={tableIcons}
      />
    </div>
  );
}
*/

// ============================================================================
// VENTAJAS DE ESTE PATRÓN
// ============================================================================

/*
✅ PROS:

1. **Configuración Simple y Declarativa**
   - Similar al sidebar que ya tienes
   - Fácil de leer y mantener
   - Todo en un solo archivo de configuración

2. **Separación de Responsabilidades**
   - Configuración: Define QUÉ mostrar
   - Renderers: Define CÓMO mostrar
   - Iconos: Reutilizables y centralizados

3. **DRY (Don't Repeat Yourself)**
   - Renderers reutilizables entre tablas
   - Iconos compartidos
   - Una sola fuente de verdad

4. **Fácil de Extender**
   - Agregar nueva tabla = nuevo archivo config
   - Agregar nuevo renderer = nueva función
   - Agregar nuevo icono = nuevo SVG

5. **TypeScript Friendly**
   - Autocompletado completo
   - Validación de tipos
   - Errores en tiempo de desarrollo

6. **Mantenible**
   - Cambiar un icono = un solo lugar
   - Cambiar un renderer = afecta todas las tablas
   - Fácil de encontrar configuraciones

7. **Testeable**
   - Configs son objetos simples
   - Renderers son funciones puras
   - Fácil de mockear

❌ CONTRAS:

1. Requiere setup inicial (pero solo una vez)
2. Curva de aprendizaje pequeña para nuevos devs
3. Más archivos (pero mejor organizado)

💡 RECOMENDACIÓN:

SÍ, usa este patrón. Es exactamente como tu sidebar y tendrás:
- Consistencia en todo el proyecto
- Fácil de escalar
- Mantenimiento simple
- Onboarding rápido para nuevos devs
*/