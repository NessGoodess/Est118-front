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
  },
  {
    name: 'Preinscripciones',
    href: '/admissions',
    icon: 'students',
  },
  {
    name: 'Asistencia',
    href: '/attendance',
    icon: 'check',
  },
  {
    name: 'Gestion De Estudiantes',
    icon: 'students',
    children: [
      {
        name: 'Agregar Estudiante',
        href: '/students/add-students',
        icon: 'add',
      },
      {
        name: 'chat de pruebas',
        href: '/gestion-de-credenciales/chat-de-pruebas',
        icon: 'list',
      },
      {
        name: 'Lista de Estudiantes',
        href: '/students/list-students',
        icon: 'list',
      },
    ],
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: 'reports',
  },
  {
    name: 'Configuración',
    href: '/configuracion',
    icon: 'settings',
  },
];

