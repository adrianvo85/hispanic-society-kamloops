import type { Lang } from "./paths";

export function asDate(value: Date | string): Date {
  // YAML dates like 2026-11-28 are parsed by Astro/Zod as UTC midnight.
  // In America/Vancouver that is still the previous calendar day, so a
  // date-only UTC midnight is treated as that calendar date at noon local.
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    if (
      value.getUTCHours() === 0 &&
      value.getUTCMinutes() === 0 &&
      value.getUTCSeconds() === 0 &&
      value.getUTCMilliseconds() === 0
    ) {
      return new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 12, 0, 0);
    }
    return value;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
  return new Date(value);
}

export function isoDay(value: Date | string): string {
  const d = asDate(value);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

export function formatDate(value: Date | string, lang: Lang, opts: Intl.DateTimeFormatOptions = {}): string {
  const d = asDate(value);
  return new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-CA", {
    timeZone: "America/Vancouver",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  }).format(d);
}

export function formatTime(time: string, lang: Lang): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2026, 0, 1, h, m || 0);
  return new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-CA", {
    hour: "numeric",
    minute: m ? "2-digit" : undefined,
  }).format(d);
}

/** End of the event day in Vancouver, used to split upcoming vs past at build time. */
export function isUpcoming(value: Date | string, endTime?: string): boolean {
  const d = asDate(value);
  const end = new Date(d);
  if (endTime && /^\d{1,2}:\d{2}$/.test(endTime)) {
    const [h, m] = endTime.split(":").map(Number);
    end.setHours(h, m, 0, 0);
  } else {
    end.setHours(23, 59, 59, 999);
  }
  return end.getTime() >= Date.now();
}

export function googleCalendarUrl(opts: {
  title: string;
  date: Date | string;
  startTime?: string;
  endTime?: string;
  details?: string;
  location?: string;
}): string {
  const day = isoDay(opts.date).replace(/-/g, "");
  const start = opts.startTime ? opts.startTime.replace(":", "") : "090000";
  const end = opts.endTime ? opts.endTime.replace(":", "") : (opts.startTime ? addHour(opts.startTime) : "100000");
  const dates = `${day}T${start.padEnd(6, "0")}/${day}T${end.padEnd(6, "0")}`;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates,
    details: opts.details || "",
    location: opts.location || "",
    ctz: "America/Vancouver",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function addHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}${String(m || 0).padStart(2, "0")}00`;
}

export function icsContent(opts: {
  title: string;
  date: Date | string;
  startTime?: string;
  endTime?: string;
  details?: string;
  location?: string;
  url?: string;
}): string {
  const day = isoDay(opts.date).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = opts.startTime
    ? `${day}T${opts.startTime.replace(":", "")}00`
    : `${day}`;
  const end = opts.endTime
    ? `${day}T${opts.endTime.replace(":", "")}00`
    : opts.startTime
      ? `${day}T${addHour(opts.startTime)}`
      : `${day}`;
  const dtStart = opts.startTime ? `DTSTART;TZID=America/Vancouver:${start}` : `DTSTART;VALUE=DATE:${day}`;
  const dtEnd = opts.startTime ? `DTEND;TZID=America/Vancouver:${end}` : `DTEND;VALUE=DATE:${day}`;
  const esc = (s: string) => s.replace(/[,;\\]/g, "\\$&").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hispanic Society of Kamloops//Event//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${day}-${esc(opts.title).slice(0, 24)}@hispanicsocietykamloops`,
    `DTSTAMP:${stamp}`,
    dtStart,
    dtEnd,
    `SUMMARY:${esc(opts.title)}`,
    opts.details ? `DESCRIPTION:${esc(opts.details)}` : "",
    opts.location ? `LOCATION:${esc(opts.location)}` : "",
    opts.url ? `URL:${opts.url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
