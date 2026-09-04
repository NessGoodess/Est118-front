"use client";

import { motion } from "framer-motion";
import { IconByName, type AppIconName } from "@/components/ui/icons";
import PublicThemeSwitch from "./PublicThemeSwitch";

const ease = [0.16, 1, 0.3, 1] as const;

type BarLink = {
  href: string;
  icon: AppIconName;
  name: string;
  external?: boolean;
};

const BAR_LINKS: readonly BarLink[] = [
  {
    href: "mailto:est.118.oax@gmail.com",
    icon: "mail",
    name: "est.118.oax@gmail.com",
  },
  {
    href: "tel:+529515134204",
    icon: "phone",
    name: "+52 951 513 4204",
  },
  {
    href: "https://maps.app.goo.gl/K1ca1DwxrsoBiZLL6",
    icon: "mapPin",
    name: "Los Rios, Oaxaca",
    external: true,
  },
];

/** Contactos de la top bar (también indexados en búsqueda pública). */
export const BarLinks = BAR_LINKS;

const linkClass =
  "group flex items-center gap-1.5 text-xs font-medium text-brand-100 transition-colors hover:text-public-on-media";

export default function TopBar() {
  return (
    <motion.div
      className="hidden lg:block"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      <div className="border-b border-brand-700/30 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs font-medium text-brand-100">
            <IconByName name="clock" className="h-3.5 w-3.5" />
            <span>Lunes - Viernes: 7:00 - 14:00</span>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            {BAR_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={linkClass}
              >
                <IconByName
                  name={link.icon}
                  className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                />
                <span>{link.name}</span>
              </a>
            ))}

            <div className="ml-1 border-l border-public-glass-border pl-3 lg:pl-4">
              <PublicThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
