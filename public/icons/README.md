# PWA Icons Setup

To complete the PWA setup, you need to generate app icons in the following sizes and place them in the `public/icons/` folder:

## Required Icons

### Standard Icons (purpose: "any")
- `icon-72x72.png` - 72×72 pixels
- `icon-96x96.png` - 96×96 pixels
- `icon-128x128.png` - 128×128 pixels
- `icon-144x144.png` - 144×144 pixels
- `icon-152x152.png` - 152×152 pixels
- `icon-192x192.png` - 192×192 pixels
- `icon-384x384.png` - 384×384 pixels
- `icon-512x512.png` - 512×512 pixels

### Maskable Icons (purpose: "maskable")
- `icon-maskable-192x192.png` - 192×192 pixels with safe zone padding
- `icon-maskable-512x512.png` - 512×512 pixels with safe zone padding

## How to Generate Icons

### Option 1: Online Tools
1. Use [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) from PWABuilder
2. Use [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Use [Maskable.app](https://maskable.app/) for maskable icons

### Option 2: Using Your Logo
1. Take your high-resolution logo (at least 512x512)
2. Use an image editor to resize to each required size
3. For maskable icons, ensure your content is within the safe zone (centered 80% of the icon)

## Screenshots (Optional)

For a better install experience, add screenshots to `public/screenshots/`:
- `desktop-home.png` - 1280×720 (or similar wide ratio)
- `mobile-home.png` - 390×844 (or similar narrow ratio)

## Testing PWA

1. Run your app in production mode: `npm run build && npm start`
2. Open Chrome DevTools → Application tab
3. Check "Manifest" section for any errors
4. Check "Service Workers" section for registration status
5. Use Lighthouse to audit your PWA compliance
