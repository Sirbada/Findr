# PWA Icons

## Required Sizes

Generate PNG icons in the following sizes:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-180x180.png` (Apple Touch Icon)
- `icon-192x192.png` (main PWA icon)
- `icon-384x384.png`
- `icon-512x512.png` (main PWA icon)

## Shortcut Icons

- `shortcut-housing.png` (96x96)
- `shortcut-cars.png` (96x96)
- `shortcut-new.png` (96x96)

## Design Guidelines

- Background: Emerald (#059669)
- Icon: White "F" letter
- Border radius: ~16% of size
- Safe area for maskable icons: inner 80%

## Generate with ImageMagick

```bash
# Generate all sizes from a 512px source
for size in 72 96 128 144 152 180 192 384 512; do
  convert icon-512x512.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

## Online Tools

- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Maskable.app Editor](https://maskable.app/editor)
