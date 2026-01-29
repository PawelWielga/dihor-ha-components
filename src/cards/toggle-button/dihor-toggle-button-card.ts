import html from "./dihor-toggle-button-card.html";
import css from "./dihor-toggle-button-card.css";
import { BaseDihorCard } from "../base";
import type { HomeAssistant } from "../../../types/home-assistant";

export interface ToggleButtonCardConfig {
  entity: string;
  label?: string;
  icon?: string;
  active_color?: string;
  inactive_color?: string;
}

export class ToggleButtonCard extends BaseDihorCard<ToggleButtonCardConfig> {
  private _button?: HTMLButtonElement;

  protected additionalCss() {
    const { active_color, inactive_color } = this._config || {};
    let style = "";
    if (active_color) {
      style += `.toggle-action.active{background:${active_color};color:#0f172a;}`;
    }
    if (inactive_color) {
      style += `.toggle-action:not(.active){background:${inactive_color};}`;
    }
    return style;
  }

  protected cardHtml() {
    return html;
  }

  protected cardCss() {
    return css;
  }

  protected onCardCreated() {
    const button = this.querySelector<HTMLButtonElement>(".toggle-action");
    this._button = button || undefined;
    if (button) {
      button.addEventListener("click", () => {
        this.toggleEntity();
      });
    }
  }

  protected update(hass: HomeAssistant) {
    const entityId = this._config?.entity;
    if (!entityId) return;
    const stateObj = hass.states[entityId];
    const labelEl = this.querySelector<HTMLElement>(".toggle-label");
    const stateEl = this.querySelector<HTMLElement>(".toggle-state");
    const iconEl = this.querySelector<HTMLElement>("ha-icon");
    if (labelEl) {
      labelEl.textContent =
        this._config.label ||
        stateObj?.attributes?.friendly_name ||
        entityId.replace(/^.*\./, "");
    }
    if (stateEl) {
      stateEl.textContent = stateObj?.state ? stateObj.state.toUpperCase() : "UNKNOWN";
    }
    if (iconEl) {
      const icon =
        this._config.icon ||
        (stateObj?.attributes?.icon as string | undefined) ||
        "mdi:toggle-switch";
      iconEl.setAttribute("icon", icon);
    }
    if (this._button) {
      const isOn = stateObj?.state === "on";
      this._button.textContent = isOn ? "Turn off" : "Turn on";
      this._button.classList.toggle("active", isOn);
      this._button.disabled = false;
    }
  }

  private async toggleEntity() {
    if (!this._config?.entity) return;
    const action = "homeassistant.toggle";
    try {
      await this._hass.callService("homeassistant", "toggle", {
        entity_id: this._config.entity,
      });
    } catch (error) {
      console.error("Failed to toggle entity:", error);
      if (this._button) {
        this._button.classList.remove("active");
      }
    }
  }

  getCardSize() {
    return 2;
  }
}

if (!customElements.get("dihor-toggle-button-card")) {
  customElements.define("dihor-toggle-button-card", ToggleButtonCard);
}

;(window as any).customCards = (window as any).customCards || [];
;(window as any).customCards.push({
  type: "dihor-toggle-button-card",
  name: "Dihor Toggle Button Card",
  preview: true,
  description: "A friendly toggle button that targets a single entity via the provided icon and label."
});
