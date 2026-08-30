
import { HeaderIconName } from "@/components/ui/icons/public/header.icons"

export const navLinks:{
    href: string;
    label: string;
    icon: HeaderIconName;
}[] = [
        {
            href: "/",
            label: "Inicio",
            icon:"home",
        },
        {
            href: "/Announcements",
            label: "Avisos y noticias",
            icon: "news",
        },
        {
            href: "/galeria",
            label: "Galería",
            icon: "galery",
        },
        {
            href: "/eventos",
            label: "Eventos",
            icon: "events",
        },
        {
            href: "/inscripciones",
            label: "Preinscripciones",
            icon: "admission",
        },
        /*
        {
            href: "#ubicacion",
            label: "Ubicación",
            icon: getIcon("location"),
        },
        {
            href: "#contacto",
            label: "Contacto",
            icon: getIcon("phone"),
        },
        */
    ];
    
    export const studentServicesLinks = [
        {
            href: "#",
            label: "Sin Servicio",
            icon: "",
            description: "Sin Servicio por ahora"
        }
    ];
    {/*
        {
            href: "#circulares",
            label: "Circulares Oficiales",
            icon: "📄",
            description: "Comunicados y avisos institucionales"
        },
        {
            href: "#boletas",
            label: "Boletas y Calificaciones",
            icon: "📊",
            description: "Consulta de rendimiento académico"
        },
        {
            href: "#calendario",
            label: "Calendario Escolar",
            icon: "📅",
            description: "Eventos y fechas importantes"
        },
        {
            href: "#formatos",
            label: "Formatos y Documentos",
            icon: "📥",
            description: "Descargas administrativas"
        },
        {
            href: "#constancias",
            label: "Constancias",
            icon: "📜",
            description: "Solicitud de documentos oficiales"
        },
        {
            href: "#avisos",
            label: "Avisos por Grupo",
            icon: "📢",
            description: "Información específica por grado"
        }
    ];
    */}
    