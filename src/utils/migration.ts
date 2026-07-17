import { DEFAULT_SETTINGS, CONFIG_VERSION } from "../config/defaultSettings";
import { LAYOUT_DEFINITIONS } from "../layouts/layoutDefinitions";
import type { ContentType } from "../types/content";
import type { DashboardSettings } from "../types/settings";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeTiles(settings: DashboardSettings): DashboardSettings {
  const definition = LAYOUT_DEFINITIONS[settings.layout] ?? LAYOUT_DEFINITIONS.hybrid;
  const existing = new Map(settings.tiles.map((tile) => [tile.id, tile]));
  const fallbackContent: ContentType[][] = [
    ["natureImage", "newsSwiss", "carImage"],
    ["clockDate", "greeting"],
    ["weather", "weatherForecast"],
    ["crypto", "finance"],
    ["quote", "fact"],
    ["newsTech", "newsBusiness"]
  ];

  return {
    ...settings,
    layout: definition.id,
    tiles: definition.slots.map((slot, index) => {
      const oldTile = existing.get(slot.id);
      const oldContentTypes: ContentType[] = Array.isArray(oldTile?.contentTypes) && oldTile.contentTypes.length
        ? oldTile.contentTypes
        : oldTile?.contentType
          ? [oldTile.contentType]
          : fallbackContent[index] ?? ["clock"];
      const contentTypes: ContentType[] = oldContentTypes.length ? oldContentTypes : ["clock"];
      return {
        id: slot.id,
        label: slot.label,
        size: slot.size,
        contentTypes,
        contentType: contentTypes[0],
        settings: oldTile?.settings ?? {}
      };
    })
  };
}

export function migrateSettings(input: unknown): DashboardSettings {
  if (!isObject(input)) {
    return DEFAULT_SETTINGS;
  }

  const partial = input as Partial<DashboardSettings>;
  const sourceVersion = typeof partial.version === "number" ? partial.version : 0;
  const shouldApplyProfessionalPreset =
    sourceVersion < 2 ||
    !Array.isArray(partial.tiles) ||
    partial.tiles.every((tile) => !Array.isArray(tile.contentTypes) || tile.contentTypes.length <= 1);

  const migrated: DashboardSettings = {
    ...DEFAULT_SETTINGS,
    ...partial,
    version: CONFIG_VERSION,
    design: {
      ...DEFAULT_SETTINGS.design,
      ...(isObject(partial.design) ? partial.design : {})
    },
    workingHours: {
      ...DEFAULT_SETTINGS.workingHours,
      ...(isObject(partial.workingHours) ? partial.workingHours : {})
    },
    cache: {
      ...DEFAULT_SETTINGS.cache,
      ...(isObject(partial.cache) ? partial.cache : {})
    }
  };

  if (!LAYOUT_DEFINITIONS[migrated.layout]) {
    migrated.layout = DEFAULT_SETTINGS.layout;
  }

  if (shouldApplyProfessionalPreset) {
    return {
      ...normalizeTiles({
        ...migrated,
        layout: DEFAULT_SETTINGS.layout,
        tiles: DEFAULT_SETTINGS.tiles
      }),
      setupComplete: migrated.setupComplete,
      userName: migrated.userName,
      location: migrated.location,
      activeContent: migrated.activeContent,
      viewOrder: migrated.viewOrder,
      rotationSeconds: migrated.rotationSeconds,
      newsSources: migrated.newsSources,
      newsCategories: migrated.newsCategories,
      imageCategories: migrated.imageCategories,
      workingHours: migrated.workingHours,
      design: migrated.design,
      cache: migrated.cache
    };
  }

  return normalizeTiles(migrated);
}

export function createTilesForLayout(layout: DashboardSettings["layout"], previous: DashboardSettings): DashboardSettings["tiles"] {
  return normalizeTiles({ ...previous, layout }).tiles;
}
