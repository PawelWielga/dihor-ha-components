export class MinecraftCard extends HTMLElement {
    constructor() {
        super(...arguments);
        this._contentCreated = false;
    }
    setConfig(config) {
        if (!config.entity_prefix) {
            throw new Error('entity_prefix is required');
        }
        this._config = config;
    }
    set hass(hass) {
        var _a;
        this._hass = hass;
        const p = this._config.entity_prefix;
        const get = (suffix) => {
            var _a, _b;
            return (_b = (_a = hass.states[`${p}${suffix}`]) === null || _a === void 0 ? void 0 : _a.state) !== null && _b !== void 0 ? _b : 'N/A';
        };
        if (!this._contentCreated) {
            this.innerHTML = `
        <ha-card header="${(_a = this._config.title) !== null && _a !== void 0 ? _a : 'Minecraft Server'}">
          <div class="card-content">
            <ul class="minecraft-stats">
              <li>🌍 MOTD: <span id="motd"></span></li>
              <li>🧩 Version: <span id="version"></span></li>
              <li>🔌 Status: <span id="status"></span></li>
              <li>📶 Protocol: <span id="protocol"></span></li>
              <li>👥 Players: <span id="players"></span></li>
              <li>📡 Latency: <span id="latency"></span></li>
            </ul>
          </div>
        </ha-card>
        <style>
          ul.minecraft-stats {
            list-style: none;
            padding: 0;
          }
          ul.minecraft-stats li {
            margin: 4px 0;
            display: flex;
            justify-content: space-between;
          }
        </style>
      `;
            this._contentCreated = true;
        }
        const setText = (id, value) => {
            const el = this.querySelector(`#${id}`);
            if (el)
                el.textContent = value;
        };
        setText('motd', get(''));
        setText('version', get('_version'));
        setText('status', get('_status'));
        setText('protocol', get('_protocol_version'));
        setText('players', `${get('_players_online')}/${get('_players_max')}`);
        setText('latency', get('_latency'));
    }
    getCardSize() {
        return 1;
    }
}
if (!customElements.get('dihor-minecraft-card')) {
    customElements.define('dihor-minecraft-card', MinecraftCard);
}
