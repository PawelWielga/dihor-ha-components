import html from "./dihor-clock-card.html";
import css from "./dihor-clock-card.css";
import { BaseDihorCard } from "../base";

export interface ClockCardConfig {
  size?: number;
}

export class ClockCard extends BaseDihorCard<ClockCardConfig> {
  private _interval?: number;

  connectedCallback() {
    this.startClock();
  }

  disconnectedCallback() {
    if (this._interval) window.clearInterval(this._interval);
  }

  protected cardHtml() {
    return html;
  }

  protected cardCss() {
    return css;
  }

  protected onCardCreated() {
    this.startClock();
  }

  private startClock() {
    this.updateTime();
    if (this._interval) window.clearInterval(this._interval);
    this._interval = window.setInterval(() => this.updateTime(), 1000);
  }

  private updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const timeEl = this.querySelector('#time') as HTMLElement;
    if (timeEl) timeEl.textContent = timeString;
  }

  getCardSize() {
    return this._config.size ?? 2;
  }
}

if (!customElements.get('dihor-clock-card')) {
  customElements.define('dihor-clock-card', ClockCard);
}

// Register for Lovelace editor preview and HACS UI
;(window as any).customCards = (window as any).customCards || [];
;(window as any).customCards.push({
  type: 'dihor-clock-card',
  name: 'Dihor Clock Card',
  preview: true,
  description: 'Minimal digital clock card with configurable size'
});
