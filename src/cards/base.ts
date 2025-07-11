import themeCss from "./theme.css";

export abstract class BaseDihorCard<ConfigType> extends HTMLElement {
  protected _hass: any;
  protected _config!: ConfigType;
  private _contentCreated = false;

  setConfig(config: ConfigType) {
    this._config = config;
  }

  set hass(hass: any) {
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
    this.applyTheme(hass);
    this.update(hass);
  }

  private applyTheme(hass: any) {
    const haCard = this.querySelector("ha-card");
    const dark = hass.themes?.darkMode;
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

  protected update(_hass: any): void {}
}
