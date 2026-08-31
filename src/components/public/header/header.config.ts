import type { AppIconName } from "@/components/ui/icons";

export const navLinks: {
    href: string;
    label: string;
    icon: AppIconName;
}[] = [
        {
            href: "/",
            label: "Inicio",
            icon: "home",
        },
        {
            href: "/Announcements",
            label: "Avisos y noticias",
            icon: "news",
        },
        {
            href: "/galeria",
            label: "Galería",
            icon: "gallery",
        },
        {
            href: "/eventos",
            label: "Eventos",
            icon: "calendarTime",
        },
        {
            href: "/inscripciones",
            label: "Preinscripciones",
            icon: "users",
        },
    ];

export type StudentServiceLink = {
    href: string;
    label: string;
    icon: AppIconName;
    description: string;
};

export const studentServicesLinks: StudentServiceLink[] = [
    {
        href: "#",
        label: "Sin servicio disponible",
        icon: "calendarTime",
        description: "Próximamente disponible",
    },
    /*
        {
        href: "/calendar",
        label: "Calendario Escolar",
        icon: "calendar",
        description: "Eventos y fechas importantes",
    },
    {
        href: "/formats",
        label: "Formatos y Documentos",
        icon: "fileText",
        description: "Descargas administrativas",
    },
    */
];
