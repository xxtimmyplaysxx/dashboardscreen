import type { ContentType } from "./content";
import type { DashboardTile, LayoutTemplate } from "./dashboard";

export interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

export type WorkingHours = Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", DaySchedule>;

export interface DashboardSettings {
  version: number;
  setupComplete: boolean;
  userName: string;
  location: string;
  layout: LayoutTemplate;
  tiles: DashboardTile[];
  activeContent: ContentType[];
  viewOrder: ContentType[];
  rotationSeconds: 10 | 15 | 20 | 25 | 30;
  newsSources: string[];
  newsCategories: string[];
  imageCategories: string[];
  workingHours: WorkingHours;
  design: {
    accentColor: string;
    mode: "light";
    background: "clean" | "soft" | "image";
    cardStyle: "soft" | "flat";
  };
  cache: {
    lastUpdatedAt?: string;
    lastActiveView?: number;
  };
}
