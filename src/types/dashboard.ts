import type { ContentType, TileSize } from "./content";

export type LayoutTemplate =
  | "apple-minimal"
  | "balanced-grid"
  | "focus"
  | "information"
  | "fullscreen-rotation"
  | "hybrid";

export interface DashboardTile {
  id: string;
  label: string;
  contentTypes: ContentType[];
  contentType: ContentType;
  size: TileSize;
  settings: Record<string, unknown>;
}

export interface LayoutSlot {
  id: string;
  label: string;
  size: TileSize;
  className: string;
  allowedContent?: ContentType[];
}

export interface LayoutDefinition {
  id: LayoutTemplate;
  name: string;
  description: string;
  slots: LayoutSlot[];
}
