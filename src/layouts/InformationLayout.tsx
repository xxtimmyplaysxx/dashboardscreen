import type { ReactNode } from "react";
import type { DashboardTile } from "../types/dashboard";
import { LayoutCanvas } from "./LayoutCanvas";

export function InformationLayout({ tiles, renderTile }: { tiles: DashboardTile[]; renderTile: (tile: DashboardTile) => ReactNode }) {
  return <LayoutCanvas layout="information" tiles={tiles} renderTile={renderTile} />;
}
