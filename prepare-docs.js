const fs = require("fs");
const path = require("path");

// Source and Target Paths
const distFile = path.join(__dirname, "dist", "dihor-ha-components.js");
const docsDir = path.join(__dirname, "docs");
const targetFile = path.join(docsDir, "dihor-ha-components.js");

const packageJson = require(path.join(__dirname, "package.json"));

// Ensure docs directory exists
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Copy the built bundle
if (fs.existsSync(distFile)) {
  fs.copyFileSync(distFile, targetFile);
  console.log("✅ Copied dist/dihor-ha-components.js to docs/");
} else {
  console.warn("⚠️  dist/dihor-ha-components.js not found. Run 'npm run build' first.");
}

// Copy all cards files (CSS, manifest, etc.)
const cardsSourceDir = path.join(__dirname, "src", "cards");
const cardsTargetDir = path.join(docsDir, "cards");
if (!fs.existsSync(cardsTargetDir)) {
  fs.mkdirSync(cardsTargetDir, { recursive: true });
}

// Copy all files from src/cards to docs/cards recursively
function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied ${sourcePath} to ${targetPath}`);
    }
  });
}

copyDirectory(cardsSourceDir, cardsTargetDir);

// Write version info
const versionInfo = {
  version: packageJson.version,
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(
  path.join(docsDir, "version.json"),
  JSON.stringify(versionInfo, null, 2) + "\n"
);
console.log(`✅ Wrote version.json (v${versionInfo.version})`);

// Create .nojekyll
fs.writeFileSync(path.join(docsDir, ".nojekyll"), "");

