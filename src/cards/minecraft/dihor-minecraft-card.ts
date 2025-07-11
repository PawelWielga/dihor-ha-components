import html from "./dihor-minecraft-card.html";

import coreCss from "../core.css";
import css from "./dihor-minecraft-card.css";
import { BaseDihorCard } from "../base";
import type { HomeAssistant } from "../../../types/home-assistant";

export interface MinecraftCardConfig {
  title?: string;
  entity_prefix: string;
}

export class MinecraftCard extends BaseDihorCard<MinecraftCardConfig> {

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
    super.setConfig(config);
  }

  protected additionalCss() {
    return `<style>${coreCss}</style>`;
  }

  protected cardHtml() {
    return html;
  }

  protected cardCss() {
    return css;
  }

  protected update(hass: HomeAssistant) {
    const p = this._config.entity_prefix;

    const getState = (suffix: string): string => {
      return (
        hass.states[`${p}${suffix}`]?.state ??
        hass.states[`sensor.${p}${suffix}`]?.state ??
        hass.states[`binary_sensor.${p}${suffix}`]?.state ??
        "unavailable"
      );
    };

    const updateText = (id: string, value: string) => {
      const el = this.querySelector(`#${id}`);
      if (el) el.textContent = value;
    };

    // --- Dane ze stanów Home Assistanta ---
    const status = getState("_status").toLowerCase();
    const isOffline =
      status === "unavailable" || status === "offline" || status === "0";

    const worldMessage = isOffline ? "" : getState("_world_message");
    const version = isOffline ? "0.0.0" : getState("_version");
    const playersOnline = isOffline ? "0" : getState("_players_online");
    const playersMax = isOffline ? "0" : getState("_players_max");
    const latencyRaw = isOffline ? "0" : getState("_latency");
    const latency = latencyRaw.split(".")[0];

    // --- Aktualizacja tekstu ---
    updateText("motd", worldMessage);
    updateText("version", version);
    updateText("status", isOffline ? "Offline" : "Online");
    updateText("players", `${playersOnline} / ${playersMax}`);
    updateText("latency", latency);

    // --- Aktualizacja koloru statusu ---
    const statusEl = this.querySelector("#status");
    if (statusEl) {
      statusEl.className = `dihor-badge ${
        isOffline ? "dihor-badge-offline" : "dihor-badge-online"
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
