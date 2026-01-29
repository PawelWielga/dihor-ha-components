import { html, css, unsafeCSS } from "lit";
import { BaseDihorCard } from "../base";

// Import CSS as string (handled by rollup-plugin-string)
import coreCss from "../core.css";
import cardCssStr from "./dihor-minecraft-card.css";

// We will inline the HTML template logic into render() instead of importing the HTML file
// to take full advantage of Lit's binding capabilities.
// import htmlTemplate from "./dihor-minecraft-card.html"; 

export interface MinecraftCardConfig {
  title?: string;
  entity_prefix: string;
}

export class MinecraftCard extends BaseDihorCard<MinecraftCardConfig> {

  static get styles() {
    return [
      super.styles,
      css`${unsafeCSS(cardCssStr)}`,
      css`${unsafeCSS(coreCss)}`
    ];
  }

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

  static getStubConfig() {
    return {
      entity_prefix: "minecraft_server",
      title: "Minecraft Server"
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity_prefix",
          required: true,
          selector: {
            text: {}
          }
        },
        {
          name: "title",
          selector: {
            text: {}
          }
        }
      ],
      computeLabel: (schema: any) => {
        if (schema.name === "entity_prefix") return "Entity Prefix";
        if (schema.name === "title") return "Card Title";
        return undefined;
      },
      computeHelper: (schema: any) => {
        if (schema.name === "entity_prefix") {
          return "Prefix for Minecraft sensor entities (e.g., 'minecraft_server' for sensor.minecraft_server_status)";
        }
        if (schema.name === "title") {
          return "Optional title for the card (defaults to 'Minecraft Server')";
        }
        return undefined;
      }
    };
  }

  protected renderCard() {
    if (!this.hass || !this._config) return html``;

    const p = this._config.entity_prefix;
    const getState = (suffix: string): string => {
      return (
        this.hass.states[`${p}${suffix}`]?.state ??
        this.hass.states[`sensor.${p}${suffix}`]?.state ??
        this.hass.states[`binary_sensor.${p}${suffix}`]?.state ??
        "unavailable"
      );
    };

    // Data gathering
    const status = getState("_status").toLowerCase();
    const isOffline = status === "unavailable" || status === "offline" || status === "0";

    // If we want to strictly follow the old HTML structure:
    // It seems the old HTML was quite static and used IDs to update content.
    // We should recreate that structure but with bindings.

    const worldMessage = isOffline ? "" : getState("_world_message");
    const version = isOffline ? "0.0.0" : getState("_version");
    const playersOnline = isOffline ? "0" : getState("_players_online");
    const playersMax = isOffline ? "0" : getState("_players_max");
    const latencyRaw = isOffline ? "0" : getState("_latency");
    const latency = latencyRaw.split(".")[0];
    const statusText = isOffline ? "Offline" : "Online";
    const statusClass = isOffline ? "dihor-badge-offline" : "dihor-badge-online";

    return html`
      <ha-card class="dihor-card">
        <div class="dihor-card-header">
          <div class="dihor-card-title">
             <span class="dihor-icon">🎮</span> ${this._config.title || "Minecraft Server"}
          </div>
          <div id="status" class="dihor-badge ${statusClass}">${statusText}</div>
        </div>
        
        <div class="dihor-card-content">
          <div class="server-info-row">
            <span class="info-label">MOTD</span>
            <span class="info-value" id="motd">${worldMessage}</span>
          </div>

          <div class="server-stats-grid">
             <div class="stat-item">
                <span class="stat-value" id="players">${playersOnline} / ${playersMax}</span>
                <span class="stat-label">Players</span>
             </div>
             <div class="stat-item">
                <span class="stat-value" id="latency">${latency} ms</span>
                <span class="stat-label">Ping</span>
             </div>
             <div class="stat-item">
                <span class="stat-value" id="version">${version}</span>
                <span class="stat-label">Version</span>
             </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get("dihor-minecraft-card")) {
  customElements.define("dihor-minecraft-card", MinecraftCard);
}

// Register for Lovelace editor preview and HACS UI
; (window as any).customCards = (window as any).customCards || [];
; (window as any).customCards.push({
  type: 'dihor-minecraft-card',
  name: 'Dihor Minecraft Card',
  preview: true,
  description: 'Monitor a Minecraft server via sensor entities'
});
