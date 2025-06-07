# dihor-ha-components

Custom UI components for Home Assistant.

This repository now uses a structure similar to the one from the [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom) project. The source files live in the `src` directory and are written in TypeScript. Running `npm run build` compiles the code to JavaScript under the `www` folder.

## hello-world-card

A simple custom card that displays "hello world!" inside an `ha-card`.

### Installation

1. Install dependencies and build the project:

```bash
npm install
npm run build
```

2. Copy `www/cards/hello-world-card.js` to the `www` folder of your Home Assistant configuration directory.
3. Add the following to your Lovelace resources:

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
