export type IdentityBanner = {
  id: string
  src: string
  alt: string
  eyebrow: string
  title: string
  description: string
  href: string
  cta: string
}

function wideUnsplash(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&h=900&q=80`
}

/** Full-bleed home banners. Photo IDs were checked live against Unsplash. */
export const IDENTITY_BANNERS: IdentityBanner[] = [
  {
    id: "comunidad",
    src: wideUnsplash("photo-1524178232363-1fb2b075b655"),
    alt: "Estudiantes reunidos en un aula magna",
    eyebrow: "Comunidad estudiantil",
    title: "Así se vive la Técnica 118",
    description: "Aulas, talleres y el día a día de quienes estudian en Los Ríos.",
    href: "/galeria",
    cta: "Ver galería",
  },
  {
    id: "talleres",
    src: wideUnsplash("photo-1581091226825-a6a2a5aee158"),
    alt: "Estudiantes trabajando con computadoras en un taller",
    eyebrow: "Formación técnica",
    title: "Cuatro talleres, una identidad",
    description: "Informática, diseño industrial, confección y máquinas.",
    href: "/#talleres",
    cta: "Conocer talleres",
  },
  {
    id: "aula",
    src: wideUnsplash("photo-1509062522246-3755977927d7"),
    alt: "Grupo de estudiantes en el aula",
    eyebrow: "Vida académica",
    title: "Aprender juntos en el aula",
    description: "Secundaria pública con el sello de la formación técnica.",
    href: "/#vida",
    cta: "Ver vida escolar",
  },
  {
    id: "plantel",
    src: wideUnsplash("photo-1562774053-701939374585"),
    alt: "Edificio escolar visto desde el patio",
    eyebrow: "El plantel",
    title: "En Fraccionamiento los Ríos",
    description: "Oaxaca de Juárez · CCT 09DST0118V · IEEPO",
    href: "/#ubicacion",
    cta: "Cómo llegar",
  },
]
