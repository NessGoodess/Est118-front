"use client";

import { useEffect, useState } from "react";

type Props = {
  targetIso: string;
  onComplete?: () => void;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function diffParts(target: Date, now: Date) {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}

const UNITS = [
  { key: "days", label: "Días" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
] as const;

export default function AdmissionsCountdown({ targetIso, onComplete }: Props) {
  const [parts, setParts] = useState(() =>
    diffParts(new Date(targetIso), new Date())
  );

  useEffect(() => {
    const targetDate = new Date(targetIso);
    const tick = () => {
      const next = diffParts(targetDate, new Date());
      setParts(next);
      if (next.done) {
        onComplete?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso, onComplete]);

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      role="timer"
      aria-live="polite"
    >
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="border border-border bg-surface-app px-2 py-4 text-center"
        >
          <span className="font-mono text-3xl font-semibold tabular-nums text-foreground sm:text-4xl">
            {pad(parts[key])}
          </span>
          <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
