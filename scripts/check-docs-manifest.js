const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'src', 'cards', 'cards-docs.json');
const docsCardsDir = path.join(rootDir, 'docs', 'cards');

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const missing = [];

for (const card of manifest) {
  const folder = card.folder;
  const css = card.preview && card.preview.css;
  if (!folder || !css) {
    missing.push(`Invalid manifest entry: ${JSON.stringify(card)}`);
    continue;
  }

  const cssPath = path.join(docsCardsDir, folder, css);
  if (!fs.existsSync(cssPath)) {
    missing.push(cssPath);
  }
}

if (missing.length) {
  console.error('Docs manifest validation failed. Missing assets:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('Docs manifest validation passed.');
