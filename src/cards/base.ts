import themeCss from "./theme.css";
import type { HomeAssistant } from "../../types/home-assistant";

export abstract class BaseDihorCard<ConfigType> extends HTMLElement {
  protected _hass!: HomeAssistant;
  protected _config!: ConfigType;
  private _contentCreated = false;

  setConfig(config: ConfigType) {
    this._config = config;
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._contentCreated) {
      this.innerHTML = `
        <style>${themeCss}</style>
        ${this.additionalCss()}
        <ha-card>
          ${this.cardHtml()}
          ${this.cardCss() ? `<style>${this.cardCss()}</style>` : ""}
        </ha-card>
      `;
      this._contentCreated = true;
      this.onCardCreated();
    }
    this.applyTheme();
    this.update(hass);
  }

  private applyTheme() {
    const haCard = this.querySelector("ha-card");
    const haElement = document.querySelector("home-assistant") as
      | { hass?: HomeAssistant }
      | null;
    const dark = haElement?.hass?.themes?.darkMode;
    if (haCard) {
      haCard.classList.toggle("dihor-theme-dark", !!dark);
      haCard.classList.toggle("dihor-theme-light", !dark);
    }
  }

  protected additionalCss(): string {
    return "";
  }

  protected abstract cardHtml(): string;
  protected cardCss(): string {
    return "";
  }

  protected onCardCreated(): void {}

  protected update(_hass: HomeAssistant): void {}
}
