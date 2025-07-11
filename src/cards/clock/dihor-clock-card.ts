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
    this.updateHands();
    if (this._interval) window.clearInterval(this._interval);
    this._interval = window.setInterval(() => this.updateHands(), 1000);
  }

  private updateHands() {
    const now = new Date();
    const second = now.getSeconds();
    const minute = now.getMinutes();
    const hour = now.getHours() % 12;

    const secDeg = second * 6;
    const minDeg = minute * 6 + second * 0.1;
    const hourDeg = hour * 30 + minute * 0.5;

    const hourEl = this.querySelector('#hour') as HTMLElement;
    const minEl = this.querySelector('#minute') as HTMLElement;
    const secEl = this.querySelector('#second') as HTMLElement;
    if (hourEl) hourEl.style.transform = `rotate(${hourDeg}deg)`;
    if (minEl) minEl.style.transform = `rotate(${minDeg}deg)`;
    if (secEl) secEl.style.transform = `rotate(${secDeg}deg)`;
  }

  getCardSize() {
    return this._config.size ?? 2;
  }
}

if (!customElements.get('dihor-clock-card')) {
  customElements.define('dihor-clock-card', ClockCard);
}
