import type { WorkingHours } from "../types/settings";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-CH", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 2) return "gerade eben";
  if (diffMinutes < 60) return `vor ${diffMinutes} Min.`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  return new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" }).format(date);
}

export function greetingFor(date: Date, name: string): string {
  const hour = date.getHours();
  const suffix = name.trim() ? `, ${name.trim()}` : "";
  if (hour < 11) return `Guten Morgen${suffix}`;
  if (hour < 18) return `Guten Tag${suffix}`;
  return `Guten Abend${suffix}`;
}

export function isWithinWorkingHours(hours: WorkingHours, date = new Date()): boolean {
  const key = dayKeys[date.getDay()];
  const schedule = hours[key];
  if (!schedule?.enabled) return false;

  const [startHour, startMinute] = schedule.start.split(":").map(Number);
  const [endHour, endMinute] = schedule.end.split(":").map(Number);
  const current = date.getHours() * 60 + date.getMinutes();
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  return start <= end ? current >= start && current <= end : current >= start || current <= end;
}
