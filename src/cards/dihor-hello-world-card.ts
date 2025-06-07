export interface HelloWorldCardConfig {
  entity?: string;
}

export class HelloWorldCard extends HTMLElement {
  private _hass: any;
  private _config!: HelloWorldCardConfig;
  private _contentCreated = false;

  setConfig(config: HelloWorldCardConfig) {
    this._config = config;
  }

  set hass(hass: any) {
    this._hass = hass;
    const state = this._config.entity
      ? hass.states[this._config.entity]?.state
      : undefined;

    if (!this._contentCreated) {
      this.innerHTML = `
        <ha-card header="Hello">
          <div class="card-content"></div>
        </ha-card>
      `;
      this._contentCreated = true;
    }

    const contentEl = this.querySelector('.card-content');
    if (contentEl) {
      contentEl.textContent = state ? `hello ${state}!` : 'hello world!';
    }
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get('dihor-hello-world-card')) {
  customElements.define('dihor-hello-world-card', HelloWorldCard);
}
