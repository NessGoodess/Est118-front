"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScroll } from "@/contexts/ScrollProvider";
import SearchBar from "./SearchBar";


/* ──────────────────────────────
   Tipos
────────────────────────────── */
type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type StudentServiceLink = {
  href: string;
  label: string;
  description: string;
};

/* ──────────────────────────────
   Datos
────────────────────────────── */
const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Inicio",
    icon: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    href: "/noticias",
    label: "Noticias",
    icon: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />,
  },
  {
    href: "/galeria",
    label: "Galería",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
  },
  {
    href: "/eventos",
    label: "Eventos",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    href: "#ubicacion",
    label: "Ubicación",
    icon: (
      <>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    href: "/inscripciones",
    label: "Inscripciones 2026",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
  },
  {
    href: "#contacto",
    label: "Contacto",
    icon: (
      <>
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" />
      </>
    ),
  },
];

const studentServices: StudentServiceLink[] = [
  { href: "#circulares", label: "Circulares Oficiales", description: "Comunicados institucionales" },
  { href: "#boletas", label: "Boletas y Calificaciones", description: "Consulta académica" },
  { href: "#calendario", label: "Calendario Escolar", description: "Ciclo escolar vigente" },
  { href: "#formatos", label: "Formatos", description: "Descarga de documentos" },
  { href: "#constancias", label: "Constancias", description: "Solicitudes escolares" },
  { href: "#avisos", label: "Avisos por Grupo", description: "Información por grupo" },
];

/* ──────────────────────────────
   Icono base
────────────────────────────── */
const Icon = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

/* ──────────────────────────────
   Componente
────────────────────────────── */
export default function Header() {
  const { scrolled } = useScroll();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const navItemClass = scrolled
    ? "text-foreground hover:text-primary-hover hover:bg-surface-muted"
    : "text-white hover:bg-surface-elevated/10";

  const handleScrollTo = useCallback((href: string) => {
    if (!href.startsWith("#")) return;

    const id = href.replace("#", "");
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setMobileOpen(false);
    setDesktopServicesOpen(false);
    setMobileServicesOpen(false);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "bg-surface-elevated shadow-md" : "bg-[#181d49]"}`}>
      {/* Header principal */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.PNG"
              alt="Escuela Secundaria Técnica 118"
              width={64}
              height={64}
              priority
            />
            <div className="leading-tight">
              <h1 className={`font-bold ${scrolled ? "text-foreground" : "text-white"}`}>
                Técnica 118
              </h1>
              <p className={`text-xs ${scrolled ? "text-fg-muted" : "text-white/80"}`}>
                Escuela Secundaria Técnica
              </p>
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Navegación principal">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${navItemClass}`}>
                  <Icon className="w-5 h-5">{link.icon}</Icon>
                  {link.label}
                </Link>
              ) : (
                <button key={link.href} onClick={() => handleScrollTo(link.href)} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${navItemClass}`}>
                  <Icon className="w-5 h-5">{link.icon}</Icon>
                  {link.label}
                </button>
              )
            )}

            {/* Servicios */}
            <div className="relative">
              <button
                onClick={() => setDesktopServicesOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={desktopServicesOpen}
                className={`px-4 py-2 rounded-lg ${navItemClass}`}
              >
                Servicios Académicos
              </button>

              {desktopServicesOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-elevated shadow-xl overflow-hidden">
                  <div className="px-4 py-3 bg-primary-hover text-primary-foreground">
                    <p className="font-semibold text-sm">Servicios Académicos</p>
                    <p className="text-xs opacity-90">Acceso institucional</p>
                  </div>
                  <div className="py-2">
                    {studentServices.map((s) => (
                      <button
                        key={s.href}
                        onClick={() => handleScrollTo(s.href)}
                        className="w-full text-left px-4 py-3 hover:bg-primary-soft"
                      >
                        <p className="text-sm font-medium text-foreground">{s.label}</p>
                        <p className="text-xs text-fg-muted">{s.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Buscador + móvil */}
          <div className="flex items-center gap-2">
            <SearchBar scrolled={scrolled} />

            <button
              className="xl:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#181d49] px-4 py-4 space-y-1">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block text-white px-3 py-2">
                {link.label}
              </Link>
            ) : (
              <button key={link.href} onClick={() => handleScrollTo(link.href)} className="block w-full text-left text-white px-3 py-2">
                {link.label}
              </button>
            )
          )}

          <button
            onClick={() => setMobileServicesOpen((v) => !v)}
            className="w-full text-left text-white px-3 py-2"
          >
            Servicios Académicos
          </button>

          {mobileServicesOpen && (
            <div className="ml-4 space-y-1">
              {studentServices.map((s) => (
                <button
                  key={s.href}
                  onClick={() => handleScrollTo(s.href)}
                  className="block w-full text-left text-white/90 px-3 py-2 text-sm"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
