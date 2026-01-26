export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  date: string;
  author?: string;
  tags?: string[];
}

export interface NewsItem {
  id: string;
  titulo: string;
  fecha: string;
  resumen: string;
  contenido: string;
  imagen: string;
  categoria: string;
  autor?: string;
}

export interface EventItem {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion: string;
  contenido: string;
  imagen?: string;
  tipo: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Ceremonia de Graduación 2024",
    description: "Celebración de la generación 2021-2024 con la participación de toda la comunidad estudiantil y sus familias.",
    category: "Eventos",
    image: "/background4.png",
    date: "15 de Julio, 2024",
    author: "Comunicación EST118",
    tags: ["graduación", "ceremonia", "2024"]
  },
];

export const newsItems: NewsItem[] = [
  /*{
    id: "1",
    titulo: "Convocatoria Abierta para Inscripciones",
    fecha: "20 de Enero, 2026",
    resumen: "Ya está abierto el periodo de preinscripción para el ciclo 2026-2027. No te quedes fuera.",
    contenido: "Se informa a todos los interesados que el periodo de preinscripción para el ciclo escolar 2026-2027 está abierto. Los requisitos y el proceso completo están disponibles en nuestra página web. Es importante completar el formulario en línea y posteriormente asistir al área de contraloría con la documentación requerida.",
    imagen: "/",
    categoria: "Inscripciones",
    autor: "Contraloría"
  },*/
  {
    id: "2",
    titulo: "Temporada de frio",
    fecha: "14 de Enero, 2026",
    resumen: "Uniforme completo para la temporada de frio.",
    contenido: "En esta temporada de frio es importante llevar el uniforme completo. se permite llevar un abrigo o chaleco.",
    imagen: "/aviso1.jpg",
    categoria: "Avisos",
    autor: "Comunicación"
  },
  {
    id: "3",
    titulo: "Regreso a clases",
    fecha: "12 de Enero, 2026",
    resumen: "Se informa que el regreso a clases se realizará el día 12 de Enero, 2026.",
    contenido: "Atencion a padres de familia, el regreso a clases se realizará el día 12 de Enero, 2026. ",
    imagen: "/aviso2.jpg",
    categoria: "Clases",
    autor: "Comunicación"
  },
];

export const eventItems: EventItem[] = [
  {
    id: "1",
    titulo: "Ceremonia de Inicio de Ciclo",
    fecha: "28 de Enero, 2025",
    hora: "8:00 AM",
    lugar: "Cancha Principal",
    descripcion: "Bienvenida oficial al ciclo escolar 2025-2026 con la presencia de autoridades y comunidad estudiantil.",
    contenido: "La ceremonia de inicio de ciclo escolar es un evento importante donde toda la comunidad se reúne para dar inicio formal al nuevo año académico. Contaremos con la presencia de autoridades educativas, padres de familia y toda la comunidad estudiantil. Se realizarán presentaciones artísticas y se reconocerá a los estudiantes destacados del ciclo anterior.",
    tipo: "Ceremonia",
    imagen: "/background1.png"
  },
];

// ============================================
// CONTENIDO EXCLUSIVO PARA ESTUDIANTES
// ============================================

export interface Circular {
  id: string;
  numero: string;
  titulo: string;
  fecha: string;
  categoria: 'General' | 'Académico' | 'Administrativo' | 'Urgente';
  resumen: string;
  contenido: string;
  destinatarios: string[];
  archivo?: string;
  importante: boolean;
}

export interface Boleta {
  id: string;
  estudianteId: string;
  nombreEstudiante: string;
  grado: string;
  grupo: string;
  periodo: string;
  cicloEscolar: string;
  fechaEmision: string;
  calificaciones: {
    materia: string;
    calificacion: number;
    faltas: number;
    observaciones?: string;
  }[];
  promedio: number;
  archivo?: string;
}

export interface CalendarioItem {
  id: string;
  titulo: string;
  fecha: string;
  fechaFin?: string;
  tipo: 'Vacaciones' | 'Examen' | 'Evento' | 'Suspension' | 'Entrega' | 'Junta';
  descripcion: string;
  color: string;
  importante: boolean;
}

export interface Formato {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'Académico' | 'Administrativo' | 'Justificante' | 'Solicitud';
  archivo: string;
  tamano: string;
  fechaActualizacion: string;
  descargas: number;
  icono: string;
}

export interface Constancia {
  id: string;
  tipo: 'Estudios' | 'Conducta' | 'Calificaciones' | 'Inscripción';
  descripcion: string;
  requisitos: string[];
  tiempoEntrega: string;
  costo: string;
  documentosNecesarios: string[];
}

export interface Aviso {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  grado?: string;
  grupo?: string;
  tipo: 'Informativo' | 'Urgente' | 'Recordatorio' | 'Tarea';
  autor: string;
  importante: boolean;
  leido?: boolean;
}

// Mock Data - Circulares Oficiales
export const circulares: Circular[] = [
  {
    id: "1",
    numero: "001/2025",
    titulo: "Inicio del Ciclo Escolar 2025-2026",
    fecha: "08 de Enero, 2025",
    categoria: "General",
    resumen: "Información importante sobre el inicio del ciclo escolar, horarios y protocolos de entrada.",
    contenido: "Se informa a toda la comunidad estudiantil que el ciclo escolar 2025-2026 dará inicio el día 28 de enero del presente año. Los horarios de entrada serán: 1er grado 7:45 AM, 2do grado 7:50 AM, 3er grado 7:55 AM. Se solicita puntualidad y portar el uniforme completo desde el primer día.",
    destinatarios: ["Estudiantes", "Padres de Familia"],
    importante: true
  },

];

// Mock Data - Boletas/Calificaciones
export const boletas: Boleta[] = [
  {
    id: "1",
    estudianteId: "EST001",
    nombreEstudiante: "Juan Pérez García",
    grado: "2",
    grupo: "A",
    periodo: "Primer Bimestre",
    cicloEscolar: "2024-2025",
    fechaEmision: "20 de Diciembre, 2024",
    calificaciones: [
      { materia: "Español", calificacion: 9.2, faltas: 0 },
      { materia: "Matemáticas", calificacion: 8.8, faltas: 1 },
      { materia: "Ciencias (Física)", calificacion: 9.0, faltas: 0 },
      { materia: "Historia", calificacion: 8.5, faltas: 2 },
      { materia: "Geografía", calificacion: 9.3, faltas: 0 },
      { materia: "Formación Cívica y Ética", calificacion: 9.5, faltas: 0 },
      { materia: "Inglés", calificacion: 8.7, faltas: 1 },
      { materia: "Educación Física", calificacion: 10.0, faltas: 0 },
      { materia: "Artes", calificacion: 9.0, faltas: 0 },
      { materia: "Tecnología - Informática", calificacion: 9.8, faltas: 0 }
    ],
    promedio: 9.18
  },

];

// Mock Data - Calendario Escolar
export const calendarioEscolar: CalendarioItem[] = [
  {
    id: "1",
    titulo: "Inicio de Ciclo Escolar",
    fecha: "2025-01-28",
    tipo: "Evento",
    descripcion: "Inicio oficial del ciclo escolar 2025-2026",
    color: "#10b981",
    importante: true
  },

];

// Mock Data - Formatos Descargables
export const formatos: Formato[] = [
  {
    id: "1",
    nombre: "Justificante de Inasistencia",
    descripcion: "Formato para justificar faltas por enfermedad o motivos personales",
    categoria: "Justificante",
    archivo: "/formatos/justificante-inasistencia.pdf",
    tamano: "125 KB",
    fechaActualizacion: "05 de Enero, 2025",
    descargas: 1247,
    icono: "📄"
  },
];

// Mock Data - Constancias
export const constancias: Constancia[] = [
  {
    id: "1",
    tipo: "Estudios",
    descripcion: "Constancia que acredita que el alumno está inscrito y cursando estudios en la institución",
    requisitos: [
      "Solicitud firmada por padre o tutor",
      "Copia de credencial del estudiante",
      "Comprobante de pago (si aplica)"
    ],
    tiempoEntrega: "3 días hábiles",
    costo: "Gratuito",
    documentosNecesarios: ["Identificación oficial del padre/tutor", "CURP del estudiante"]
  },

];

// Mock Data - Avisos por Grupo/Grado
export const avisos: Aviso[] = [
  {
    id: "1",
    titulo: "Tarea de Matemáticas - Ecuaciones Lineales",
    contenido: "Resolver los ejercicios de la página 45 a 48 del libro de texto. Entregar el lunes 20 de enero en la primera hora de clase.",
    fecha: "15 de Enero, 2025",
    grado: "2",
    grupo: "A",
    tipo: "Tarea",
    autor: "Prof. Roberto Sánchez",
    importante: true,
    leido: false
  },

];

