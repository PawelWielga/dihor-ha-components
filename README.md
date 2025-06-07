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
   `/hacsfiles/dihor-ha-components/dihor-hello-world-card.js` automatically.
   This is the same file that is accessible via
   `/local/community/dihor-ha-components/dihor-hello-world-card.js`.
   If it is missing, add this path manually to your Lovelace resources as a
   module.

#### Manual

1. Create a folder called `dihor-ha-components` inside your Home Assistant
   `www` directory.
2. Copy `dihor-hello-world-card.js` from this repository (or download the
   release file) into that folder. Your configuration directory should contain
   `www/dihor-ha-components/dihor-hello-world-card.js`.
3. Add the following to your Lovelace resources:

```yaml
- url: /local/dihor-ha-components/dihor-hello-world-card.js
  type: module
```

### Usage

Add the card in your dashboard YAML:

```yaml
- type: custom:dihor-hello-world-card
```

That's it! You should now see a card with the text "hello world!".


## dihor-person-card

A simple card that displays the picture of a `person` entity.

### Usage

Add the card in your dashboard YAML:

```yaml
- type: custom:dihor-person-card
  entity: person.your_name
```

The card will show the person's profile picture using the entity's `entity_picture` attribute.
