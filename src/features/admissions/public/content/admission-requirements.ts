export type AdmissionRequirement = {
  id: string;
  title: string;
  description: string;
  required: boolean;
};

export const ADMISSION_REQUIRED_DOCUMENTS: AdmissionRequirement[] = [
  {
    id: "01",
    title: "Acta de nacimiento del aspirante",
    description: "Original y copia legible.",
    required: true,
  },
  {
    id: "02",
    title: "CURP del aspirante",
    description: "Documento o constancia vigente.",
    required: true,
  },
  {
    id: "03",
    title: "Comprobante de domicilio",
    description: "No mayor a tres meses de antigüedad.",
    required: true,
  },
  {
    id: "04",
    title: "Constancia de estudios",
    description: "De la escuela de procedencia, con promedio parcial.",
    required: true,
  },
  {
    id: "05",
    title: "Fotografía tamaño infantil",
    description: "Fondo blanco, sin retoque digital.",
    required: true,
  },
  {
    id: "06",
    title: "CURP del tutor",
    description: "Documento o constancia vigente.",
    required: true,
  },
  {
    id: "07",
    title: "Folio de vales escolares",
    description: "Solo si aplica al aspirante.",
    required: false,
  },
];

export const ADMISSION_FACEBOOK_URL = "https://www.facebook.com/EscSecTecnica118";

export const ADMISSION_CONTRALORIA_HOURS =
  "7:15 a 9:30 y de 10:00 a 13:30 horas, de lunes a viernes";

export const ADMISSION_CONTACT = {
  email: "est.118.oax@gmail.com",
  phone: "951 513 4204",
  phoneHref: "tel:+529515134204",
} as const;
