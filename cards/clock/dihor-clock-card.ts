import { html, css, unsafeCSS } from "lit";
import { state } from "lit/decorators.js";
import { BaseDihorCard } from "../base";
import cardCssStr from "./dihor-clock-card.css";

export interface ClockCardConfig {
  size?: number;
}

export class ClockCard extends BaseDihorCard<ClockCardConfig> {
  @state() private _timeString: string = "";
  private _interval?: number;

  static get styles() {
    return [
      super.styles,
      css`${unsafeCSS(cardCssStr)}`
    ];
  }

  static getStubConfig() {
    return {
      size: 2
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "size",
          selector: {
            number: {
              min: 1,
              max: 5,
              mode: "box"
            }
          }
        }
      ],
      computeLabel: (schema: any) => {
        if (schema.name === "size") return "Clock Size";
        return undefined;
      },
      computeHelper: (schema: any) => {
        if (schema.name === "size") return "Size of the clock display (1-5, default: 2)";
        return undefined;
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.startClock();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._interval) window.clearInterval(this._interval);
  }

  private startClock() {
    this.updateTime();
    if (this._interval) window.clearInterval(this._interval);
    this._interval = window.setInterval(() => this.updateTime(), 1000);
  }

  private updateTime() {
    const now = new Date();
    this._timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  protected renderCard() {
    return html`
      <ha-card class="clock-card glass-card" style="font-size: ${this.getCardSize() * 2}rem;">
        <div class="glass-shine"></div>
        <div class="card-content">
           <div class="clock-face">
             <span id="time" class="time-display">${this._timeString}</span>
           </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return this._config?.size ?? 2;
  }
}

if (!customElements.get('dihor-clock-card')) {
  customElements.define('dihor-clock-card', ClockCard);
}

// Register for Lovelace editor preview and HACS UI
; (window as any).customCards = (window as any).customCards || [];
; (window as any).customCards.push({
  type: 'dihor-clock-card',
  name: 'Dihor Clock Card',
  preview: true,
  description: 'Minimal digital clock card with configurable size'
});
