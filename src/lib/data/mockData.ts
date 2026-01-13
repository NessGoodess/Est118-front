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
  {
    id: "2",
    title: "Proyectos de Taller de Informática",
    description: "Exposición de proyectos desarrollados por estudiantes del taller de Informática durante el semestre.",
    category: "Académico",
    image: "/background4.png",
    date: "10 de Junio, 2024",
    author: "Taller de Informática",
    tags: ["informática", "proyectos", "tecnología"]
  },
  {
    id: "3",
    title: "Torneo Deportivo Interescolar",
    description: "Nuestros estudiantes participaron en el torneo deportivo regional obteniendo excelentes resultados.",
    category: "Deportes",
    image: "/background4.png",
    date: "5 de Mayo, 2024",
    author: "Departamento de Educación Física",
    tags: ["deportes", "competencia", "torneo"]
  },
  {
    id: "4",
    title: "Festival Cultural",
    description: "Celebración de nuestras tradiciones oaxaqueñas con danzas, música y gastronomía tradicional.",
    category: "Cultural",
    image: "/background4.png",
    date: "20 de Abril, 2024",
    author: "Comité Cultural",
    tags: ["cultura", "tradiciones", "oaxaca"]
  },
  {
    id: "5",
    title: "Taller de Robótica",
    description: "Estudiantes del taller de Máquinas y Herramientas presentan sus proyectos de robótica.",
    category: "Tecnología",
    image: "/background4.png",
    date: "12 de Marzo, 2024",
    author: "Taller de Máquinas",
    tags: ["robótica", "tecnología", "innovación"]
  },
  {
    id: "6",
    title: "Día de la Ciencia",
    description: "Feria científica donde los estudiantes exponen experimentos y proyectos de investigación.",
    category: "Ciencia",
    image: "/background4.png",
    date: "8 de Febrero, 2024",
    author: "Departamento de Ciencias",
    tags: ["ciencia", "experimentos", "investigación"]
  },
  {
    id: "7",
    title: "Concurso de Oratoria",
    description: "Estudiantes demuestran sus habilidades de expresión oral en el concurso interno de oratoria.",
    category: "Académico",
    image: "/background4.png",
    date: "25 de Enero, 2024",
    author: "Departamento de Español",
    tags: ["oratoria", "expresión", "comunicación"]
  },
  {
    id: "8",
    title: "Proyectos de Diseño Industrial",
    description: "Exposición de diseños y prototipos creados por estudiantes del taller de Diseño Industrial.",
    category: "Tecnología",
    image: "/background4.png",
    date: "15 de Diciembre, 2023",
    author: "Taller de Diseño Industrial",
    tags: ["diseño", "industrial", "prototipos"]
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "1",
    titulo: "Inicio del Ciclo Escolar 2025-2026",
    fecha: "15 de Enero, 2025",
    resumen: "Damos la bienvenida a todos nuestros estudiantes y sus familias al nuevo ciclo escolar.",
    contenido: "La Escuela Secundaria Técnica No. 118 da la bienvenida a toda la comunidad estudiantil al inicio del ciclo escolar 2025-2026. Este año promete ser lleno de aprendizajes, crecimiento y nuevas oportunidades para todos nuestros estudiantes. Les recordamos revisar los horarios y estar atentos a los comunicados oficiales.",
    imagen: "/background4.png",
    categoria: "General",
    autor: "Dirección General"
  },
  {
    id: "2",
    titulo: "Convocatoria Abierta para Inscripciones",
    fecha: "10 de Enero, 2025",
    resumen: "Ya está abierto el periodo de preinscripción para el ciclo 2025-2026. No te quedes fuera.",
    contenido: "Se informa a todos los interesados que el periodo de preinscripción para el ciclo escolar 2025-2026 está abierto. Los requisitos y el proceso completo están disponibles en nuestra página web. Es importante completar el formulario en línea y posteriormente asistir al área de contraloría con la documentación requerida.",
    imagen: "/background4.png",
    categoria: "Inscripciones",
    autor: "Contraloría"
  },
  {
    id: "3",
    titulo: "Día de la Ciencia y Tecnología",
    fecha: "5 de Enero, 2025",
    resumen: "Celebramos nuestros talleres técnicos con una exposición de proyectos estudiantiles.",
    contenido: "El próximo mes se llevará a cabo el Día de la Ciencia y Tecnología, donde los estudiantes de todos los talleres técnicos expondrán sus proyectos más destacados. Esta es una excelente oportunidad para que la comunidad conozca el trabajo que realizan nuestros estudiantes y el talento que se desarrolla en nuestra institución.",
    imagen: "/background4.png",
    categoria: "Eventos",
    autor: "Coordinación Académica"
  },
  {
    id: "4",
    titulo: "Reunión de Padres de Familia",
    fecha: "20 de Diciembre, 2024",
    resumen: "Invitamos a todos los padres de familia a la reunión informativa del mes de enero.",
    contenido: "Se convoca a todos los padres de familia a la reunión informativa que se llevará a cabo el próximo mes. En esta reunión se abordarán temas importantes sobre el ciclo escolar, actividades programadas y la participación de los padres en el proceso educativo de sus hijos.",
    imagen: "/background4.png",
    categoria: "General",
    autor: "Dirección"
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
  {
    id: "2",
    titulo: "Feria de Ciencias",
    fecha: "15 de Febrero, 2025",
    hora: "10:00 AM",
    lugar: "Gimnasio",
    descripcion: "Exposición de proyectos científicos y tecnológicos desarrollados por nuestros estudiantes.",
    contenido: "La Feria de Ciencias es uno de los eventos más importantes del año, donde los estudiantes de todos los grados presentan sus proyectos científicos y tecnológicos. Los proyectos son evaluados por un jurado especializado y los mejores representarán a la escuela en competencias regionales y estatales.",
    tipo: "Académico",
    imagen: "/background2.png"
  },
  {
    id: "3",
    titulo: "Torneo Deportivo Interescolar",
    fecha: "20 de Febrero, 2025",
    hora: "8:00 AM",
    lugar: "Canchas Deportivas",
    descripcion: "Competencia deportiva donde nuestros estudiantes demostrarán sus habilidades.",
    contenido: "El torneo deportivo interescolar reúne a estudiantes de diferentes escuelas para competir en diversas disciplinas deportivas. Nuestros estudiantes han estado entrenando arduamente y están listos para representar a la institución con honor y deportividad.",
    tipo: "Deportivo",
    imagen: "/background3.png"
  },
  {
    id: "4",
    titulo: "Festival Cultural",
    fecha: "5 de Marzo, 2025",
    hora: "4:00 PM",
    lugar: "Auditorio",
    descripcion: "Celebración de nuestras tradiciones culturales con presentaciones artísticas.",
    contenido: "El Festival Cultural es una celebración de nuestras raíces oaxaqueñas. Los estudiantes presentan danzas tradicionales, música, poesía y otras expresiones artísticas. También contaremos con stands de gastronomía tradicional y artesanías locales.",
    tipo: "Cultural",
    imagen: "/background4.png"
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
  {
    id: "2",
    numero: "002/2025",
    titulo: "Calendario de Exámenes Primer Bimestre",
    fecha: "10 de Enero, 2025",
    categoria: "Académico",
    resumen: "Fechas y horarios de aplicación de exámenes del primer bimestre.",
    contenido: "Los exámenes del primer bimestre se llevarán a cabo del 15 al 19 de marzo de 2025. Se publicará el calendario detallado por grado y materia en la página web y en los tableros de avisos. Los estudiantes deberán presentarse con credencial vigente y lápiz del 2.5.",
    destinatarios: ["Estudiantes", "Docentes"],
    importante: true
  },
  {
    id: "3",
    numero: "003/2025",
    titulo: "Actualización de Protocolos de Seguridad",
    fecha: "12 de Enero, 2025",
    categoria: "Administrativo",
    resumen: "Nuevos protocolos de seguridad e higiene en las instalaciones escolares.",
    contenido: "Se implementan nuevos protocolos de seguridad que incluyen: registro de entrada y salida, uso obligatorio de credencial, prohibición de acceso a personas ajenas sin autorización. Los padres de familia deberán esperar en el área designada fuera de las instalaciones.",
    destinatarios: ["Toda la Comunidad"],
    importante: false
  },
  {
    id: "4",
    numero: "004/2025",
    titulo: "Convocatoria Concurso de Oratoria",
    fecha: "14 de Enero, 2025",
    categoria: "Académico",
    resumen: "Invitación a participar en el concurso interno de oratoria 2025.",
    contenido: "Se convoca a todos los estudiantes interesados a participar en el concurso interno de oratoria. Las inscripciones estarán abiertas hasta el 25 de enero. Los ganadores representarán a la escuela en el concurso regional. Mayor información con el profesor de Español.",
    destinatarios: ["Estudiantes"],
    importante: false
  },
  {
    id: "5",
    numero: "005/2025",
    titulo: "Suspensión de Clases - Consejo Técnico",
    fecha: "15 de Enero, 2025",
    categoria: "Urgente",
    resumen: "Suspensión de actividades el último viernes de cada mes por Consejo Técnico Escolar.",
    contenido: "Se informa que el último viernes de cada mes no habrá clases debido a las sesiones de Consejo Técnico Escolar. Las fechas son: 31 de enero, 28 de febrero, 28 de marzo, 25 de abril, 30 de mayo y 27 de junio. Se solicita tomar las previsiones necesarias.",
    destinatarios: ["Estudiantes", "Padres de Familia"],
    importante: true
  }
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
  {
    id: "2",
    estudianteId: "EST002",
    nombreEstudiante: "María López Hernández",
    grado: "3",
    grupo: "B",
    periodo: "Primer Bimestre",
    cicloEscolar: "2024-2025",
    fechaEmision: "20 de Diciembre, 2024",
    calificaciones: [
      { materia: "Español", calificacion: 10.0, faltas: 0 },
      { materia: "Matemáticas", calificacion: 9.5, faltas: 0 },
      { materia: "Ciencias (Química)", calificacion: 9.8, faltas: 0 },
      { materia: "Historia", calificacion: 9.2, faltas: 0 },
      { materia: "Formación Cívica y Ética", calificacion: 10.0, faltas: 0 },
      { materia: "Inglés", calificacion: 9.0, faltas: 1 },
      { materia: "Educación Física", calificacion: 10.0, faltas: 0 },
      { materia: "Artes", calificacion: 9.5, faltas: 0 },
      { materia: "Tecnología - Diseño Industrial", calificacion: 10.0, faltas: 0 }
    ],
    promedio: 9.67
  }
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
  {
    id: "2",
    titulo: "Consejo Técnico Escolar",
    fecha: "2025-01-31",
    tipo: "Suspension",
    descripcion: "Suspensión de clases por Consejo Técnico",
    color: "#f59e0b",
    importante: true
  },
  {
    id: "3",
    titulo: "Día de la Bandera",
    fecha: "2025-02-24",
    tipo: "Evento",
    descripcion: "Ceremonia cívica conmemorativa",
    color: "#3b82f6",
    importante: false
  },
  {
    id: "4",
    titulo: "Exámenes Primer Bimestre",
    fecha: "2025-03-15",
    fechaFin: "2025-03-19",
    tipo: "Examen",
    descripcion: "Aplicación de exámenes del primer bimestre",
    color: "#ef4444",
    importante: true
  },
  {
    id: "5",
    titulo: "Vacaciones de Semana Santa",
    fecha: "2025-04-14",
    fechaFin: "2025-04-25",
    tipo: "Vacaciones",
    descripcion: "Periodo vacacional de Semana Santa",
    color: "#8b5cf6",
    importante: true
  },
  {
    id: "6",
    titulo: "Día del Niño",
    fecha: "2025-04-30",
    tipo: "Evento",
    descripcion: "Celebración del Día del Niño con actividades recreativas",
    color: "#ec4899",
    importante: false
  },
  {
    id: "7",
    titulo: "Día de las Madres",
    fecha: "2025-05-10",
    tipo: "Evento",
    descripcion: "Festival en honor a las madres de familia",
    color: "#ec4899",
    importante: false
  },
  {
    id: "8",
    titulo: "Exámenes Segundo Bimestre",
    fecha: "2025-05-19",
    fechaFin: "2025-05-23",
    tipo: "Examen",
    descripcion: "Aplicación de exámenes del segundo bimestre",
    color: "#ef4444",
    importante: true
  },
  {
    id: "9",
    titulo: "Fin de Ciclo Escolar",
    fecha: "2025-07-15",
    tipo: "Evento",
    descripcion: "Clausura del ciclo escolar 2025-2026",
    color: "#10b981",
    importante: true
  }
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
  {
    id: "2",
    nombre: "Solicitud de Constancia",
    descripcion: "Formato para solicitar constancias de estudios, conducta o calificaciones",
    categoria: "Solicitud",
    archivo: "/formatos/solicitud-constancia.pdf",
    tamano: "98 KB",
    fechaActualizacion: "05 de Enero, 2025",
    descargas: 856,
    icono: "📋"
  },
  {
    id: "3",
    nombre: "Autorización de Salida",
    descripcion: "Formato de autorización para salidas anticipadas o visitas escolares",
    categoria: "Administrativo",
    archivo: "/formatos/autorizacion-salida.pdf",
    tamano: "110 KB",
    fechaActualizacion: "08 de Enero, 2025",
    descargas: 623,
    icono: "✅"
  },
  {
    id: "4",
    nombre: "Carta Compromiso",
    descripcion: "Carta compromiso para padres de familia y estudiantes",
    categoria: "Académico",
    archivo: "/formatos/carta-compromiso.pdf",
    tamano: "156 KB",
    fechaActualizacion: "10 de Enero, 2025",
    descargas: 2134,
    icono: "📝"
  },
  {
    id: "5",
    nombre: "Solicitud de Beca",
    descripcion: "Formato para solicitar apoyo de becas escolares",
    categoria: "Solicitud",
    archivo: "/formatos/solicitud-beca.pdf",
    tamano: "203 KB",
    fechaActualizacion: "12 de Enero, 2025",
    descargas: 445,
    icono: "🎓"
  },
  {
    id: "6",
    nombre: "Reporte de Actividades",
    descripcion: "Formato para reportar actividades extracurriculares",
    categoria: "Académico",
    archivo: "/formatos/reporte-actividades.pdf",
    tamano: "87 KB",
    fechaActualizacion: "15 de Enero, 2025",
    descargas: 312,
    icono: "📊"
  }
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
  {
    id: "2",
    tipo: "Conducta",
    descripcion: "Constancia que certifica la buena conducta del estudiante durante su estancia en la escuela",
    requisitos: [
      "Solicitud firmada por padre o tutor",
      "No tener reportes disciplinarios",
      "Estar al corriente en pagos"
    ],
    tiempoEntrega: "5 días hábiles",
    costo: "Gratuito",
    documentosNecesarios: ["Identificación oficial del padre/tutor", "Credencial del estudiante"]
  },
  {
    id: "3",
    tipo: "Calificaciones",
    descripcion: "Constancia oficial con el historial de calificaciones del estudiante",
    requisitos: [
      "Solicitud firmada",
      "No tener adeudos",
      "Especificar periodo requerido"
    ],
    tiempoEntrega: "5 días hábiles",
    costo: "$50 MXN",
    documentosNecesarios: ["Identificación oficial", "Comprobante de pago"]
  },
  {
    id: "4",
    tipo: "Inscripción",
    descripcion: "Constancia que certifica la inscripción del alumno en el ciclo escolar actual",
    requisitos: [
      "Solicitud firmada por padre o tutor",
      "Estar inscrito en el ciclo actual",
      "Documentación completa en expediente"
    ],
    tiempoEntrega: "3 días hábiles",
    costo: "Gratuito",
    documentosNecesarios: ["Identificación oficial del padre/tutor"]
  }
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
  {
    id: "2",
    titulo: "Junta de Padres de Familia",
    contenido: "Se convoca a junta de padres de familia el día viernes 24 de enero a las 5:00 PM en el aula correspondiente. Asunto: Organización de actividades del bimestre.",
    fecha: "16 de Enero, 2025",
    grado: "3",
    grupo: "B",
    tipo: "Informativo",
    autor: "Mtra. Ana García",
    importante: true,
    leido: false
  },
  {
    id: "3",
    titulo: "Material para Taller de Informática",
    contenido: "Para la próxima clase traer USB de mínimo 8GB para guardar proyectos. Es indispensable para continuar con las prácticas.",
    fecha: "14 de Enero, 2025",
    grado: "1",
    tipo: "Recordatorio",
    autor: "Ing. Carlos Mendoza",
    importante: false,
    leido: true
  },
  {
    id: "4",
    titulo: "Entrega de Proyectos de Ciencias",
    contenido: "Recordatorio: La fecha límite para entregar el proyecto de ciencias es el 30 de enero. No se aceptarán trabajos después de esta fecha.",
    fecha: "17 de Enero, 2025",
    grado: "2",
    tipo: "Urgente",
    autor: "Profra. Laura Martínez",
    importante: true,
    leido: false
  },
  {
    id: "5",
    titulo: "Cambio de Horario - Educación Física",
    contenido: "Se informa que a partir del lunes 20 de enero, la clase de Educación Física se impartirá los lunes y miércoles de 11:00 a 12:00 hrs.",
    fecha: "16 de Enero, 2025",
    grado: "1",
    grupo: "C",
    tipo: "Informativo",
    autor: "Prof. Miguel Torres",
    importante: false,
    leido: false
  },
  {
    id: "6",
    titulo: "Excursión al Museo de las Culturas",
    contenido: "El próximo 5 de febrero realizaremos una visita al Museo de las Culturas de Oaxaca. Costo: $150 pesos. Favor de enviar autorización firmada antes del 25 de enero.",
    fecha: "18 de Enero, 2025",
    grado: "3",
    tipo: "Informativo",
    autor: "Profra. Patricia Ruiz",
    importante: true,
    leido: false
  }
];

