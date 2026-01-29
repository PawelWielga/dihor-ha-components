import { html, css, unsafeCSS } from "lit";
import { BaseDihorCard } from "../base";
import cardCssStr from "./dihor-toggle-button-card.css";

export interface ToggleButtonCardConfig {
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
      // Dynamic styles need to be handled differently in Lit or via style map,
      // but for now we can inline them in render or use a host style.
      // Or we can simple keep them in render properties.
    ];
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

    // Dynamic color styles (optional override)
    const activeColor = this._config.active_color;

    let customStyle = "";
    if (isOn && activeColor) {
      customStyle = `background:${activeColor}; border-color:${activeColor}; box-shadow: 0 0 15px ${activeColor}66;`;
    }

    return html`
      <ha-card class="glass-button-container">
        <div class="glass-button-wrapper">
          <button 
            class="glass-card glass-button ${isOn ? 'pressed' : ''}"
            style="${customStyle}"
            @click=${this.toggleEntity}
          >
            <!-- Gradient overlay for glass effect -->
            <div class="glass-shine"></div>
            
            <!-- Active glow effect -->
            ${isOn ? html`<div class="glass-glow"></div>` : ''}
            
            <!-- Icon -->
            ${icon ? html`<ha-icon icon="${icon}" class="glass-icon"></ha-icon>` : ''}
            
            <!-- Label inside button (if not showing under) -->
            ${!showLabelUnder && label && !icon ? html`<span class="glass-label-inside">${label}</span>` : ''}
          </button>

          <!-- Label under button -->
          ${showLabelUnder && label ? html`<span class="glass-label-under">${label}</span>` : ''}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 2;
  }
}

if (!customElements.get("dihor-toggle-button-card")) {
  customElements.define("dihor-toggle-button-card", ToggleButtonCard);
}

// Register for Lovelace editor preview and HACS UI
; (window as any).customCards = (window as any).customCards || [];
; (window as any).customCards.push({
  type: "dihor-toggle-button-card",
  name: "Dihor Toggle Button Card",
  preview: true,
  description: "A friendly toggle button that targets a single entity via the provided icon and label."
});
