# dihor-ha-components

Custom UI components for Home Assistant.

## hello-world-card

A simple custom card that just displays "hello world!" inside an `ha-card`.

### Installation

Copy `www/hello-world-card.js` to the `www` folder of your Home Assistant configuration directory.
Add the following to your Lovelace resources:

```yaml
- url: /local/hello-world-card.js
  type: module
```

### Usage

Add the card in your dashboard YAML:

```yaml
- type: custom:hello-world-card
```

That's it! You should now see a card with the text "hello world!".
