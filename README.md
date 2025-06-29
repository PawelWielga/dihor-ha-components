# dihor-ha-components

Custom UI components for Home Assistant.

This repository uses a modular structure inspired by the [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom) project.  
The source files are written in TypeScript and live in the `src` directory.  
All components are bundled into a single JavaScript file (`dihor-ha-bundle.js`) using [Rollup](https://rollupjs.org/), so no additional build steps are needed for users.

---

## 📦 Included Cards

- `dihor-hello-world-card` – displays "hello world!" inside an `ha-card`.
- `dihor-person-card` – displays a person’s profile picture from a `person` entity.
- `dihor-minecraft-card` – displays statistics from a Minecraft server using `sensor` entities.

---

## 🚀 Installation

### Using HACS

1. Add this repository as a **custom repository of type _plugin_** in HACS.
2. Install **dihor-ha-components** via HACS.
3. After installation, go to **Settings → Dashboards → Resources** and make sure the following resource exists:

```yaml
- url: /hacsfiles/dihor-ha-components/dihor-ha-bundle.js
  type: module
```

> If it's missing, add it manually.

4. Reload your Lovelace dashboard (Ctrl+F5 or browser refresh).

---

### Manual

1. Download the latest `dihor-ha-bundle.js` file from the [Releases](./releases) section or build it locally.
2. Place it in `www/dihor-ha-components/` inside your Home Assistant config.
3. Add the following to your Lovelace resources:

```yaml
- url: /local/dihor-ha-components/dihor-ha-bundle.js
  type: module
```

4. Reload Lovelace.

---

## 🧱 Usage Examples

### `dihor-hello-world-card`

```yaml
- type: custom:dihor-hello-world-card
  entity: sensor.time
```

---

### `dihor-person-card`

```yaml
- type: custom:dihor-person-card
  entity: person.your_name
```

The card displays the profile picture from the `entity_picture` attribute.

---

### `dihor-minecraft-card`

```yaml
- type: custom:dihor-minecraft-card
  title: My Minecraft Server
  entity_prefix: sensor.minecraft_server
```

This card uses multiple `sensor` entities, such as:

- `sensor.minecraft_server`
- `sensor.minecraft_server_version`
- `sensor.minecraft_server_status`
- `sensor.minecraft_server_players_online`, etc.

Make sure your Minecraft integration or MQTT sensor exposes those.

---

## 🛠 Development

To build the project locally:

```bash
npm install
npm run build
```

To watch for changes during development:

```bash
npm run dev
```

---

## 📃 License

MIT – use freely and contribute!