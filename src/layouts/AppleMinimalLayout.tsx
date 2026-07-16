import type { ReactNode } from "react";
import type { DashboardTile } from "../types/dashboard";
import { LayoutCanvas } from "./LayoutCanvas";

export function AppleMinimalLayout({ tiles, renderTile }: { tiles: DashboardTile[]; renderTile: (tile: DashboardTile) => ReactNode }) {
  return <LayoutCanvas layout="apple-minimal" tiles={tiles} renderTile={renderTile} />;
}
