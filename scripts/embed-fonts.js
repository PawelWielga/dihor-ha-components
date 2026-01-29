const fs = require('fs');
const path = require('path');
const https = require('https');

const fonts = [
    {
        name: 'Inter',
        weight: 400,
        style: 'normal',
        url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf',
    },
    {
        name: 'Inter',
        weight: 700,
        style: 'normal',
        url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf',
    },
];

const outputDir = path.resolve(__dirname, '../src/cards');
const outputFile = path.join(outputDir, 'font.css');

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
                const data = [];
                res.on('data', (chunk) => data.push(chunk));
                res.on('end', () => resolve(Buffer.concat(data)));
                res.on('error', (err) => reject(err));
            })
            .on('error', (err) => reject(err));
    });
}

async function generateFontCss() {
    console.log('Generating font CSS...');
    let cssContent = '/* Auto-generated file. Do not edit manually. */\n';

    for (const font of fonts) {
        console.log(`Downloading ${font.name} ${font.weight}...`);
        try {
            const buffer = await downloadFile(font.url);
            const base64 = buffer.toString('base64');
            cssContent += `
@font-face {
  font-family: '${font.name}';
  font-style: ${font.style};
  font-weight: ${font.weight};
  src: url(data:font/truetype;charset=utf-8;base64,${base64}) format('truetype');
}
`;
        } catch (err) {
            console.error(`Failed to download ${font.name} ${font.weight}:`, err);
        }
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, cssContent);
    console.log(`Font CSS written to ${outputFile}`);
}

generateFontCss();
