import { MenuItem } from './sidebar.types';
import { USER_PERMISSIONS } from '@/features/users/permissions';
import { STUDENT_PERMISSIONS } from '@/features/students/permissions';
import { GENERAL_ATTENDANCE_PERMISSIONS } from '@/features/general-attendance/permissions';

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
    href: '/general-attendance',
    icon: 'listCheck',
    badge: 'NFC',
    permission: GENERAL_ATTENDANCE_PERMISSIONS.view,
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

  // ── Students ─────────────────────────────────────────
  {
    name: 'Directorio',
    href: '/students',
    icon: 'students',
    permission: STUDENT_PERMISSIONS.view,
    section: 'estudiantes',
    order: 30,
    activeMatch: 'prefix',
  },
  {
    name: 'Credenciales',
    href: '/students/credential-printing',
    icon: 'print',
    permission: STUDENT_PERMISSIONS.view,
    section: 'estudiantes',
    order: 30,
    activeMatch: 'prefix',
  },


  // ── Comunidad (futuro: Padres, Maestros, Trabajadores) ──
  {

    name: 'Lista',
    href: '/users',
    icon: 'list',
    section: 'usuarios',
    order: 40,
    permission: USER_PERMISSIONS.view,
    activeMatch: 'exact',
  },
  {
    name: 'Agregar',
    href: '/users/create',
    icon: 'add',
    section: 'usuarios',
    order: 40,
    permission: USER_PERMISSIONS.create,
    activeMatch: 'exact',
  },

  // ── Estructura escolar ──────────────────────────────────
  // Futuro: Grados, Grupos (rutas dedicadas)
  {
    name: 'Ciclos escolares',
    href: '/academic-years',
    icon: 'settings',
    permission: 'view academic years',
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
