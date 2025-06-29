export interface MinecraftCardConfig {
  title?: string;
  entity_prefix: string;
}

export class MinecraftCard extends HTMLElement {
  private _hass: any;
  private _config!: MinecraftCardConfig;
  private _contentCreated = false;

  setConfig(config: MinecraftCardConfig) {
    if (!config.entity_prefix) {
      throw new Error('entity_prefix is required');
    }
    this._config = config;
  }

  set hass(hass: any) {
    this._hass = hass;
    const p = this._config.entity_prefix;

    const getState = (suffix: string): string => {
      return (
        hass.states[`sensor.${p}${suffix}`]?.state ??
        hass.states[`binary_sensor.${p}${suffix}`]?.state ??
        'N/A'
      );
    };

    if (!this._contentCreated) {
      this.innerHTML = `
        <ha-card header="${this._config.title ?? 'Minecraft Server'}">
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

    const setText = (id: string, value: string) => {
      const el = this.querySelector(`#${id}`);
      if (el) el.textContent = value;
    };

    setText('motd', getState(''));
    setText('version', getState('_version'));
    setText('status', getState('_status'));
    setText('protocol', getState('_protocol_version'));
    setText('players', `${getState('_players_online')}/${getState('_players_max')}`);
    setText('latency', getState('_latency'));
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get('dihor-minecraft-card')) {
  customElements.define('dihor-minecraft-card', MinecraftCard);
}
