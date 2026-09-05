export interface Formato {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: "Académico" | "Administrativo" | "Justificante" | "Solicitud";
  archivo: string;
  tamano: string;
  fechaActualizacion: string;
  descargas: number;
  icono: string;
}

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
    icono: "📄",
  },
];
