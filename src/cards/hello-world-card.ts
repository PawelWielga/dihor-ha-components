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

customElements.define('hello-world-card', HelloWorldCard);
