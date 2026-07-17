import { CONTENT_OPTIONS } from "../../config/catalog";
import { layoutOptions } from "../../layouts/layoutDefinitions";
import type { ContentType } from "../../types/content";
import type { LayoutTemplate } from "../../types/dashboard";
import type { DashboardSettings } from "../../types/settings";
import { createTilesForLayout } from "../../utils/migration";
import { isTileContentAllowed } from "../../utils/validation";

interface TileConfiguratorProps {
  settings: DashboardSettings;
  onChange: (settings: DashboardSettings) => void;
  showLayoutPicker?: boolean;
}

export function TileConfigurator({ settings, onChange, showLayoutPicker = true }: TileConfiguratorProps) {
  const updateLayout = (layout: LayoutTemplate) => {
    onChange({
      ...settings,
      layout,
      tiles: createTilesForLayout(layout, settings)
    });
  };

  const toggleTileContent = (tileId: string, contentType: ContentType) => {
    onChange({
      ...settings,
      tiles: settings.tiles.map((tile) => {
        if (tile.id !== tileId) return tile;
        const current = tile.contentTypes?.length ? tile.contentTypes : [tile.contentType];
        const next = current.includes(contentType)
          ? current.filter((type) => type !== contentType)
          : [...current, contentType];
        const contentTypes = next.length ? next : current;
        return { ...tile, contentTypes, contentType: contentTypes[0] };
      })
    });
  };

  return (
    <div className="tile-configurator">
      {showLayoutPicker && (
        <div className="layout-choice-grid" role="list">
          {layoutOptions.map((layout) => (
            <button
              className={`choice-card ${settings.layout === layout.id ? "selected" : ""}`}
              type="button"
              key={layout.id}
              onClick={() => updateLayout(layout.id)}
            >
              <span>{layout.name}</span>
              <small>{layout.description}</small>
            </button>
          ))}
        </div>
      )}

      <div className={`layout-preview preview-${settings.layout}`} aria-label="Kachelbelegung">
        {settings.tiles.map((tile) => (
          <div className={`preview-slot preview-${tile.size}`} key={tile.id}>
            <div className="tile-config-label">
              <span>{tile.label}</span>
              <small>{(tile.contentTypes?.length ?? 1)} aktiv</small>
            </div>
            <div className="tile-content-chips">
              {CONTENT_OPTIONS.filter((option) => isTileContentAllowed(tile.size, option.type)).map((option) => (
                <button
                  type="button"
                  className={(tile.contentTypes?.length ? tile.contentTypes : [tile.contentType]).includes(option.type) ? "mini-chip active" : "mini-chip"}
                  key={option.type}
                  onClick={() => toggleTileContent(tile.id, option.type)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
