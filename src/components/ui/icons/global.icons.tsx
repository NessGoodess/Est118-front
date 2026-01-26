
/**
 * Icons for the global
 */
interface IconProps {
  className?: string;
}

const Icon = ({ children, className = "w-5 h-5" }: { children: React.ReactNode, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const GlobalIcons = {
  atSign: ({ className = "w-5 h-5" }: IconProps) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </Icon>
  ),
  password: ({ className = "w-5 h-5" }: IconProps) => (
    <Icon className={className}>
      <circle cx="12" cy="16" r="1" /><rect x="3" y="10" width="18" height="12" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </Icon>
  ),
  eyeClosed: ({ className = "w-5 h-5" }: IconProps) => (
    <Icon className={className}>
      <path d="m15 18-.722-3.25" /><path d="M2 8a10.645 10.645 0 0 0 20 0" /><path d="m20 15-1.726-2.05" /><path d="m4 15 1.726-2.05" /><path d="m9 18 .722-3.25" />
    </Icon>
  ),
  eyeOpen: ({ className = "w-5 h-5" }: IconProps) => (
    <Icon className={className}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" />
    </Icon>
  ),


} as const;

export type GlobalIconName = keyof typeof GlobalIcons;

interface IconByNameProps {
  name: GlobalIconName;
  className?: string;
}

export function IconByName({ name, className }: IconByNameProps) {
  const IconComponent = GlobalIcons[name];
  if (!IconComponent) return null;

  return <IconComponent className={className} />;
}
