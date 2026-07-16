import { DEFAULT_SETTINGS } from "../config/defaultSettings";
import { migrateSettings } from "../utils/migration";
import { validateSettings } from "../utils/validation";
import type { DashboardSettings } from "../types/settings";

const SETTINGS_KEY = "signakom.dashboard.settings.v1";
const DRAFT_KEY = "signakom.dashboard.onboarding.draft.v1";
const CACHE_PREFIX = "signakom.dashboard.cache.";

function safeParse(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function loadSettings(): DashboardSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  return migrateSettings(safeParse(window.localStorage.getItem(SETTINGS_KEY)));
}

export function saveSettings(settings: DashboardSettings): void {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearSettings(): void {
  window.localStorage.removeItem(SETTINGS_KEY);
  window.localStorage.removeItem(DRAFT_KEY);
}

export function loadOnboardingDraft(): Partial<DashboardSettings> | null {
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(DRAFT_KEY)) as Partial<DashboardSettings> | null;
}

export function saveOnboardingDraft(draft: Partial<DashboardSettings>): void {
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearOnboardingDraft(): void {
  window.localStorage.removeItem(DRAFT_KEY);
}

export function exportSettings(settings: DashboardSettings): void {
  const safeName = settings.userName.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") || "dashboard";
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dashboard-config-${safeName}-${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importSettingsFile(file: File): Promise<DashboardSettings> {
  const parsed = JSON.parse(await file.text()) as unknown;
  const result = validateSettings(parsed);
  if (!result.ok) {
    throw new Error(result.reason);
  }
  return migrateSettings(result.settings);
}

export function loadCache<T>(key: string): { data: T; timestamp: number } | null {
  const parsed = safeParse(window.localStorage.getItem(`${CACHE_PREFIX}${key}`));
  if (
    parsed &&
    typeof parsed === "object" &&
    "data" in parsed &&
    "timestamp" in parsed &&
    typeof (parsed as { timestamp: unknown }).timestamp === "number"
  ) {
    return parsed as { data: T; timestamp: number };
  }
  return null;
}

export function saveCache<T>(key: string, data: T): void {
  window.localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ data, timestamp: Date.now() }));
}
