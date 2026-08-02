type SidePosition = "left" | "right";

interface ContentLayoutProps {
  children: React.ReactNode;
  side?: React.ReactNode;
  sidePosition?: SidePosition;
  className?: string;
  "aria-label"?: string;
}

/**
 * Page body under the header: optional sticky side column + main.
 */
export default function ContentLayout({
  children,
  side,
  sidePosition,
  className = "",
  "aria-label": ariaLabel = "Contenido",
}: ContentLayoutProps) {

  if (!side) return <>{children}</>;

  return (
    <div
      aria-label={ariaLabel}
      className={`flex max-w-full min-w-0 flex-col gap-2 lg:gap-6 items-stretch xl:flex-row xl:items-start ${sidePosition === "right" ? "xl:flex-row-reverse" : ""
        } ${className}`}
    >
      <section
        aria-label="Panel lateral"
        className="w-full min-w-0 max-w-full xl:w-72 xl:max-w-[18rem] xl:shrink-0 xl:sticky xl:top-16 xl:self-start"
      >
        {side}
      </section>
      <section className="min-w-0 max-w-full flex-1 overflow-x-clip">{children}</section>
    </div>
  );
}
