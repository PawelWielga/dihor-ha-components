import { LitElement, html, CSSResultGroup, css, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import themeCss from './styles/theme.css';
import coreCss from './styles/core.css';
import type { HomeAssistant, LovelaceCard, LovelaceGridOptions } from '../../types/home-assistant';

export interface BaseCardConfig {
  [key: string]: unknown;
}

export abstract class BaseDihorCard<ConfigType extends BaseCardConfig> extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() protected _config!: ConfigType;

  public setConfig(config: ConfigType): void {
    this._config = config;
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
}
