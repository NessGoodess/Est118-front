type SvgProps = {
    className?: string;
  };
  
  export const SVGs = {
    user: ({ className }: SvgProps) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 16-4 16 0" />
      </svg>
    ),
  
    school: ({ className }: SvgProps) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
      </svg>
    ),
  
    empty: ({ className }: SvgProps) => (
      <svg viewBox="0 0 200 200" className={className}>
        {/* SVG largo aquí */}
      </svg>
    ),
  } as const;
  