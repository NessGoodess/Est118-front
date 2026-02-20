// ============================================================================
// UTILIDAD DE FORMATO DE FECHAS
// lib/utils/dateFormatter.ts
// ============================================================================

/**
 * Opciones de configuración para el formateador
 */
interface DateFormatterOptions {
  locale?: string;
  timezone?: string;
}

/**
 * Clase principal para formatear fechas
 */
export class DateFormatter {
  private locale: string;
  private timezone: string;

  constructor(options: DateFormatterOptions = {}) {
    this.locale = options.locale || 'es-MX';
    this.timezone = options.timezone || 'America/Mexico_City';
  }

  /**
   * Convierte string, Date o timestamp de Laravel a objeto Date
   * Soporta:
   * - Date object
   * - ISO 8601: "2024-01-20T16:50:00.000000Z"
   * - Laravel Carbon: "2024-01-20 16:50:00"
   * - Unix timestamp: 1705766400
   * - Timestamp en milisegundos: 1705766400000
   */
  private parseDate(date: Date | string | number): Date {
    // Si es Date, retornar directamente
    if (date instanceof Date) {
      return date;
    }

    // Si es número (timestamp Unix o milisegundos)
    if (typeof date === 'number') {
      // Si el número es menor a un billón, asumimos que es timestamp Unix (segundos)
      // Laravel a veces envía timestamps en segundos
      if (date < 10000000000) {
        return new Date(date * 1000);
      }
      // Si es mayor, es timestamp en milisegundos
      return new Date(date);
    }

    // Si es string
    if (typeof date === 'string') {
      // Limpiar string (remover espacios)
      const cleanDate = date.trim();

      // Verificar si es un timestamp numérico en string
      if (/^\d+$/.test(cleanDate)) {
        const timestamp = parseInt(cleanDate, 10);
        return this.parseDate(timestamp);
      }

      // Formato de Laravel Carbon sin timezone: "2024-01-20 16:50:00"
      // Convertir a formato ISO antes de parsear
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(cleanDate)) {
        return new Date(cleanDate.replace(' ', 'T') + 'Z');
      }

      // Intentar parsear como ISO 8601 o cualquier formato estándar
      const parsedDate = new Date(cleanDate);
      
      // Verificar si la fecha es válida
      if (isNaN(parsedDate.getTime())) {
        console.error('Fecha inválida:', date);
        return new Date(); // Retornar fecha actual como fallback
      }

      return parsedDate;
    }

    // Fallback: retornar fecha actual
    console.error('Formato de fecha no reconocido:', date);
    return new Date();
  }

  // ==========================================================================
  // FORMATOS BÁSICOS
  // ==========================================================================

  /**
   * Formato sin año: 24 de enero
   */
  withoutYear(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      day: '2-digit',
      month: 'long',
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Formato sin año con hora: 24 de enero 4:50 PM
   */
  withoutYearWithTime(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Formato corto: 24/01/2023
   */
  short(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Formato corto con hora: 24/01/2023 4:50 PM
   */
  shortWithTime(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Formato medio: 24 de enero de 2023
   */
  medium(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Formato medio con hora: 24 de enero de 2023, 4:50 PM
   */
  mediumWithTime(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Formato largo con día: Sábado, 20 de enero de 2024, 4:40 PM
   */
  long(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Formato largo sin hora: Sábado, 20 de enero de 2024
   */
  longWithoutTime(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Solo hora: 4:50 PM
   */
  time(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Hora en formato 24h: 16:50
   */
  time24(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Solo día de la semana: Sábado
   */
  weekday(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      weekday: 'long',
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Día de la semana corto: Sáb
   */
  weekdayShort(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      weekday: 'short',
      timeZone: this.timezone,
    }).format(d);
  }

  /**
   * Solo mes y año: Enero de 2024
   */
  monthYear(date: Date | string): string {
    const d = this.parseDate(date);
    return new Intl.DateTimeFormat(this.locale, {
      month: 'long',
      year: 'numeric',
      timeZone: this.timezone,
    }).format(d);
  }

  // ==========================================================================
  // FORMATO RELATIVO (hace X tiempo)
  // ==========================================================================

  /**
   * Formato relativo: "hace 5 minutos", "ayer", "hace 2 días"
   */
  relative(date: Date | string): string {
    const d = this.parseDate(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Hace menos de 1 minuto
    if (diffInSeconds < 60) {
      return 'hace unos segundos';
    }

    // Hace 1 minuto
    if (diffInMinutes === 1) {
      return 'hace 1 minuto';
    }

    // Hace X minutos (menos de 1 hora)
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} minutos`;
    }

    // Hace 1 hora
    if (diffInHours === 1) {
      return 'hace 1 hora';
    }

    // Hace X horas (mismo día)
    if (diffInHours < 24 && this.isSameDay(d, now)) {
      return `hace ${diffInHours} horas`;
    }

    // Ayer
    if (diffInDays === 1 || (diffInHours < 48 && this.isYesterday(d, now))) {
      return 'ayer';
    }

    // Anteayer
    if (diffInDays === 2 || this.isDayBeforeYesterday(d, now)) {
      return 'anteayer';
    }

    // Hace X días (misma semana)
    if (diffInDays < 7) {
      return `hace ${diffInDays} días`;
    }

    // Hace una semana
    if (diffInDays < 14) {
      return 'hace una semana';
    }

    // Hace X semanas (mismo mes)
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInDays < 30) {
      return `hace ${diffInWeeks} semanas`;
    }

    // Este mes o mes pasado
    if (this.isSameMonth(d, now)) {
      return `el ${d.getDate()} de ${this.getMonthName(d)}`;
    }

    if (this.isLastMonth(d, now)) {
      return `el ${d.getDate()} de ${this.getMonthName(d)}`;
    }

    // Mismo año
    if (this.isSameYear(d, now)) {
      return `el ${d.getDate()} de ${this.getMonthName(d)}`;
    }

    // Año pasado
    if (d.getFullYear() === now.getFullYear() - 1) {
      return `el ${d.getDate()} de ${this.getMonthName(d)} del año pasado`;
    }

    // Otro año
    return `el ${d.getDate()} de ${this.getMonthName(d)} de ${d.getFullYear()}`;
  }

  /**
   * Formato relativo con hora: "hace 5 minutos", "ayer a las 4:50 PM"
   */
  relativeWithTime(date: Date | string): string {
    const d = this.parseDate(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    // Para tiempos recientes, no mostramos la hora
    if (diffInMinutes < 60) {
      return this.relative(date);
    }

    const timeStr = this.time(d);

    // Hoy
    if (this.isSameDay(d, now)) {
      return `hoy a las ${timeStr}`;
    }

    // Ayer
    if (this.isYesterday(d, now)) {
      return `ayer a las ${timeStr}`;
    }

    // Anteayer
    if (this.isDayBeforeYesterday(d, now)) {
      return `anteayer a las ${timeStr}`;
    }

    // Esta semana
    if (diffInHours < 168) { // 7 días
      return `${this.weekday(d)} a las ${timeStr}`;
    }

    // Mismo año
    if (this.isSameYear(d, now)) {
      return `el ${d.getDate()} de ${this.getMonthName(d)} a las ${timeStr}`;
    }

    // Otro año
    return `el ${d.getDate()} de ${this.getMonthName(d)} de ${d.getFullYear()} a las ${timeStr}`;
  }

  // ==========================================================================
  // FORMATOS ESPECIALES
  // ==========================================================================

  /**
   * Formato para chat: "4:50 PM", "Ayer", "20/01/2024"
   */
  chat(date: Date | string): string {
    const d = this.parseDate(date);
    const now = new Date();

    if (this.isSameDay(d, now)) {
      return this.time(d);
    }

    if (this.isYesterday(d, now)) {
      return 'Ayer';
    }

    if (this.isSameYear(d, now)) {
      return this.short(d);
    }

    return this.short(d);
  }

  /**
   * Formato para notificaciones: "Hace 5 min", "Ayer", "20 ene"
   */
  notification(date: Date | string): string {
    const d = this.parseDate(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Ahora';
    }

    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    }

    if (diffInHours < 24 && this.isSameDay(d, now)) {
      return `Hace ${diffInHours}h`;
    }

    if (this.isYesterday(d, now)) {
      return 'Ayer';
    }

    if (diffInDays < 7) {
      return `Hace ${diffInDays}d`;
    }

    const monthShort = new Intl.DateTimeFormat(this.locale, {
      month: 'short',
      timeZone: this.timezone,
    }).format(d);

    return `${d.getDate()} ${monthShort}`;
  }

  /**
   * Formato ISO: 2024-01-20T16:50:00.000Z
   */
  iso(date: Date | string): string {
    const d = this.parseDate(date);
    return d.toISOString();
  }

  /**
   * Formato SQL: 2024-01-20 16:50:00
   */
  sql(date: Date | string): string {
    const d = this.parseDate(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // ==========================================================================
  // MÉTODOS AUXILIARES
  // ==========================================================================

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private isYesterday(date: Date, now: Date): boolean {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return this.isSameDay(date, yesterday);
  }

  private isDayBeforeYesterday(date: Date, now: Date): boolean {
    const dayBefore = new Date(now);
    dayBefore.setDate(dayBefore.getDate() - 2);
    return this.isSameDay(date, dayBefore);
  }

  private isSameMonth(date1: Date, date2: Date): boolean {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private isLastMonth(date: Date, now: Date): boolean {
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return this.isSameMonth(date, lastMonth);
  }

  private isSameYear(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear();
  }

  private getMonthName(date: Date): string {
    return new Intl.DateTimeFormat(this.locale, {
      month: 'long',
      timeZone: this.timezone,
    }).format(date);
  }
}

// ============================================================================
// INSTANCIA GLOBAL Y FUNCIONES DE CONVENIENCIA
// ============================================================================

export const dateFormatter = new DateFormatter();

// Funciones de conveniencia
export const formatWithoutYear = (date: Date | string) => dateFormatter.withoutYear(date);
export const formatWithoutYearWithTime = (date: Date | string) => dateFormatter.withoutYearWithTime(date);
export const formatShort = (date: Date | string) => dateFormatter.short(date);
export const formatShortWithTime = (date: Date | string) => dateFormatter.shortWithTime(date);
export const formatMedium = (date: Date | string) => dateFormatter.medium(date);
export const formatMediumWithTime = (date: Date | string) => dateFormatter.mediumWithTime(date);
export const formatLong = (date: Date | string) => dateFormatter.long(date);
export const formatLongWithoutTime = (date: Date | string) => dateFormatter.longWithoutTime(date);
export const formatTime = (date: Date | string) => dateFormatter.time(date);
export const formatTime24 = (date: Date | string) => dateFormatter.time24(date);
export const formatRelative = (date: Date | string) => dateFormatter.relative(date);
export const formatRelativeWithTime = (date: Date | string) => dateFormatter.relativeWithTime(date);
export const formatChat = (date: Date | string) => dateFormatter.chat(date);
export const formatNotification = (date: Date | string) => dateFormatter.notification(date);
export const formatISO = (date: Date | string) => dateFormatter.iso(date);
export const formatSQL = (date: Date | string) => dateFormatter.sql(date);


// ============================================================================
// TIPOS Y CONSTANTES EXPORTADAS
// ============================================================================

export type DateFormat = 
  | 'withoutYear' // 24 de enero
  | 'withoutYearWithTime' // 24 de enero 4:50 PM
  | 'short' // 24/01/2023
  | 'shortWithTime' // 24/01/2023 4:50 PM
  | 'medium' // 24 de enero de 2023
  | 'mediumWithTime' // 24 de enero de 2023, 4:50 PM
  | 'long' // Sábado, 20 de enero de 2024, 4:40 PM
  | 'longWithoutTime' // Sábado, 20 de enero de 2024
  | 'time' // 4:50 PM
  | 'time24' // 16:50
  | 'relative' // Hace 2 horas 
  | 'relativeWithTime' // Hace 2 horas, 4:50 PM
  | 'chat' // 4:50 PM
  | 'notification' // Hace 5 min, Hace 2 hrs, Ayer, 24 de enero, 24/01/2023
  | 'iso' // 2024-01-20T16:50:00.000000Z
  | 'sql'; // 2024-01-20 16:50:00

/**
 * Función universal para formatear fechas
 */
export function formatDate(date: Date | string, format: DateFormat = 'medium'): string {
  const formatters: Record<DateFormat, (d: Date | string) => string> = {
    withoutYear: formatWithoutYear,
    withoutYearWithTime: formatWithoutYearWithTime,
    short: formatShort,
    shortWithTime: formatShortWithTime,
    medium: formatMedium,
    mediumWithTime: formatMediumWithTime,
    long: formatLong,
    longWithoutTime: formatLongWithoutTime,
    time: formatTime,
    time24: formatTime24,
    relative: formatRelative,
    relativeWithTime: formatRelativeWithTime,
    chat: formatChat,
    notification: formatNotification,
    iso: formatISO,
    sql: formatSQL,
  };

  return formatters[format](date);
}