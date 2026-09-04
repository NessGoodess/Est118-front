"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  targetIso: string;
  onComplete?: () => void;
};

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function diffParts(target: Date, now: Date): Parts {
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

const PLACEHOLDER: Parts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  done: false,
};

export default function AdmissionsCountdown({ targetIso, onComplete }: Props) {
  // null hasta montar en cliente → mismo HTML en SSR e hidratación (placeholders).
  const [parts, setParts] = useState<Parts | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const targetDate = new Date(targetIso);
    completedRef.current = false;

    const tick = () => {
      const next = diffParts(targetDate, new Date());
      setParts(next);
      if (next.done && !completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
        return true;
      }
      return next.done;
    };

    if (tick()) return;

    const id = window.setInterval(() => {
      if (tick()) window.clearInterval(id);
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetIso]);

  const display = parts ?? PLACEHOLDER;
  const ready = parts !== null;

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      role="timer"
      aria-live="polite"
      aria-busy={!ready}
    >
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="border border-border bg-surface-app px-2 py-4 text-center"
        >
          <span
            className={`font-mono text-3xl font-semibold tabular-nums sm:text-4xl ${
              ready ? "text-foreground" : "text-fg-muted/40"
            }`}
          >
            {ready ? pad(display[key]) : "--"}
          </span>
          <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
