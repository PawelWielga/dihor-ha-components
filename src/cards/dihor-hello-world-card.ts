export class HelloWorldCard extends HTMLElement {
  private content: boolean = false;
  private _config: any;

  setConfig(config: any) {
    this._config = config;
  }

  set hass(hass: any) {
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
