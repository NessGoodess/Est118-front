import { MenuItem } from './sidebar.types';

/**
 * Private sidebar navigation — grouped by domain for growth
 * (calificaciones, incidencias, maestros, personal, grados, grupos, padres).
 * Only routes that exist today are listed; add future items under the matching section.
 */
export const menuItems: MenuItem[] = [
  // ── Inicio ──────────────────────────────────────────────
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    section: 'inicio',
    order: 10,
  },

  // ── Asistencia ──────────────────────────────────────────
  {
    name: 'Asistencia General',
    href: '/asistencia-general',
    icon: 'listCheck',
    badge: 'NFC',
    permission: 'view general attendance',
    section: 'asistencia',
    order: 20,
    activeMatch: 'prefix',
  },
  {
    name: 'Asistencia por clase',
    href: '/attendance',
    icon: 'check',
    permission: 'view attendance',
    section: 'asistencia',
    order: 21,
    activeMatch: 'prefix',
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: 'reports',
    permission: 'view reports',
    section: 'asistencia',
    order: 22,
  },

  // ── Estudiantes ─────────────────────────────────────────
  // Futuro: Incidencias, Calificaciones
  {
    name: 'Estudiantes',
    icon: 'students',
    permission: 'view students',
    section: 'estudiantes',
    order: 30,
    children: [
      {
        name: 'Directorio',
        href: '/students/all-students',
        icon: 'list',
        permission: 'view students',
        activeMatch: 'prefix',
      },
      {
        name: 'Lista por grado',
        href: '/students/list-students',
        icon: 'list',
        permission: 'view students',
        activeMatch: 'prefix',
      },
      {
        name: 'Agregar estudiante',
        href: '/students/add-students',
        icon: 'add',
        permission: 'create students',
        activeMatch: 'prefix',
      },
      {
        name: 'Credenciales',
        href: '/students/credential-printing',
        icon: 'print',
        permission: 'view students',
        activeMatch: 'prefix',
      },
    ],
  },

  // ── Comunidad (futuro: Padres, Maestros, Trabajadores) ──
  {
    name: 'Usuarios del sistema',
    icon: 'users',
    permission: 'view users',
    section: 'comunidad',
    order: 40,
    children: [
      {
        name: 'Lista de usuarios',
        href: '/users',
        icon: 'list',
        permission: 'view users',
        activeMatch: 'exact',
      },
      {
        name: 'Agregar usuario',
        href: '/users/create',
        icon: 'add',
        permission: 'create users',
      },
    ],
  },

  // ── Estructura escolar ──────────────────────────────────
  // Futuro: Grados, Grupos (rutas dedicadas)
  {
    name: 'Ciclos escolares',
    href: '/academic-years',
    icon: 'settings',
    permission: 'manage re-enrollment',
    section: 'estructura',
    order: 50,
    activeMatch: 'prefix',
  },

  // ── Admisión ────────────────────────────────────────────
  {
    name: 'Preinscripciones',
    icon: 'students',
    permission: 'view pre-enrollments',
    section: 'admision',
    order: 60,
    children: [
      {
        name: 'Lista de preinscritos',
        href: '/admissions/applications',
        icon: 'list',
        permission: 'view pre-enrollments',
        activeMatch: 'prefix',
      },
      {
        name: 'Crear preinscripción',
        href: '/admissions/applications/new',
        icon: 'add',
        permission: 'create pre-enrollments',
      },
      {
        name: 'Proceso de admisión',
        href: '/admissions/process',
        icon: 'list',
        permission: 'manage admission cycles',
        activeMatch: 'prefix',
      },
    ],
  },
  {
    name: 'Reinscripciones',
    icon: 'groups',
    permission: 'manage re-enrollment',
    section: 'admision',
    order: 61,
    children: [
      {
        name: 'Tablero',
        href: '/re-enrollment',
        icon: 'dashboard',
        permission: 'manage re-enrollment',
        activeMatch: 'exact',
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
        icon: 'groups',
        permission: 'manage re-enrollment',
      },
      {
        name: 'Finalizadas',
        href: '/re-enrollment/completed',
        icon: 'check',
        permission: 'manage re-enrollment',
      },
    ],
  },

  // ── Comunicación ────────────────────────────────────────
  {
    name: 'Avisos',
    icon: 'reports',
    permission: 'create announcements',
    section: 'comunicacion',
    order: 70,
    children: [
      {
        name: 'Lista de avisos',
        href: '/Announcement/list',
        icon: 'list',
        permission: 'create announcements',
      },
      {
        name: 'Crear aviso',
        href: '/Announcement',
        icon: 'add',
        permission: 'create announcements',
        activeMatch: 'exact',
      },
    ],
  },

  // ── Sistema ─────────────────────────────────────────────
  // Futuro: Configuración (/configuracion), roles/permisos.
  // Usuarios del sistema viven en sección Comunidad por ahora.
];
