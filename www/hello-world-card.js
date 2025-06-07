class HelloWorldCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
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

customElements.define('hello-world-card', HelloWorldCard);
