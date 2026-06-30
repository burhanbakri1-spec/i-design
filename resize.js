const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'images');
const outputDir = path.join(__dirname, 'public', 'images', 'resized');
const maxWidth = 390;
const maxHeight = 240;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
});

if (files.length === 0) {
  console.log('No .jpg or .png images found in public/images');
  process.exit(0);
}

console.log(`Found ${files.length} image(s) to process...\n`);

(async () => {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      const metadata = await sharp(inputPath).metadata();

      if (metadata.width <= maxWidth && metadata.height <= maxHeight) {
        fs.copyFileSync(inputPath, outputPath);
        console.log(`${file}: ${metadata.width}x${metadata.height}px — skipped (already within ${maxWidth}x${maxHeight})`);
      } else {
        await sharp(inputPath)
          .resize({ width: maxWidth, height: maxHeight, fit: 'cover' })
          .toFile(outputPath);
        console.log(`${file}: ${metadata.width}x${metadata.height}px → ${maxWidth}x${maxHeight}px`);
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone. Resized images saved to public/images/resized`);
})();
