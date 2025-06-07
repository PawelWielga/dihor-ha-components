export class HelloWorldCard extends HTMLElement {
    constructor() {
        super(...arguments);
        this.content = false;
    }
    setConfig(config) {
        this._config = config;
    }
    set hass(hass) {
        if (!this.content) {
            this.innerHTML = `\n        <ha-card header="Hello">\n          <div class="card-content">hello world!</div>\n        </ha-card>\n      `;
            this.content = true;
        }
    }
    getCardSize() {
        return 1;
    }
}
if (!customElements.get('dihor-hello-world-card')) {
    customElements.define('dihor-hello-world-card', HelloWorldCard);
}
