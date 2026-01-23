import themeCss from "./theme.css";
import coreCss from "./core.css";
import type { HomeAssistant, LovelaceCard } from "../../types/home-assistant";

export abstract class BaseDihorCard<ConfigType> extends HTMLElement implements LovelaceCard {
  protected _hass!: HomeAssistant;
  protected _config!: ConfigType;
  private _contentCreated = false;
  protected _card?: HTMLElement;

  public setConfig(config: ConfigType): void {
    this._config = config;
  }

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._contentCreated) {
      this.innerHTML = `
        <style>${themeCss}${coreCss}</style>
        ${this.additionalCss()}
        <ha-card>
          ${this.cardHtml()}
          ${this.cardCss() ? `<style>${this.cardCss()}</style>` : ""}
        </ha-card>
      `;
      // querySelector can return null — normalize to undefined to satisfy types
      this._card = this.querySelector("ha-card") || undefined;
      this._contentCreated = true;
      this.onCardCreated();
    }
    this.applyTheme();
    this.update(hass);
  }

  public get hass(): HomeAssistant {
    return this._hass;
  }

  public get card(): HTMLElement {
    return this._card || this;
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

  abstract getCardSize(): number;
}
