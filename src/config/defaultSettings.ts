import type { ContentType } from "../types/content";
import type { DashboardSettings, WorkingHours } from "../types/settings";
import { LAYOUT_DEFINITIONS } from "../layouts/layoutDefinitions";

export const CONFIG_VERSION = 3;

export const DEFAULT_ACTIVE_CONTENT: ContentType[] = [
  "clock",
  "clockDate",
  "greeting",
  "weather",
  "weatherForecast",
  "newsSwiss",
  "newsInternational",
  "newsTech",
  "newsBusiness",
  "newsSport",
  "natureImage",
  "carImage",
  "spaceImage",
  "quote",
  "fact",
  "finance",
  "crypto"
];

export const DEFAULT_VIEW_ORDER: ContentType[] = [
  "natureImage",
  "newsSwiss",
  "weather",
  "clockDate",
  "crypto",
  "spaceImage",
  "newsTech",
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

const defaultFullscreenTiles = LAYOUT_DEFINITIONS["fullscreen-rotation"].slots.map((slot) => ({
  id: slot.id,
  label: slot.label,
  size: slot.size,
  contentTypes: DEFAULT_VIEW_ORDER,
  contentType: DEFAULT_VIEW_ORDER[0],
  settings: {}
}));

export const DEFAULT_SETTINGS: DashboardSettings = {
  version: CONFIG_VERSION,
  setupComplete: false,
  userName: "",
  location: "Hedingen",
  layout: "fullscreen-rotation",
  tiles: defaultFullscreenTiles,
  activeContent: DEFAULT_ACTIVE_CONTENT,
  viewOrder: DEFAULT_VIEW_ORDER,
  rotationSeconds: 15,
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
