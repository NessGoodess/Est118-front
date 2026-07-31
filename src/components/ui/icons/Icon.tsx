import type { ReactNode, SVGProps } from "react";

export type IconProps = {
  className?: string;
  children?: ReactNode;
} & Omit<SVGProps<SVGSVGElement>, "children">;

/** Wrapper SVG compartido — color vía `currentColor` / Tailwind `text-*`. */
export default function Icon({
  className = "w-5 h-5",
  children,
  ...rest
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}
