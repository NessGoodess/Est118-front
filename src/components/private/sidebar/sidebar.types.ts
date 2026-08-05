export type MenuSection =
  | 'inicio'
  | 'asistencia'
  | 'estudiantes'
  | 'usuarios'
  | 'estructura'
  | 'admision'
  | 'comunicacion'
  | 'sistema';

export type ActiveMatch = 'exact' | 'prefix';

export interface MenuItem {
  name: string;
  href?: string;
  icon: string;
  badge?: string;
  /** Permission required to see this item. If omitted, visible to all authenticated users. */
  permission?: string;
  /** Logical group for section headers in the sidebar. */
  section?: MenuSection;
  /** Sort order within / across sections (lower first). */
  order?: number;
  /** How to match active route. Default: exact for leaves, prefix when useful. */
  activeMatch?: ActiveMatch;
  children?: MenuItem[];
}

export const MENU_SECTION_LABELS: Record<MenuSection, string> = {
  inicio: 'Inicio',
  asistencia: 'Asistencia',
  estudiantes: 'Estudiantes',
  usuarios: 'Usuarios',
  estructura: 'Estructura escolar',
  admision: 'Admisión',
  comunicacion: 'Comunicación',
  sistema: 'Sistema',
};

/** Stable display order of sections in the sidebar. */
export const MENU_SECTION_ORDER: MenuSection[] = [
  'inicio',
  'asistencia',
  'estudiantes',
  'usuarios',
  'estructura',
  'admision',
  'comunicacion',
  'sistema',
];
