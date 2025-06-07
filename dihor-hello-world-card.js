export class HelloWorldCard extends HTMLElement {
    constructor() {
        super(...arguments);
        this._contentCreated = false;
    }
    setConfig(config) {
        this._config = config;
    }
    set hass(hass) {
        var _a;
        this._hass = hass;
        const state = this._config.entity
            ? (_a = hass.states[this._config.entity]) === null || _a === void 0 ? void 0 : _a.state
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
