import type { ContentType } from "../../types/content";
import type { DashboardTile } from "../../types/dashboard";
import type { DashboardSettings } from "../../types/settings";
import { AppleMinimalLayout } from "../../layouts/AppleMinimalLayout";
import { BalancedGridLayout } from "../../layouts/BalancedGridLayout";
import { FocusLayout } from "../../layouts/FocusLayout";
import { FullscreenRotationLayout } from "../../layouts/FullscreenRotationLayout";
import { HybridLayout } from "../../layouts/HybridLayout";
import { InformationLayout } from "../../layouts/InformationLayout";
import type { ContentResources } from "../../types/content";
import { TileRenderer } from "./TileRenderer";

interface LayoutRouterProps {
  settings: DashboardSettings;
  data: ContentResources;
  rotationIndex: number;
}

function fullscreenTile(contentType: ContentType): DashboardTile {
  return {
    id: "fullscreen",
    label: "Vollbild",
    size: "fullscreen",
    contentTypes: [contentType],
    contentType,
    settings: {}
  };
}

export function LayoutRouter({ settings, data, rotationIndex }: LayoutRouterProps) {
  const renderTile = (tile: DashboardTile) => (
    <TileRenderer tile={tile} data={data} settings={settings} rotationIndex={rotationIndex} />
  );

  if (settings.layout === "fullscreen-rotation") {
    const type = settings.viewOrder[rotationIndex % settings.viewOrder.length] ?? "clockDate";
    return <FullscreenRotationLayout tiles={[fullscreenTile(type)]} renderTile={renderTile} />;
  }

  if (settings.layout === "hybrid" && rotationIndex % 2 === 1) {
    const type = settings.viewOrder[Math.floor(rotationIndex / 2) % settings.viewOrder.length] ?? "natureImage";
    return <FullscreenRotationLayout tiles={[fullscreenTile(type)]} renderTile={renderTile} />;
  }

  switch (settings.layout) {
    case "apple-minimal":
      return <AppleMinimalLayout tiles={settings.tiles} renderTile={renderTile} />;
    case "balanced-grid":
      return <BalancedGridLayout tiles={settings.tiles} renderTile={renderTile} />;
    case "focus":
      return <FocusLayout tiles={settings.tiles} renderTile={renderTile} />;
    case "information":
      return <InformationLayout tiles={settings.tiles} renderTile={renderTile} />;
    case "hybrid":
      return <HybridLayout tiles={settings.tiles} renderTile={renderTile} />;
    default:
      return <BalancedGridLayout tiles={settings.tiles} renderTile={renderTile} />;
  }
}
