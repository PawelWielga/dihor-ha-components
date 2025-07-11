import { BaseDihorCard } from "../base";
import type { HomeAssistant } from "../../../types/home-assistant";

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

  protected cardHtml() {
    return `
      <div class="card-content">
        <img style="width:100%;border-radius:50%" />
      </div>
    `;
  }

  protected update(hass: HomeAssistant) {
    const state = hass.states[this._config.entity];
    if (!state) {
      return;
    }
    const name = state.attributes.friendly_name || this._config.entity;
    const picture = state.attributes.entity_picture;

    const haCard = this.querySelector('ha-card');
    if (haCard) {
      haCard.setAttribute('header', name);
    }

    const img = this.querySelector('img');
    if (img && picture) {
      img.setAttribute('src', picture);
      img.setAttribute('alt', name);
    }
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get('dihor-person-card')) {
  customElements.define('dihor-person-card', PersonCard);
}
