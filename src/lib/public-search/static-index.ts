import { navLinks, studentServicesLinks } from "@/components/public/header/header.config";
import { BarLinks } from "@/components/public/header/topBar";
import {
  ADMISSION_CONTRALORIA_HOURS,
  ADMISSION_CONTACT,
  ADMISSION_FACEBOOK_URL,
  ADMISSION_REQUIRED_DOCUMENTS,
} from "@/features/admissions/public/content/admission-requirements";
import { eventItems, galleryItems } from "@/lib/data/mockData";
import type { PublicSearchItem } from "./types";

const EXCLUDED_HREFS = new Set(["/login", "/verificar-email"]);

function toHomeHash(href: string): string {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

function item(
  partial: Omit<PublicSearchItem, "searchText"> & { searchText?: string }
): PublicSearchItem {
  const searchText =
    partial.searchText ??
    [partial.label, partial.description, partial.keywords]
      .filter(Boolean)
      .join(" ");

  return { ...partial, searchText };
}

export function buildStaticPublicSearchIndex(): PublicSearchItem[] {
  const results: PublicSearchItem[] = [];

  for (const link of navLinks) {
    if (EXCLUDED_HREFS.has(link.href)) continue;
    results.push(
      item({
        id: `nav-${link.href}`,
        label: link.label,
        href: link.href,
        type: "page",
        keywords: link.label,
      })
    );
  }

  const sections = [
    {
      id: "section-inicio",
      label: "Inicio",
      href: "/#inicio",
      description: "Presentación de la Escuela Secundaria Técnica No. 118",
      keywords: "escuela secundaria técnica 118 oaxaca bienvenida hero",
    },
    {
      id: "section-notices",
      label: "Avisos y noticias",
      href: "/#notices",
      description: "Comunicados, avisos y noticias recientes de la escuela",
      keywords: "avisos noticias comunicados anuncios",
    },
    {
      id: "section-ubicacion",
      label: "Ubicación",
      href: "/#ubicacion",
      description: "Dirección, mapa y cómo llegar a la escuela",
      keywords: "ubicación dirección mapa oaxaca los ríos tehuantepec",
    },
    {
      id: "section-contacto",
      label: "Contacto",
      href: "/#contacto",
      description: "Correo, teléfono, redes sociales e información de contacto",
      keywords: "contacto correo teléfono facebook instagram",
    },
  ];

  for (const section of sections) {
    results.push(
      item({
        ...section,
        type: "section",
      })
    );
  }

  for (const service of studentServicesLinks) {
    if (!service.label || service.href === "#") continue;
    results.push(
      item({
        id: `service-${service.label}`,
        label: service.label,
        href: toHomeHash(service.href),
        type: "page",
        description: service.description,
        keywords: service.label,
      })
    );
  }

  results.push(
    item({
      id: "page-inscripciones",
      label: "Preinscripciones",
      href: "/inscripciones",
      type: "admission",
      description: "Formulario en línea, requisitos y estado del proceso de admisión",
      keywords: "preinscripción inscripción admisión registro aspirantes",
    }),
    item({
      id: "admission-requisitos",
      label: "Requisitos de preinscripción",
      href: "/inscripciones",
      type: "admission",
      description: "Documentos necesarios para el expediente del aspirante",
      keywords: "requisitos documentos acta curp constancia fotografía",
    }),
    item({
      id: "admission-contraloria",
      label: "Horario de contraloría",
      href: "/inscripciones",
      type: "admission",
      description: ADMISSION_CONTRALORIA_HOURS,
      keywords: "contraloría horario atención",
    })
  );

  for (const doc of ADMISSION_REQUIRED_DOCUMENTS) {
    results.push(
      item({
        id: `admission-doc-${doc.id}`,
        label: doc.title,
        href: "/inscripciones",
        type: "admission",
        description: doc.description,
        keywords: `${doc.required ? "obligatorio" : "opcional"} preinscripción documento`,
      })
    );
  }

  for (const gallery of galleryItems) {
    results.push(
      item({
        id: `gallery-${gallery.id}`,
        label: gallery.title,
        href: `/galeria/${gallery.id}`,
        type: "gallery",
        description: gallery.description,
        keywords: [gallery.category, gallery.author, ...(gallery.tags ?? [])].join(" "),
      })
    );
  }

  results.push(
    item({
      id: "page-galeria",
      label: "Galería",
      href: "/galeria",
      type: "page",
      description: "Fotografías y momentos destacados de la comunidad escolar",
      keywords: "galería fotos imágenes",
    })
  );

  for (const evento of eventItems) {
    results.push(
      item({
        id: `event-${evento.id}`,
        label: evento.titulo,
        href: `/eventos/${evento.id}`,
        type: "event",
        description: evento.descripcion,
        keywords: [evento.tipo, evento.lugar, evento.fecha, evento.hora].join(" "),
      })
    );
  }

  results.push(
    item({
      id: "page-eventos",
      label: "Eventos",
      href: "/eventos",
      type: "page",
      description: "Actividades académicas, culturales y deportivas",
      keywords: "eventos actividades calendario",
    })
  );

  results.push(
    item({
      id: "page-announcements",
      label: "Avisos y noticias",
      href: "/Announcements",
      type: "page",
      description: "Listado completo de avisos, noticias y comunicados",
      keywords: "avisos noticias comunicados",
    })
  );

  results.push(
    item({
      id: "contact-email",
      label: "Correo electrónico",
      href: `mailto:${ADMISSION_CONTACT.email}`,
      type: "contact",
      description: ADMISSION_CONTACT.email,
      keywords: "correo email contacto",
    }),
    item({
      id: "contact-phone",
      label: "Teléfono",
      href: ADMISSION_CONTACT.phoneHref,
      type: "contact",
      description: ADMISSION_CONTACT.phone,
      keywords: "teléfono llamar contacto",
    }),
    item({
      id: "contact-address",
      label: "Dirección",
      href: "/#ubicacion",
      type: "contact",
      description: "Río Tehuantepec 300, Fraccionamiento los Ríos, Oaxaca de Juárez, 68020",
      keywords: "dirección ubicación mapa oaxaca",
    }),
    item({
      id: "contact-facebook",
      label: "Facebook",
      href: ADMISSION_FACEBOOK_URL,
      type: "contact",
      description: "Página oficial de Escuela Secundaria Técnica 118 en Facebook",
      keywords: "facebook redes sociales",
    }),
    item({
      id: "contact-instagram",
      label: "Instagram",
      href: "https://www.instagram.com/est_118_oax",
      type: "contact",
      description: "Perfil oficial @est_118_oax en Instagram",
      keywords: "instagram redes sociales",
    }),
    item({
      id: "school-cct",
      label: "CCT 09DST0118V",
      href: "/#ubicacion",
      type: "contact",
      description: "Clave de Centro de Trabajo de la Secundaria Técnica No. 118",
      keywords: "cct clave centro trabajo",
    }),
    item({
      id: "school-ieepo",
      label: "IEEPO",
      href: "/#contacto",
      type: "contact",
      description: "Instituto Estatal de Educación Pública de Oaxaca",
      keywords: "ieepo oaxaca educación pública",
    })
  );

  for (const link of BarLinks) {
    results.push(
      item({
        id: `topbar-${link.icon}`,
        label: link.name,
        href: link.href,
        type: "contact",
        keywords: link.icon,
      })
    );
  }

  return results;
}
