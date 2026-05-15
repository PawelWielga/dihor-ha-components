import { html, css, unsafeCSS, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import {
  BaseCardConfig,
  BaseDihorCard,
  DIHOR_DENSITY_SCHEMA,
  getDihorDensityHelper,
  getDihorDensityLabel,
} from "../../shared/base-card";
import { registerCustomCard } from "../../shared/custom-card-registry";
import cardCssStr from "./dihor-toggle-button-card.css";

export interface ToggleButtonCardConfig extends BaseCardConfig {
  entity: string;
  label?: string;
  icon?: string;
  show_label?: boolean;
  show_label_under?: boolean;
  active_color?: string;
  tap_action?: DihorActionConfig;
  hold_action?: DihorActionConfig;
  double_tap_action?: DihorActionConfig;
}

type DihorActionConfig = {
  action?: string;
  [key: string]: unknown;
};

export class ToggleButtonCard extends BaseDihorCard<ToggleButtonCardConfig> {
  private holdTimer?: number;
  private tapTimer?: number;
  private holdTriggered = false;
  private suppressNextClick = false;

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
          name: "show_label",
          selector: {
            boolean: {}
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
          title: "Actions",
          schema: [
            {
              name: "tap_action",
              selector: {
                ui_action: {
                  default_action: "toggle"
                }
              }
            },
            {
              name: "hold_action",
              selector: {
                ui_action: {
                  default_action: "more-info"
                }
              }
            },
            {
              name: "double_tap_action",
              selector: {
                ui_action: {
                  default_action: "none"
                }
              }
            }
          ]
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
        },
        DIHOR_DENSITY_SCHEMA,
      ],
      computeLabel: (schema: any) => {
        const densityLabel = getDihorDensityLabel(schema);
        if (densityLabel) return densityLabel;
        switch (schema.name) {
          case "entity": return "Entity";
          case "label": return "Custom Label";
          case "icon": return "Custom Icon";
          case "show_label": return "Show Label";
          case "show_label_under": return "Show Label Under Button";
          case "tap_action": return "Tap Action";
          case "hold_action": return "Hold Action";
          case "double_tap_action": return "Double Tap Action";
          case "active_color": return "Active Color";
        }
        return undefined;
      },
      computeHelper: (schema: any) => {
        const densityHelper = getDihorDensityHelper(schema);
        if (densityHelper) return densityHelper;
        switch (schema.name) {
          case "entity": return "Entity to control (toggle on/off)";
          case "label": return "Optional custom label (defaults to entity friendly name, leave empty for icon-only)";
          case "icon": return "Optional custom icon";
          case "show_label": return "Show or hide the entity label";
          case "show_label_under": return "Display label below the button instead of inside";
          case "tap_action": return "Defaults to toggle";
          case "hold_action": return "Defaults to more-info";
          case "double_tap_action": return "Defaults to none";
          case "active_color": return "Active Color (Background & Border)";
        }
        return undefined;
      },
      assertConfig: (config: ToggleButtonCardConfig) => {
        ToggleButtonCard.validateConfig(config);
      }
    };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearActionTimers();
  }

  private clearActionTimers() {
    if (this.holdTimer) {
      window.clearTimeout(this.holdTimer);
      this.holdTimer = undefined;
    }

    if (this.tapTimer) {
      window.clearTimeout(this.tapTimer);
      this.tapTimer = undefined;
    }
  }

  private buildActionConfig() {
    return {
      ...this._config,
      entity: this._config.entity,
      tap_action: this._config.tap_action ?? { action: "toggle" },
      hold_action: this._config.hold_action ?? { action: "more-info" },
      double_tap_action: this._config.double_tap_action ?? { action: "none" },
    };
  }

  private fireAction(action: "tap" | "hold" | "double_tap") {
    if (!this._config?.entity) return;

    this.dispatchEvent(new CustomEvent("hass-action", {
      bubbles: true,
      composed: true,
      detail: {
        config: this.buildActionConfig(),
        action,
      },
    }));
  }

  private handlePointerDown(event: PointerEvent) {
    if (event.button !== 0 || !this._config?.entity) return;
    this.holdTriggered = false;
    window.clearTimeout(this.holdTimer);
    this.holdTimer = window.setTimeout(() => {
      this.holdTriggered = true;
      this.suppressNextClick = true;
      this.fireAction("hold");
    }, 500);
  }

  private handlePointerEnd() {
    window.clearTimeout(this.holdTimer);
    this.holdTimer = undefined;
  }

  private handleClick(event: MouseEvent) {
    if (this.suppressNextClick || this.holdTriggered) {
      event.preventDefault();
      event.stopPropagation();
      this.suppressNextClick = false;
      this.holdTriggered = false;
      return;
    }

    if (this.tapTimer) {
      window.clearTimeout(this.tapTimer);
      this.tapTimer = undefined;
      this.fireAction("double_tap");
      return;
    }

    this.tapTimer = window.setTimeout(() => {
      this.fireAction("tap");
      this.tapTimer = undefined;
    }, 260);
  }

  private handleDoubleClick(event: MouseEvent) {
    event.preventDefault();
  }

  private handleContextMenu(event: MouseEvent) {
    if (this.holdTriggered) {
      event.preventDefault();
    }
  }

  protected renderCard() {
    if (!this.hass || !this._config) return html``;
    const entityId = this._config.entity;
    const stateObj = this.hass.states[entityId];

    const fallbackLabel = stateObj?.attributes?.friendly_name ||
      entityId.replace(/^.*\./, "");
    const showLabel = this._config.show_label ?? true;
    const label = showLabel ? (this._config.label ?? fallbackLabel) : "";

    const icon = this._config.icon ||
      (stateObj?.attributes?.icon as string | undefined) ||
      "mdi:toggle-switch";

    const isOn = stateObj?.state === "on";
    const isUnavailable = !stateObj || stateObj.state === "unavailable" || stateObj.state === "unknown";
    const showLabelUnder = this._config.show_label_under ?? false;
    const activeColor = this.getSafeColor(this._config.active_color);
    const customStyle = activeColor
      ? {
        "--dihor-toggle-active-color": activeColor,
      }
      : {};

    return html`
      <div class="button-card-root">
        <div class="glass-button-wrapper">
          <button
            type="button"
            class="glass-button ${isOn ? 'pressed' : ''} ${isUnavailable ? 'unavailable' : ''} ${showLabelUnder ? 'has-label-under' : 'has-inline-label'}"
            style=${styleMap(customStyle)}
            @pointerdown=${this.handlePointerDown}
            @pointerup=${this.handlePointerEnd}
            @pointerleave=${this.handlePointerEnd}
            @pointercancel=${this.handlePointerEnd}
            @click=${this.handleClick}
            @dblclick=${this.handleDoubleClick}
            @contextmenu=${this.handleContextMenu}
            aria-label=${label || fallbackLabel}
            aria-pressed=${isOn ? "true" : "false"}
          >
            ${icon ? html`<ha-icon icon="${icon}" class="glass-icon"></ha-icon>` : nothing}
            ${!showLabelUnder && label ? html`<span class="glass-label-inside">${label}</span>` : nothing}
          </button>

          ${showLabelUnder && label ? html`<span class="glass-label-under">${label}</span>` : nothing}
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 1;
  }

  getGridOptions() {
    return {
      rows: 1,
      columns: 3,
      min_rows: 1,
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
