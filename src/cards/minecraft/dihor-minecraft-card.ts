import html from "./dihor-minecraft-card.html";
import css from "./dihor-minecraft-card.css";

export interface MinecraftCardConfig {
  title?: string;
  entity_prefix: string;
}

export class MinecraftCard extends HTMLElement {
  private _hass: any;
  private _config!: MinecraftCardConfig;
  private _contentCreated = false;

  setConfig(config: MinecraftCardConfig) {
    if (!config.entity_prefix) {
      throw new Error("entity_prefix is required");
    }
    if (
      config.entity_prefix.startsWith("sensor.") ||
      config.entity_prefix.startsWith("binary_sensor.")
    ) {
      console.warn(
        '[dihor-minecraft-card] entity_prefix should not include "sensor." or "binary_sensor."'
      );
    }
    this._config = config;
  }

  set hass(hass: any) {
    this._hass = hass;
    const p = this._config.entity_prefix;

    const getState = (suffix: string): string => {
      return (
        hass.states[`${p}${suffix}`]?.state ??
        hass.states[`sensor.${p}${suffix}`]?.state ??
        hass.states[`binary_sensor.${p}${suffix}`]?.state ??
        "N/A"
      );
    };

    if (!this._contentCreated) {
      this.innerHTML = `
        <ha-card class="minecraft-card">
          ${html}
          <style>${css}</style>
        </ha-card>
      `;
      this._contentCreated = true;
    }

    const updateText = (id: string, value: string) => {
      const el = this.querySelector(`#${id}`);
      if (el) el.textContent = value;
    };

    // --- Aktualizacja danych ---
    const status = getState("_status");
    const latency = getState("_latency");

    updateText("motd", getState("_world_message"));
    updateText("version", getState("_version"));
    updateText("status", status);
    updateText("protocol", getState("_protocol_version"));
    updateText(
      "players",
      `${getState("_players_online")} / ${getState("_players_max")}`
    );
    updateText("latency", latency);

    // --- Zmiana klasy statusu (online/offline) ---
    const statusEl = this.querySelector("#status");
    if (statusEl) {
      statusEl.className = `stat-value ${
        status.toLowerCase().includes("offline")
          ? "status-offline"
          : "status-online"
      }`;
    }
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get("dihor-minecraft-card")) {
  customElements.define("dihor-minecraft-card", MinecraftCard);
}
