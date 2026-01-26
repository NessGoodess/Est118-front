import { MenuItem } from './sidebar.types';

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
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
    name: 'Asistencia General',
    href: '/asistencia-general',
    icon: 'listCheck',
    badge: 'NFC',
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
        name: 'Lista de Estudiantes',
        href: '/students/list-students',
        icon: 'list',
      },
    ],
  },
  {
    name: 'Grupos',
    href: '/grupos',
    icon: 'groups',
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: 'reports',
  },
  {
    name: 'eXTRA',
    href: '/extra',
    icon: 'reports',
  },
  {
    name: 'Preuba',
    href: '/pruebas',
    icon: 'reports',
  },
  {
    name: 'Gestion De Credenciales',
    icon: 'credentials',
    children: [
      {
        name: 'Asignar NFC',
        href: '/gestion-de-credenciales/asignar-nfc',
        icon: 'nfc',
      },
      {
        name: 'Imprimir Credenciales',
        href: '/gestion-de-credenciales/impresion-de-credenciales',
        icon: 'print',
      },
      {
        name: 'Chat de Pruebas',
        href: '/gestion-de-credenciales/chat-de-pruebas',
        icon: 'chat',
      },
    ],
  },
  {
    name: 'Configuración',
    href: '/configuracion',
    icon: 'settings',
  },
];

