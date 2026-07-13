import { MenuItem } from './sidebar.types';

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'Todos Los Estudiantes',
    icon: 'students',
    children: [
      {
        name: 'Lista de Estudiantes',
        href: '/students/all-students',
        icon: 'list',
      },
    ],
  },
  {
    name: 'Asistencia General',
    href: '/asistencia-general',
    icon: 'listCheck',
    badge: 'NFC',
    permission: 'view general attendance',
  },
  {
    name: 'Preinscripciones',
    icon: 'students',
    permission: 'view pre-enrollments',
    children: [
      {
        name: 'Lista de Preinscritos',
        href: '/admissions/applications',
        icon: 'list',
        permission: 'view pre-enrollments',
      },
      {
        name: 'Crear Preinscripción',
        href: '/admissions/applications/new',
        icon: 'list',
        permission: 'create pre-enrollments',
      },
      {
        name: 'Proceso de Admisión',
        href: '/admissions/process',
        icon: 'list',
        permission: 'manage admission cycles',
      },
    ],
  },

  {
    name: 'Ciclos escolares',
    href: '/academic-years',
    icon: 'settings',
    permission: 'manage re-enrollment',
  },
  {
    name: 'Reinscripciones',
    icon: 'students',
    permission: 'manage re-enrollment',
    children: [
      {
        name: 'Tablero',
        href: '/re-enrollment',
        icon: 'list',
        permission: 'manage re-enrollment',
      },
      {
        name: 'Configuración',
        href: '/re-enrollment/settings',
        icon: 'settings',
        permission: 'manage re-enrollment',
      },
      {
        name: 'Validación',
        href: '/re-enrollment/validation',
        icon: 'list',
        permission: 'manage re-enrollment',
      },
      {
        name: 'Promoción',
        href: '/re-enrollment/promotion',
        icon: 'list',
        permission: 'manage re-enrollment',
      },
      {
        name: 'Asignación de grupos',
        href: '/re-enrollment/groups',
        icon: 'list',
        permission: 'manage re-enrollment',
      },
      {
        name: 'Finalizadas',
        href: '/re-enrollment/completed',
        icon: 'list',
        permission: 'manage re-enrollment',
      },
    ],
  },
  {
    name: 'Avisos',
    icon: 'reports',
    permission: 'create announcements',
    children: [
      {
        name: 'Lista de Avisos',
        href: '/Announcement/list',
        icon: 'list',
        permission: 'create announcements',
      },
      {
        name: 'Crear aviso',
        href: '/Announcement',
        icon: 'add',
        permission: 'create announcements',
      },
    ],
  },
  {
    name: 'Asistencia',
    href: '/attendance',
    icon: 'check',
    permission: 'view attendance',
  },
  {
    name: 'Gestion De Estudiantes',
    icon: 'students',
    permission: 'view students',
    children: [
      {
        name: 'Impresión de credenciales',
        href: '/students/credential-printing',
        icon: 'list',
        permission: 'view students',
      },
      {
        name: 'Agregar Estudiante',
        href: '/students/add-students',
        icon: 'add',
        permission: 'create students',
      },
      {
        name: 'chat de pruebas',
        href: '/gestion-de-credenciales/chat-de-pruebas',
        icon: 'list',
        permission: 'view chat',
      },
      {
        name: 'Lista de Estudiantes',
        href: '/students/list-students',
        icon: 'list',
        permission: 'view students',
      },
    ],
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: 'reports',
    permission: 'view reports',
  },
  {
    name: 'Usuarios',
    icon: 'users',
    permission: 'view users',
    children: [
      {
        name: 'Agregar Usuario',
        href: '/users/create',
        icon: 'add',
        permission: 'create users',
      },
      {
        name: 'Lista de Usuarios',
        href: '/users',
        icon: 'list',
        permission: 'view users',
      },
    ],
  },
  {
    name: 'Configuración',
    href: '/configuracion',
    icon: 'settings',
    permission: 'view pre-enrollments'
  },
];

