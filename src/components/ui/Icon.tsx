import React from "react";

export type IconName =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "waiting"
  | "scanning"
  | "register";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = "currentColor" }: IconProps) {
  const icons: Record<IconName, React.ReactNode> = {
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    ),

    error: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    ),

    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01M5.07 19h13.86L12 3 5.07 19z"
      />
    ),

    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m2-4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
      />
    ),

    waiting: (
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
    ),

    scanning: (
      <circle
        cx="12"
        cy="12"
        r="9"
        strokeWidth="2"
        className="animate-spin origin-center"
      />
    ),
 
    register: (
      <g>
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeWidth="2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v8M8 12h8"
        />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke={color}
      fill="none"
    >
      {icons[name]}
    </svg>
  );
}
