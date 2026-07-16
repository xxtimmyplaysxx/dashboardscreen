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

  const updateTile = (tileId: string, contentType: ContentType) => {
    onChange({
      ...settings,
      tiles: settings.tiles.map((tile) => (tile.id === tileId ? { ...tile, contentType } : tile))
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
            <label htmlFor={`tile-${tile.id}`}>{tile.label}</label>
            <select
              id={`tile-${tile.id}`}
              value={tile.contentType}
              onChange={(event) => updateTile(tile.id, event.target.value as ContentType)}
            >
              {CONTENT_OPTIONS.filter((option) => isTileContentAllowed(tile.size, option.type)).map((option) => (
                <option value={option.type} key={option.type}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
