
import { IconByName } from "@/components/ui/icons/public/header.icons";
import { HeaderIconName } from "@/components/ui/icons/public/header.icons";

interface TopBarProps {
    scrolled: boolean;
}
type BarLink = {
    href: string;
    icon: HeaderIconName;
    name: string;
    external?: boolean;
};


export const BarLinks: readonly BarLink[] = [
    {
        href: "mailto:est.118.oax@gmail.com",
        icon: "mail",
        name: "est.118.oax@gmail.com"
    },
    {
        href: "tel:+529515134204",
        icon: "phone",
        name: "+52 951 513 4204"
    },
    {
        href: "https://maps.app.goo.gl/K1ca1DwxrsoBiZLL6",
        icon: "location",
        name: "Los Rios, Oaxaca",
        external: true,
    }
] as const;

export default function TopBar({ scrolled }: TopBarProps) {
    return (
        <div
            className={`hidden lg:block transition-all duration-300 overflow-hidden ${scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
                }`}
        >
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 border-b border-blue-700/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between py-2.5">
                        <div className="flex items-center gap-4 text-brand-100 text-xs">
                            <div className="flex items-center gap-1.5">
                                <IconByName name="clock" className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Lunes - Viernes: 7:00 - 14:00</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 lg:gap-5">
                            {BarLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    className="flex items-center gap-1.5 text-brand-100 hover:text-white transition-colors text-xs group"
                                >
                                    <IconByName name={link.icon} className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
