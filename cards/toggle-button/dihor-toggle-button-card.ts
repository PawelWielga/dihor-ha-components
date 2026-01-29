import { html, css, unsafeCSS } from "lit";
import { BaseDihorCard } from "../base";
import cardCssStr from "./dihor-toggle-button-card.css";

export interface ToggleButtonCardConfig {
  entity: string;
  label?: string;
  icon?: string;
  active_color?: string;
  inactive_color?: string;
}

export class ToggleButtonCard extends BaseDihorCard<ToggleButtonCardConfig> {

  static get styles() {
    return [
      super.styles,
      css`${unsafeCSS(cardCssStr)}`,
      // Dynamic styles need to be handled differently in Lit or via style map,
      // but for now we can inline them in render or use a host style.
      // Or we can simple keep them in render properties.
    ];
  }

  private async toggleEntity() {
    if (!this._config?.entity) return;
    try {
      await this.hass.callService("homeassistant", "toggle", {
        entity_id: this._config.entity,
      });
    } catch (error) {
      console.error("Failed to toggle entity:", error);
    }
  }

  protected renderCard() {
    if (!this.hass || !this._config) return html``;
    const entityId = this._config.entity;
    const stateObj = this.hass.states[entityId];

    const label = this._config.label ||
      stateObj?.attributes?.friendly_name ||
      entityId.replace(/^.*\./, "");

    const stateText = stateObj?.state ? stateObj.state.toUpperCase() : "UNKNOWN";

    const icon = this._config.icon ||
      (stateObj?.attributes?.icon as string | undefined) ||
      "mdi:toggle-switch";

    const isOn = stateObj?.state === "on";
    const buttonText = isOn ? "Turn off" : "Turn on";

    // Dynamic styles
    const activeColor = this._config.active_color;
    const inactiveColor = this._config.inactive_color;

    let btnStyle = "";
    if (isOn && activeColor) {
      btnStyle = `background:${activeColor};color:#0f172a;`;
    } else if (!isOn && inactiveColor) {
      btnStyle = `background:${inactiveColor};`;
    }

    return html`
      <ha-card class="toggle-card">
         <div class="toggle-content">
             <div class="toggle-icon-container">
                 <ha-icon icon="${icon}" class="toggle-icon"></ha-icon>
             </div>
             <div class="toggle-info">
                 <div class="toggle-label">${label}</div>
                 <div class="toggle-state">${stateText}</div>
             </div>
             <div class="toggle-control">
                 <button
                    class="toggle-action ${isOn ? 'active' : ''}"
                    style="${btnStyle}"
                    @click=${this.toggleEntity}>
                    ${buttonText}
                 </button>
             </div>
         </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 2;
  }
}

if (!customElements.get("dihor-toggle-button-card")) {
  customElements.define("dihor-toggle-button-card", ToggleButtonCard);
}

// Register for Lovelace editor preview and HACS UI
; (window as any).customCards = (window as any).customCards || [];
; (window as any).customCards.push({
  type: "dihor-toggle-button-card",
  name: "Dihor Toggle Button Card",
  preview: true,
  description: "A friendly toggle button that targets a single entity via the provided icon and label."
});
