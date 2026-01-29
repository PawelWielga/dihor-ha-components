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

