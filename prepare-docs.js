const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "src", "cards");
const targetDir = path.join(__dirname, "docs", "cards");

fs.readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .forEach((dir) => {
    const srcPath = path.join(sourceDir, dir.name);
    const destPath = path.join(targetDir, dir.name);

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    fs.readdirSync(srcPath)
      .filter((file) => file.endsWith(".html") || file.endsWith(".css"))
      .forEach((file) => {
        const srcFile = path.join(srcPath, file);
        const destFile = path.join(destPath, file);
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied to docs/cards/${dir.name}/${file}`);
      });
  });
