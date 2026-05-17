import { html, nothing, css, unsafeCSS } from 'lit';
import { BaseCardConfig, BaseDihorCard } from '../../shared/base-card';
import { registerCustomCard } from '../../shared/custom-card-registry';
import cardCssStr from './dihor-person-card.css';

export interface PersonCardConfig extends BaseCardConfig {
  entity: string;
}

export class PersonCard extends BaseDihorCard<PersonCardConfig> {
  static get styles() {
    return [
      super.styles,
      css`
        ${unsafeCSS(cardCssStr)}
      `,
    ];
  }

  setConfig(config: PersonCardConfig) {
    PersonCard.validateConfig(config);
    super.setConfig(config);
  }

  static getStubConfig() {
    return {
      entity: 'person.example',
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: 'entity',
          required: true,
          selector: {
            entity: {
              domain: 'person',
            },
          },
        },
      ],
      computeLabel: (schema: any) => {
        if (schema.name === 'entity') return 'Person Entity';
        return undefined;
      },
      computeHelper: (schema: any) => {
        if (schema.name === 'entity') return 'Select the person entity to display';
        return undefined;
      },
      assertConfig: (config: PersonCardConfig) => {
        PersonCard.validateConfig(config);
      },
    };
  }

  protected renderCard() {
    if (!this.hass || !this._config) {
      return nothing;
    }
    const state = this.hass.states[this._config.entity];
    if (!state) {
      return html`
        <ha-card class="glass-card" header="Person not found">
          <div class="glass-shine"></div>
          <div class="card-content">Entity ${this._config.entity} not found.</div>
        </ha-card>
      `;
    }

    const name = state.attributes.friendly_name || this._config.entity;
    const picture = state.attributes.entity_picture;

    return html`
      <ha-card class="glass-card">
        <div class="glass-shine"></div>
        <div class="card-content person-card-content">
          ${picture ? html`<img src="${picture}" alt="${name}" class="person-avatar" />` : nothing}
          <div class="person-name">${name}</div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 1;
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

  private static validateConfig(config: PersonCardConfig) {
    if (!config.entity || typeof config.entity !== 'string') {
      throw new Error('Entity is required');
    }
  }
}

if (!customElements.get('dihor-person-card')) {
  customElements.define('dihor-person-card', PersonCard);
}

registerCustomCard({
  type: 'dihor-person-card',
  name: 'Dihor Person Card',
  preview: true,
  description: 'Displays Home Assistant person entity',
});
