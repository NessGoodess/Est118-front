import { MenuItem } from './sidebar.types';

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
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
    href: '/admissions',
    icon: 'students',
    permission: 'view pre-enrollments',
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

