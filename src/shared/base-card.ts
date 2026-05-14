import { LitElement, html, CSSResultGroup, css, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import themeCss from './styles/theme.css';
import coreCss from './styles/core.css';
import type { HomeAssistant, LovelaceCard, LovelaceGridOptions } from '../../types/home-assistant';

export type DihorDensity = 's' | 'm' | 'l';

export interface BaseCardConfig {
  density?: DihorDensity;
  [key: string]: unknown;
}

export const DIHOR_DENSITY_SCHEMA = {
  name: 'density',
  selector: {
    select: {
      mode: 'dropdown',
      options: [
        { value: 's', label: 'S - Compact' },
        { value: 'm', label: 'M - Balanced' },
        { value: 'l', label: 'L - Spacious' },
      ],
    },
  },
};

export function getDihorDensityLabel(schema: { name?: string }): string | undefined {
  if (schema.name === 'density') return 'Density';
  return undefined;
}

export function getDihorDensityHelper(schema: { name?: string }): string | undefined {
  if (schema.name === 'density') {
    return 'Controls spacing, glass light, blur and component scale.';
  }
  return undefined;
}

export abstract class BaseDihorCard<ConfigType extends BaseCardConfig> extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() protected _config!: ConfigType;

  public setConfig(config: ConfigType): void {
    const density = BaseDihorCard.normalizeDensity(config.density);
    this._config = {
      ...config,
      density,
    };
    this.dataset.density = density;
    this.requestUpdate();
  }

  // Legacy property for LovelaceCard interface compatibility
  public get card(): HTMLElement {
    return this;
  }

  // Lit element styles
  static get styles(): CSSResultGroup {
    return css`
      ${unsafeCSS(themeCss)}
      ${unsafeCSS(coreCss)}
    `;
  }

  // Helper to allow cards to add their own styles easily
  protected get styles(): CSSResultGroup {
    return [];
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }
    return this.renderCard();
  }

  protected abstract renderCard(): unknown;

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      rows: 2,
      columns: 6,
      min_rows: 1,
      min_columns: 3,
    };
  }

  private static normalizeDensity(density: unknown): DihorDensity {
    if (density === 's' || density === 'm' || density === 'l') {
      return density;
    }
    return 'm';
  }
}
