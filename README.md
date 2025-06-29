# dihor-ha-components

Custom UI components for Home Assistant bundled in `dihor-cards-bundle.js`.

## Installation via HACS

1. Add this repository as a **Custom Repository** in HACS (type *plugin*).
2. Install the **dihor-ha-components** package.
3. In `Settings → Dashboards → Resources` make sure you have the following entry:

```yaml
- url: /hacsfiles/dihor-ha-components/dihor-cards-bundle.js
  type: module
```

If it is missing, add it manually and reload the UI.

## dihor-minecraft-card

This card displays information about a Minecraft server. It expects sensors (either `sensor` or `binary_sensor`) with the prefix defined in `entity_prefix`.

### Example

```yaml
type: custom:dihor-minecraft-card
title: My Minecraft Server
entity_prefix: minecraft_server
```

The card reads data from the following entities (you can change the `minecraft_server` prefix to your own):

- `sensor.minecraft_server`
- `sensor.minecraft_server_version`
- `sensor.minecraft_server_status`
- `sensor.minecraft_server_players_online`
- `sensor.minecraft_server_players_max`
- `sensor.minecraft_server_latency`
- `sensor.minecraft_server_world_message`
