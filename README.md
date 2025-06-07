# dihor-ha-components

Custom UI components for Home Assistant.

This repository now uses a structure similar to the one from the [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom) project. The source files live in the `src` directory and are written in TypeScript. Built JavaScript files are included under the `www` folder so no additional build step is required for installation.

## dihor-hello-world-card

A simple custom card that displays "hello world!" inside an `ha-card`.

### Installation

#### Using HACS

1. Add this repository as a custom repository of type **plugin** in HACS.
2. Install **dihor-ha-components** from the HACS UI.
3. Reload Lovelace resources.
4. HACS should register the resource
   `/hacsfiles/dihor-ha-components/www/cards/dihor-hello-world-card.js` automatically.
   If it is missing, add this path manually to your Lovelace resources as a
   module.

#### Manual

1. Copy `www/cards/dihor-hello-world-card.js` to the `www` folder of your Home Assistant configuration directory (no build step required).
2. Add the following to your Lovelace resources:

```yaml
- url: /local/cards/dihor-hello-world-card.js
  type: module
```

### Usage

Add the card in your dashboard YAML:

```yaml
- type: custom:dihor-hello-world-card
```

That's it! You should now see a card with the text "hello world!".
