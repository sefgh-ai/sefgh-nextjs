/**
 * PWA Icon Generator Script
 * Run with: node scripts/generate-icons.js
 *
 * Generates PNG icons from logo.jpg for PWA installation.
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const logoPath = path.join(__dirname, "..", "public", "logo.jpg");
const iconsDir = path.join(__dirname, "..", "public", "icons");

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

async function generateIcons() {
  console.log("Generating PWA icons from logo.jpg...\n");

  // Generate regular icons (with some rounding for app-like appearance)
  for (const size of sizes) {
    const filename = `icon-${size}x${size}.png`;
    await sharp(logoPath)
      .resize(size, size, { fit: "cover", position: "center" })
      .png()
      .toFile(path.join(iconsDir, filename));
    console.log(`✓ Created ${filename}`);
  }

  // Generate maskable icons (full bleed, no rounding - system applies mask)
  for (const size of maskableSizes) {
    const filename = `icon-maskable-${size}x${size}.png`;
    await sharp(logoPath)
      .resize(size, size, { fit: "cover", position: "center" })
      .png()
      .toFile(path.join(iconsDir, filename));
    console.log(`✓ Created ${filename}`);
  }

  console.log("\n✅ All PWA icons generated successfully!");
  console.log("📱 Your app should now be installable as a PWA.");
}

generateIcons().catch(console.error);
