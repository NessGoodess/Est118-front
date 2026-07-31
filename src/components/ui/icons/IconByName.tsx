import { AppIcons, type AppIconName } from "./registry";

export type { AppIconName };

interface IconByNameProps {
  name: AppIconName;
  className?: string;
}

export default function IconByName({ name, className = "w-5 h-5" }: IconByNameProps) {
  const IconComponent = AppIcons[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
