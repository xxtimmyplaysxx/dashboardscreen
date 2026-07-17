import { CONTENT_OPTIONS } from "../config/catalog";
import { CONFIG_VERSION } from "../config/defaultSettings";
import { LAYOUT_DEFINITIONS } from "../layouts/layoutDefinitions";
import type { TileSize } from "../types/content";
import type { DashboardSettings } from "../types/settings";

export function validateSettings(value: unknown): { ok: true; settings: DashboardSettings } | { ok: false; reason: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { ok: false, reason: "Die Datei enthält keine gültige Konfiguration." };
  }

  const maybe = value as Partial<DashboardSettings>;
  if (typeof maybe.version !== "number" || maybe.version < 1 || maybe.version > CONFIG_VERSION) {
    return { ok: false, reason: "Diese Konfigurationsversion wird nicht unterstützt." };
  }

  if (!maybe.layout || !LAYOUT_DEFINITIONS[maybe.layout]) {
    return { ok: false, reason: "Das gespeicherte Layout ist unbekannt." };
  }

  if (!Array.isArray(maybe.tiles)) {
    return { ok: false, reason: "Die Kachelbelegung fehlt oder ist ungültig." };
  }

  const validContent = new Set(CONTENT_OPTIONS.map((option) => option.type));
  const invalidTile = maybe.tiles.find((tile) => {
    const legacyContent = tile.contentType ? [tile.contentType] : [];
    const contentTypes = Array.isArray(tile.contentTypes) && tile.contentTypes.length ? tile.contentTypes : legacyContent;
    return contentTypes.length === 0 || contentTypes.some((contentType) => !validContent.has(contentType));
  });
  if (invalidTile) {
    return { ok: false, reason: "Mindestens eine Kachel verwendet einen unbekannten Inhalt." };
  }

  return { ok: true, settings: maybe as DashboardSettings };
}

export function isTileContentAllowed(size: string, contentType: string): boolean {
  const option = CONTENT_OPTIONS.find((item) => item.type === contentType);
  return Boolean(option?.allowedSizes.includes(size as TileSize));
}
