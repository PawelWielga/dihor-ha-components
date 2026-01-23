import html from "./dihor-toggle-card.html";
import css from "./dihor-toggle-card.css";
import { BaseDihorCard } from "../base";
import type { HomeAssistant } from "../../../types/home-assistant";

export interface ToggleCardConfig {
  entity: string;
  name?: string;
}

export class ToggleCard extends BaseDihorCard<ToggleCardConfig> {
  setConfig(config: ToggleCardConfig) {
    if (!config.entity) {
      throw new Error("Entity is required");
    }
    super.setConfig(config);
  }

  protected cardHtml() {
    return html;
  }

  protected cardCss() {
    return css;
  }

  protected onCardCreated() {
    const button = this.querySelector<HTMLButtonElement>("#toggle-button");
    button?.addEventListener("click", () => this.toggleEntity());
  }

  protected update(hass: HomeAssistant) {
    const state = hass.states[this._config.entity];
    if (!state) {
      return;
    }

    const label = this._config.name || state.attributes.friendly_name || this._config.entity;
    const isOn = state.state === "on";

    const button = this.querySelector<HTMLButtonElement>("#toggle-button");
    const labelEl = this.querySelector<HTMLElement>("#toggle-label");
    const stateEl = this.querySelector<HTMLElement>("#toggle-state");

    if (button) {
      button.classList.toggle("is-on", isOn);
      button.setAttribute("aria-pressed", String(isOn));
    }
    if (labelEl) {
      labelEl.textContent = label;
    }
    if (stateEl) {
      stateEl.textContent = isOn ? "On" : "Off";
    }
  }

  private toggleEntity() {
    const entity = this._config.entity;
    if (!entity) {
      return;
    }
    const domain = entity.split(".")[0];
    const hassAny = this._hass as HomeAssistant & { callService?: Function };
    hassAny.callService?.(domain, "toggle", { entity_id: entity });
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get("dihor-toggle-card")) {
  customElements.define("dihor-toggle-card", ToggleCard);
}

// Register for Lovelace editor preview and HACS UI
;(window as any).customCards = (window as any).customCards || [];
;(window as any).customCards.push({
  type: "dihor-toggle-card",
  name: "Dihor Toggle Card",
  preview: true,
  description: "Glassmorphism toggle button for Home Assistant entities",
});
