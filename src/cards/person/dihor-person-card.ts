import themeCss from "../../theme.css";

export interface PersonCardConfig {
  entity: string;
}

export class PersonCard extends HTMLElement {
  private _hass: any;
  private _config!: PersonCardConfig;
  private _contentCreated = false;

  setConfig(config: PersonCardConfig) {
    if (!config.entity) {
      throw new Error('Entity is required');
    }
    this._config = config;
  }

  set hass(hass: any) {
    this._hass = hass;
    const state = hass.states[this._config.entity];
    if (!state) {
      return;
    }
    const name = state.attributes.friendly_name || this._config.entity;
    const picture = state.attributes.entity_picture;

    if (!this._contentCreated) {
      this.innerHTML = `
        <style>${themeCss}</style>
        <ha-card header="${name}">
          <div class="card-content">
            <img style="width:100%;border-radius:50%" />
          </div>
        </ha-card>
      `;
      this._contentCreated = true;
    } else {
      const haCard = this.querySelector('ha-card');
      if (haCard) {
        haCard.setAttribute('header', name);
      }
    }
    const haCard = this.querySelector('ha-card');
    const dark = hass.themes?.darkMode;
    if (haCard) {
      haCard.classList.toggle('dihor-theme-dark', !!dark);
      haCard.classList.toggle('dihor-theme-light', !dark);
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
