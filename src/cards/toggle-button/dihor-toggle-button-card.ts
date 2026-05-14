import { html, css, unsafeCSS, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import {
  BaseCardConfig,
  BaseDihorCard,
} from "../../shared/base-card";
import { registerCustomCard } from "../../shared/custom-card-registry";
import cardCssStr from "./dihor-toggle-button-card.css";

export interface ToggleButtonCardConfig extends BaseCardConfig {
  entity: string;
  label?: string;
  icon?: string;
  show_label_under?: boolean;
  active_color?: string;
}

export class ToggleButtonCard extends BaseDihorCard<ToggleButtonCardConfig> {

  static get styles() {
    return [
      super.styles,
      css`${unsafeCSS(cardCssStr)}`,
    ];
  }

  setConfig(config: ToggleButtonCardConfig) {
    ToggleButtonCard.validateConfig(config);
    super.setConfig(config);
  }

  static getStubConfig() {
    return {
      entity: "switch.example"
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: {
            entity: {}
          }
        },
        {
          name: "label",
          selector: {
            text: {}
          }
        },
        {
          name: "icon",
          selector: {
            icon: {}
          },
          context: {
            icon_entity: "entity"
          }
        },
        {
          name: "show_label_under",
          selector: {
            boolean: {}
          }
        },
        {
          type: "expandable",
          name: "",
          title: "Colors",
          schema: [
            {
              name: "active_color",
              selector: {
                ui_color: {}
              }
            }
          ]
        }
      ],
      computeLabel: (schema: any) => {
        switch (schema.name) {
          case "entity": return "Entity";
          case "label": return "Custom Label";
          case "icon": return "Custom Icon";
          case "show_label_under": return "Show Label Under Button";
          case "active_color": return "Active Color";
        }
        return undefined;
      },
      computeHelper: (schema: any) => {
        switch (schema.name) {
          case "entity": return "Entity to control (toggle on/off)";
          case "label": return "Optional custom label (defaults to entity friendly name)";
          case "icon": return "Optional custom icon";
          case "show_label_under": return "Display label below the button instead of inside";
          case "active_color": return "Active Color (Background & Border)";
        }
        return undefined;
      },
      assertConfig: (config: ToggleButtonCardConfig) => {
        ToggleButtonCard.validateConfig(config);
      }
    };
  }

  private async toggleEntity() {
    if (!this._config?.entity) return;
    try {
      await this.hass.callService("homeassistant", "toggle", {
        entity_id: this._config.entity,
      });
    } catch (error) {
      console.error("Failed to toggle entity:", error);
    }
  }

  protected renderCard() {
    if (!this.hass || !this._config) return html``;
    const entityId = this._config.entity;
    const stateObj = this.hass.states[entityId];

    const label = this._config.label ||
      stateObj?.attributes?.friendly_name ||
      entityId.replace(/^.*\./, "");

    const icon = this._config.icon ||
      (stateObj?.attributes?.icon as string | undefined) ||
      "mdi:toggle-switch";

    const isOn = stateObj?.state === "on";
    const showLabelUnder = this._config.show_label_under ?? false;
    const activeColor = this.getSafeColor(this._config.active_color);
    const customStyle = activeColor
      ? {
        "--dihor-toggle-active-color": activeColor,
        "--dihor-toggle-active-glow": `${activeColor}66`,
      }
      : {};

    return html`
      <ha-card class="glass-button-container">
        <div class="glass-button-wrapper">
          <button 
            class="glass-card glass-button ${isOn ? 'pressed' : ''}"
            style=${styleMap(customStyle)}
            @click=${this.toggleEntity}
            aria-label=${label}
            aria-pressed=${isOn ? "true" : "false"}
          >
            <div class="glass-shine"></div>
            
            ${isOn ? html`<div class="glass-glow"></div>` : nothing}
            
            ${icon ? html`<ha-icon icon="${icon}" class="glass-icon"></ha-icon>` : nothing}
            
            ${!showLabelUnder && label && !icon ? html`<span class="glass-label-inside">${label}</span>` : nothing}
          </button>

          ${showLabelUnder && label ? html`<span class="glass-label-under">${label}</span>` : nothing}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 2;
  }

  getGridOptions() {
    return {
      rows: 2,
      columns: 3,
      min_rows: 2,
      min_columns: 3,
      max_columns: 6,
    };
  }

  private getSafeColor(color: string | undefined) {
    if (!color) return undefined;
    return CSS.supports("color", color) ? color : undefined;
  }

  private static validateConfig(config: ToggleButtonCardConfig) {
    if (!config.entity || typeof config.entity !== "string") {
      throw new Error("entity is required");
    }

    if (config.active_color && !CSS.supports("color", config.active_color)) {
      throw new Error("active_color must be a valid CSS color");
    }
  }
}

if (!customElements.get("dihor-toggle-button-card")) {
  customElements.define("dihor-toggle-button-card", ToggleButtonCard);
}

registerCustomCard({
  type: "dihor-toggle-button-card",
  name: "Dihor Toggle Button Card",
  preview: true,
  description: "A friendly toggle button that targets a single entity via the provided icon and label."
});
