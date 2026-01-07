import { Schedule } from "@/lib/types/attendance";

const weekdayAliases: Record<number, string[]> = {
  0: ["sunday", "domingo", "sun", "dom"],
  1: ["monday", "lunes", "mon", "lun"],
  2: ["tuesday", "martes", "tue", "mar"],
  3: ["wednesday", "miercoles", "miércoles", "wed", "mie", "mié"],
  4: ["thursday", "jueves", "thu", "jue"],
  5: ["friday", "viernes", "fri", "vie"],
  6: ["saturday", "sabado", "sábado", "sat", "sab", "sáb"],
};

const normalize = (s: string) => s.trim().toLowerCase();

export function isTodayLabel(dayLabel: string, date: Date = new Date()): boolean {
  const todayIdx = date.getDay();
  const label = normalize(dayLabel);
  // direct match
  if (weekdayAliases[todayIdx].some(a => a === label)) return true;
  // handle common punctuation/case
  const stripped = label.replaceAll(".", "");
  if (weekdayAliases[todayIdx].some(a => a === stripped)) return true;
  return false;
}

export function timeToMinutes(time: string): number {
  const [hh = "0", mm = "0"] = time.split(":");
  const h = parseInt(hh, 10) || 0;
  const m = parseInt(mm, 10) || 0;
  return h * 60 + m;
}

export function isScheduleActiveNow(schedule: Schedule, now: Date = new Date()): boolean {
  if (!isTodayLabel(schedule.day, now)) return false;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(schedule.start_time);
  const end = timeToMinutes(schedule.end_time);
  return nowMinutes >= start && nowMinutes <= end;
}

export function selectActiveScheduleToday(schedules: Schedule[], now: Date = new Date()): Schedule | undefined {
  const todays = schedules.filter(s => isTodayLabel(s.day, now));
  if (todays.length === 0) return undefined;
  return todays.find(s => isScheduleActiveNow(s, now));
}

export function selectFirstScheduleToday(schedules: Schedule[], now: Date = new Date()): Schedule | undefined {
  const todays = schedules.filter(s => isTodayLabel(s.day, now));
  return todays[0];
}


