import { html, nothing } from 'lit';
import { BaseDihorCard } from "../base";

export interface PersonCardConfig {
  entity: string;
}

export class PersonCard extends BaseDihorCard<PersonCardConfig> {

  setConfig(config: PersonCardConfig) {
    if (!config.entity) {
      throw new Error('Entity is required');
    }
    super.setConfig(config);
  }

  static getStubConfig() {
    return {
      entity: "person.example"
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: {
            entity: {
              domain: "person"
            }
          }
        }
      ],
      computeLabel: (schema: any) => {
        if (schema.name === "entity") return "Person Entity";
        return undefined;
      },
      computeHelper: (schema: any) => {
        if (schema.name === "entity") return "Select the person entity to display";
        return undefined;
      }
    };
  }

  protected renderCard() {
    if (!this.hass || !this._config) {
      return nothing;
    }
    const state = this.hass.states[this._config.entity];
    if (!state) {
      return html`
        <ha-card header="Person not found">
            <div class="card-content">
                Entity ${this._config.entity} not found.
            </div>
        </ha-card>
      `;
    }

    const name = state.attributes.friendly_name || this._config.entity;
    const picture = state.attributes.entity_picture;

    return html`
      <ha-card header="${name}">
        <div class="card-content">
            ${picture ? html`<img src="${picture}" alt="${name}" style="width:100%;border-radius:50%" />` : nothing}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get('dihor-person-card')) {
  customElements.define('dihor-person-card', PersonCard);
}

// Register for Lovelace editor preview and HACS UI
; (window as any).customCards = (window as any).customCards || [];
; (window as any).customCards.push({
  type: 'dihor-person-card',
  name: 'Dihor Person Card',
  preview: true,
  description: 'Displays Home Assistant person entity'
});
