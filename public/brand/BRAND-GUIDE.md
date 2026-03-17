# VoltFind Brand Guide

## Brand Overview

VoltFind is a premium international marketplace platform from Cameroon, connecting people with housing, vehicles, jobs, services, and land opportunities. As part of the Volt family ecosystem, VoltFind embodies futuristic innovation with African warmth and approachability.

**Brand Personality:** Apple-level clean, futuristic but warm, approachable, NOT aggressive tech

**Target Markets:** Cameroon → Pan-African → International

---

## Logo Family

### Primary Logo Files
- `logo-full.svg` - Horizontal full logo (light backgrounds)
- `logo-full-dark.svg` - Horizontal full logo (dark backgrounds)
- `logo-icon.svg` - Icon only (app icon, favicon)
- `logo-mono-white.svg` - White monochrome version
- `logo-mono-black.svg` - Black monochrome version

### PNG Exports (Generated)
- `logo-icon-512.png` - PWA app icon (512×512)
- `logo-icon-192.png` - PWA app icon (192×192)
- `favicon-32.png` - Favicon (32×32)
- `favicon-16.png` - Favicon (16×16)

---

## Color Palette

### Primary Colors
- **Emerald Primary:** `#059669` - Main brand color
- **Emerald Light:** `#10B981` - For dark backgrounds
- **Teal Accent:** `#14B8A6` - Gradient complement

### Secondary Colors
- **Coral Warm:** `#FF6B6B` - Warm accent color
- **Coral Light:** `#FF8E53` - Secondary accent
- **Coral Dark:** `#FF8A80` - For dark mode

### Neutral Colors
- **Gray Dark:** `#374151` - Primary text
- **Gray Medium:** `#6B7280` - Secondary text
- **Gray Light:** `#D1D5DB` - Text on dark backgrounds
- **White:** `#FFFFFF` - Backgrounds
- **Off-White:** `#F8FAFC` - Subtle backgrounds

### Gradients
```css
/* Primary Gradient */
linear-gradient(135deg, #059669 0%, #14B8A6 100%)

/* Accent Gradient */
linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)

/* Dark Mode Primary */
linear-gradient(135deg, #10B981 0%, #34D399 100%)
```

---

## Typography

### Recommended Fonts

**Primary:** System font stack for maximum compatibility
```css
font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

**Alternative Premium Options:**
- **Inter** - Modern, clean, excellent readability
- **Poppins** - Friendly, rounded, great for UI
- **Work Sans** - Professional, versatile

### Font Weights
- **Logo Text:** 700 (Bold) for "Volt", 400 (Regular) for "Find"
- **Headings:** 600-700
- **Body Text:** 400-500
- **Captions:** 400

### Typography Scale
- **Logo:** 28px
- **H1:** 32-48px
- **H2:** 24-32px
- **Body:** 16px
- **Small:** 14px
- **Caption:** 10-12px

---

## Logo Usage Guidelines

### Minimum Sizes
- **Full Logo:** Minimum width 120px
- **Icon Only:** Minimum size 16×16px
- **Favicon:** 16×16px and 32×32px versions provided

### Clear Space
Maintain clear space around the logo equal to the height of the "V" in the logomark on all sides.

### Background Usage

**Light Backgrounds:**
- Use `logo-full.svg` or `logo-icon.svg`
- Minimum contrast ratio of 4.5:1

**Dark Backgrounds:**
- Use `logo-full-dark.svg` with enhanced gradients
- Test visibility on different dark tones

**Monochrome Applications:**
- Use `logo-mono-white.svg` on dark backgrounds
- Use `logo-mono-black.svg` on light backgrounds
- For single-color printing or embossing

### Don'ts
- ❌ Don't distort or stretch the logo
- ❌ Don't change colors outside the approved palette
- ❌ Don't add drop shadows or effects (already built-in)
- ❌ Don't place on busy backgrounds without sufficient contrast
- ❌ Don't use gradients on very small sizes (<32px)

---

## Logo Concept & Symbolism

### Design Elements
1. **Stylized "V":** Represents the Volt family brand and lightning/energy
2. **Magnifying Glass:** Integrated search concept for "Find" functionality
3. **Location Dots:** Subtle marketplace/discovery elements
4. **Rounded Shapes:** Soft, approachable feel vs. aggressive tech
5. **Gradients:** Futuristic touch while maintaining warmth

### Color Meaning
- **Emerald Green:** Growth, prosperity, trust, nature (Africa)
- **Coral Accent:** Warmth, human connection, approachability
- **Gradients:** Innovation, technology, forward movement

### Cultural Sensitivity
- Colors chosen to resonate with African markets
- Warm tones balance high-tech feel
- Universal symbols (search, location) transcend language barriers

---

## File Formats & Technical Specs

### SVG Files
- Vector-based, infinitely scalable
- Optimized for web and print
- Include gradients and effects
- Compatible with all modern browsers

### PNG Exports
Generate using Node.js with these specifications:
```javascript
// PWA Icons
512×512px - High-res app icon
192×192px - Standard app icon

// Favicons
32×32px - Standard favicon
16×16px - Small favicon
```

### Implementation Notes
- SVGs include embedded fonts (system-ui fallback)
- All colors defined as hex values for consistency
- Gradients use CSS-compatible syntax
- Filters applied for subtle shadows and glows

---

## Application Examples

### Digital Applications
- Website headers and footers
- Mobile app icons
- Social media profiles
- Email signatures
- Digital business cards

### Print Applications
- Business cards and letterheads
- Banners and signage
- Marketing materials
- Vehicle graphics

### Merchandise
- T-shirts and apparel
- Promotional items
- Stickers and decals

---

## Volt Family Brand Harmony

VoltFind maintains visual consistency with the Volt ecosystem while having its unique identity:

**Shared Elements:**
- "Volt" typography treatment
- Emerald primary color
- Clean, rounded aesthetic
- Premium positioning

**Unique Elements:**
- Search/find iconography
- Marketplace-specific warm accents
- Discovery-focused symbolism

---

## Brand Voice & Messaging

**Tagline:** "DISCOVER • CONNECT • THRIVE"

**Key Messages:**
- "Find what matters in Africa"
- "Your trusted marketplace"
- "Connecting communities across Africa"
- "Where opportunity meets you"

**Tone of Voice:**
- Professional yet approachable
- Innovative but not intimidating  
- Inclusive and community-focused
- Reliable and trustworthy

---

*This brand guide ensures consistent application of the VoltFind identity across all touchpoints while maintaining the premium, warm, and approachable character that defines the Volt family.*