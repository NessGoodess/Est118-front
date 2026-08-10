import { z } from "zod";

const timeHm = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Usa el formato HH:mm");

export const attendanceSettingsSchema = z
  .object({
    timezone: z.string().min(1, "La zona horaria es requerida"),
    entry_time: timeHm,
    tolerance_minutes: z.coerce
      .number({ error: "La tolerancia debe ser un número" })
      .int("La tolerancia debe ser un número entero")
      .min(0, "La tolerancia no puede ser negativa")
      .max(180, "La tolerancia no puede ser mayor a 180 minutos"),
    exit_earliest: timeHm,
    entry_window_closes_at: timeHm,
  })
  .refine(
    (data) => data.entry_window_closes_at > data.entry_time,
    {
      message: "El cierre de entrada debe ser posterior a la hora de entrada",
      path: ["entry_window_closes_at"],
    }
  );

export type AttendanceSettingsFormData = z.infer<typeof attendanceSettingsSchema>;
