import Link from "next/link";

export default function ShortcutCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm transition-[border-color,transform,box-shadow] hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-primary-soft text-primary transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-fg-muted leading-snug">{description}</p>
      </div>
    </Link>
  );
}
