import type { ContentType } from "../types/content";
import type { DashboardSettings, WorkingHours } from "../types/settings";
import { LAYOUT_DEFINITIONS } from "../layouts/layoutDefinitions";

export const CONFIG_VERSION = 1;

export const DEFAULT_ACTIVE_CONTENT: ContentType[] = [
  "clock",
  "clockDate",
  "greeting",
  "weather",
  "newsSwiss",
  "newsTech",
  "natureImage",
  "carImage",
  "spaceImage",
  "quote",
  "finance",
  "crypto"
];

export const DEFAULT_VIEW_ORDER: ContentType[] = [
  "natureImage",
  "clockDate",
  "weather",
  "newsSwiss",
  "spaceImage",
  "quote",
  "carImage"
];

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  mon: { enabled: true, start: "07:00", end: "18:00" },
  tue: { enabled: true, start: "07:00", end: "18:00" },
  wed: { enabled: true, start: "07:00", end: "18:00" },
  thu: { enabled: true, start: "07:00", end: "18:00" },
  fri: { enabled: true, start: "07:00", end: "18:00" },
  sat: { enabled: false, start: "09:00", end: "14:00" },
  sun: { enabled: false, start: "09:00", end: "14:00" }
};

const defaultHybridTiles = LAYOUT_DEFINITIONS.hybrid.slots.map((slot, index) => ({
  id: slot.id,
  label: slot.label,
  size: slot.size,
  contentType: (["natureImage", "clockDate", "weather", "newsSwiss"] as ContentType[])[index] ?? "clock",
  settings: {}
}));

export const DEFAULT_SETTINGS: DashboardSettings = {
  version: CONFIG_VERSION,
  setupComplete: false,
  userName: "",
  location: "Hedingen",
  layout: "hybrid",
  tiles: defaultHybridTiles,
  activeContent: DEFAULT_ACTIVE_CONTENT,
  viewOrder: DEFAULT_VIEW_ORDER,
  rotationSeconds: 20,
  newsSources: ["srf", "20min", "heise"],
  newsCategories: ["swiss", "tech", "sport"],
  imageCategories: ["Natur", "Berge", "Seen", "Sportwagen", "Weltraum"],
  workingHours: DEFAULT_WORKING_HOURS,
  design: {
    accentColor: "#0071e3",
    mode: "light",
    background: "clean",
    cardStyle: "soft"
  },
  cache: {}
};
