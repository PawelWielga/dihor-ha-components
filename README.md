# dihor-ha-components

Custom UI components for Home Assistant.

This repository now uses a structure similar to the one from the [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom) project. The source files live in the `src` directory and are written in TypeScript. Built JavaScript files are included under the `www` folder so no additional build step is required for installation.

## hello-world-card

A simple custom card that displays "hello world!" inside an `ha-card`.

### Installation

#### Using HACS

1. Add this repository as a custom repository of type **plugin** in HACS.
2. Install **dihor-ha-components** from the HACS UI.
3. Reload Lovelace resources.

#### Manual

1. Copy `www/cards/hello-world-card.js` to the `www` folder of your Home Assistant configuration directory (no build step required).
2. Add the following to your Lovelace resources:

```yaml
- url: /local/cards/hello-world-card.js
  type: module
```

### Usage

Add the card in your dashboard YAML:

```yaml
- type: custom:hello-world-card
```

That's it! You should now see a card with the text "hello world!".
