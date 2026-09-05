/**
 * Spanish labels for Spatie permission names / categories / roles.
 */

const VERBS: Record<string, string> = {
  view: "Ver",
  create: "Crear",
  edit: "Editar",
  delete: "Eliminar",
  manage: "Administrar",
  print: "Imprimir",
};

const RESOURCES: Record<string, string> = {
  users: "usuarios",
  students: "estudiantes",
  "student photos": "fotos de estudiantes",
  "pre-enrollments": "preinscripciones",
  "admission enrollment": "proceso de inscripción",
  "admission cycles": "ciclos de admisión",
  "academic years": "ciclos escolares",
  "re-enrollment": "reinscripción",
  announcements: "avisos",
  galleries: "galerías",
  events: "eventos",
  attendance: "asistencia",
  "general attendance": "asistencia general",
  "nfc readings": "lecturas NFC",
  credentials: "credenciales",
  roles: "roles",
  permissions: "permisos",
  settings: "configuración",
  groups: "grupos",
  grades: "grados",
};

const CATEGORY_LABELS: Record<string, string> = {
  users: "Usuarios",
  students: "Estudiantes",
  "student photos": "Fotos de estudiantes",
  "pre-enrollments": "Preinscripciones",
  "admission enrollment": "Proceso de inscripción",
  "admission cycles": "Ciclos de admisión",
  "academic years": "Ciclos escolares",
  admission: "Admisiones",
  cycles: "Ciclos",
  "re-enrollment": "Reinscripción",
  announcements: "Avisos",
  galleries: "Galerías",
  events: "Eventos",
  attendance: "Asistencia",
  "general attendance": "Asistencia general",
  "nfc readings": "Lecturas NFC",
  credentials: "Credenciales",
  photos: "Fotos",
  roles: "Roles",
  permissions: "Permisos",
  settings: "Configuración",
  groups: "Grupos",
  grades: "Grados",
  general: "General",
  student: "Estudiantes",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  user: "Usuario",
  "pre-enrollment-admin": "Admin. preinscripciones",
  teacher: "Docente",
  prefectura: "Prefectura",
};

const PERMISSION_OVERRIDES: Record<string, string> = {
  "view users": "Ver usuarios",
  "create users": "Crear usuarios",
  "edit users": "Editar usuarios",
  "delete users": "Eliminar usuarios",
  "view students": "Ver estudiantes",
  "create students": "Crear estudiantes",
  "edit students": "Editar estudiantes",
  "delete students": "Eliminar estudiantes",
  "view student photos": "Ver fotos de estudiantes",
  "manage student photos": "Administrar fotos de estudiantes",
  "view pre-enrollments": "Ver preinscripciones",
  "create pre-enrollments": "Crear preinscripciones",
  "edit pre-enrollments": "Editar preinscripciones",
  "delete pre-enrollments": "Eliminar preinscripciones",
  "view admission enrollment": "Ver proceso de inscripción",
  "edit admission enrollment": "Editar proceso de inscripción",
  "manage admission cycles": "Administrar ciclos de admisión",
  "manage re-enrollment": "Administrar reinscripción",
  "view academic years": "Ver ciclos escolares",
  "create academic years": "Crear ciclos escolares",
  "delete academic years": "Eliminar ciclos escolares",
  "view general attendance": "Ver asistencia general",
  "manage nfc readings": "Administrar lecturas NFC",
  "edit general attendance": "Editar asistencia general",
  "create announcements": "Crear avisos",
  "create galleries": "Crear galerías",
  "create events": "Crear eventos",
  "view attendance": "Ver asistencia por clase",
};

/** Split Spatie name `"view student photos"` → verb + resource. */
export function parsePermissionName(name: string): {
  verb: string;
  resource: string;
} {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) {
    return { verb: parts[0] ?? name, resource: "general" };
  }
  const [verb, ...rest] = parts;
  return { verb, resource: rest.join(" ") };
}

export function labelPermissionVerb(verb: string): string {
  return VERBS[verb] ?? verb.charAt(0).toUpperCase() + verb.slice(1);
}

/** Full resource key (`student photos`) → row label. */
export function labelPermissionResource(resource: string): string {
  if (CATEGORY_LABELS[resource]) return CATEGORY_LABELS[resource];
  if (RESOURCES[resource]) {
    const raw = RESOURCES[resource];
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return resource.charAt(0).toUpperCase() + resource.slice(1);
}

/** Preferred column order for the permissions matrix. */
export const PERMISSION_VERB_ORDER = [
  "view",
  "create",
  "edit",
  "delete",
  "manage",
  "print",
] as const;

/** "view users" → "Ver usuarios" */
export function labelPermission(name: string): string {
  if (PERMISSION_OVERRIDES[name]) return PERMISSION_OVERRIDES[name];

  const { verb, resource } = parsePermissionName(name);
  if (!resource || resource === "general") return name;

  const verbLabel = VERBS[verb] ?? verb;
  const resourceLabel = RESOURCES[resource] ?? resource;

  return `${verbLabel} ${resourceLabel}`;
}

/** Category key from API groupBy (e.g. "users") → "Usuarios" */
export function labelPermissionCategory(category: string): string {
  return (
    CATEGORY_LABELS[category] ??
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

export function labelRole(name: string): string {
  return ROLE_LABELS[name] ?? name;
}
