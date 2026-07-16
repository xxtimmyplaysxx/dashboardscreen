import type { ReactNode } from "react";
import type { DashboardTile } from "../types/dashboard";
import { LayoutCanvas } from "./LayoutCanvas";

export function FocusLayout({ tiles, renderTile }: { tiles: DashboardTile[]; renderTile: (tile: DashboardTile) => ReactNode }) {
  return <LayoutCanvas layout="focus" tiles={tiles} renderTile={renderTile} />;
}
