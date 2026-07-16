import { CONTENT_OPTIONS } from "../config/catalog";
import { LAYOUT_DEFINITIONS } from "../layouts/layoutDefinitions";
import type { TileSize } from "../types/content";
import type { DashboardSettings } from "../types/settings";

export function validateSettings(value: unknown): { ok: true; settings: DashboardSettings } | { ok: false; reason: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { ok: false, reason: "Die Datei enthält keine gültige Konfiguration." };
  }

  const maybe = value as Partial<DashboardSettings>;
  if (maybe.version !== 1) {
    return { ok: false, reason: "Diese Konfigurationsversion wird nicht unterstützt." };
  }

  if (!maybe.layout || !LAYOUT_DEFINITIONS[maybe.layout]) {
    return { ok: false, reason: "Das gespeicherte Layout ist unbekannt." };
  }

  if (!Array.isArray(maybe.tiles)) {
    return { ok: false, reason: "Die Kachelbelegung fehlt oder ist ungültig." };
  }

  const validContent = new Set(CONTENT_OPTIONS.map((option) => option.type));
  const invalidTile = maybe.tiles.find((tile) => !validContent.has(tile.contentType));
  if (invalidTile) {
    return { ok: false, reason: "Mindestens eine Kachel verwendet einen unbekannten Inhalt." };
  }

  return { ok: true, settings: maybe as DashboardSettings };
}

export function isTileContentAllowed(size: string, contentType: string): boolean {
  const option = CONTENT_OPTIONS.find((item) => item.type === contentType);
  return Boolean(option?.allowedSizes.includes(size as TileSize));
}
