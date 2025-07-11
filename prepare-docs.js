const fs = require("fs");
const path = require("path");

// Ścieżki źródłowe i docelowe
const cardsSourceDir = path.join(__dirname, "src", "cards");
const cardsTargetDir = path.join(__dirname, "docs", "cards");
const docsDir = path.join(__dirname, "docs");

// Upewnij się, że katalog docs/cards istnieje
fs.mkdirSync(cardsTargetDir, { recursive: true });

// Skopiuj theme.css jeśli istnieje
const themeCssPath = path.join(cardsSourceDir, "theme.css");
if (fs.existsSync(themeCssPath)) {
  const destThemePath = path.join(cardsTargetDir, "theme.css");
  fs.copyFileSync(themeCssPath, destThemePath);
  console.log("✅ Copied theme.css to docs/cards/");
}

// Skopiuj theme.css jeśli istnieje
const coreCssPath = path.join(cardsSourceDir, "core.css");
if (fs.existsSync(coreCssPath)) {
  const destThemePath = path.join(cardsTargetDir, "core.css");
  fs.copyFileSync(coreCssPath, destThemePath);
  console.log("✅ Copied core.css to docs/cards/");
}

// Kopiuj każdy komponent z src/cards/ do docs/cards/
fs.readdirSync(cardsSourceDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .forEach((dir) => {
    const srcPath = path.join(cardsSourceDir, dir.name);
    const destPath = path.join(cardsTargetDir, dir.name);
    fs.mkdirSync(destPath, { recursive: true });

    fs.readdirSync(srcPath)
      .filter((file) => file.endsWith(".html") || file.endsWith(".css"))
      .forEach((file) => {
        const srcFile = path.join(srcPath, file);
        const destFile = path.join(destPath, file);
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied ${file} to docs/cards/${dir.name}/`);
      });
  });

// Dodaj .nojekyll
fs.writeFileSync(path.join(docsDir, ".nojekyll"), "");
