const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')

const EMERALD_GREEN = '#059669'
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const appleSize = 180
const maskableSize = [192, 512]

async function createSVGIcon(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.1 : 0 // 10% padding for maskable icons
  const iconSize = size - (padding * 2)
  const fontSize = iconSize * 0.6 // Font size relative to icon size
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${EMERALD_GREEN}" rx="${size * 0.1}"/>
      <text 
        x="${size / 2}" 
        y="${size / 2 + fontSize * 0.3}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="middle">F</text>
    </svg>
  `
}

async function generateIcons() {
  try {
    // Ensure icons directory exists
    const iconsDir = path.join(__dirname, '..', 'public', 'icons')
    await fs.mkdir(iconsDir, { recursive: true })
    
    console.log('🎨 Generating PWA icons...')
    
    // Generate all standard sizes
    for (const size of sizes) {
      const isMaskable = maskableSize.includes(size)
      const svg = await createSVGIcon(size, isMaskable)
      
      await sharp(Buffer.from(svg))
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`))
      
      console.log(`✅ Generated icon-${size}x${size}.png${isMaskable ? ' (maskable)' : ''}`)
    }
    
    // Generate Apple Touch Icon (180x180)
    const appleSvg = await createSVGIcon(appleSize)
    await sharp(Buffer.from(appleSvg))
      .png()
      .toFile(path.join(iconsDir, `apple-touch-icon.png`))
    
    console.log(`✅ Generated apple-touch-icon.png (${appleSize}x${appleSize})`)
    
    // Generate favicon.ico (multiple sizes)
    const favicon32Svg = await createSVGIcon(32)
    await sharp(Buffer.from(favicon32Svg))
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'favicon-32x32.png'))
    
    const favicon16Svg = await createSVGIcon(16)
    await sharp(Buffer.from(favicon16Svg))
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'favicon-16x16.png'))
    
    console.log('✅ Generated favicon files')
    
    // Generate Safari pinned tab SVG
    const safariSvg = `
      <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 17C0 7.6 7.6 0 17 0h158c9.4 0 17 7.6 17 17v158c0 9.4-7.6 17-17 17H17c-9.4 0-17-7.6-17-17V17z" fill="black"/>
        <text x="96" y="130" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white" text-anchor="middle">F</text>
      </svg>
    `
    
    await fs.writeFile(path.join(iconsDir, 'safari-pinned-tab.svg'), safariSvg.trim())
    console.log('✅ Generated safari-pinned-tab.svg')
    
    // Generate some placeholder OG images for categories
    const ogSizes = [{ name: 'og-image', width: 1200, height: 630 }]
    const categories = ['housing', 'cars', 'terrain', 'emplois', 'services']
    
    for (const category of categories) {
      const ogSvg = `
        <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${EMERALD_GREEN};stop-opacity:1" />
              <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#grad)"/>
          <circle cx="900" cy="150" r="100" fill="rgba(255,255,255,0.1)"/>
          <circle cx="1050" cy="400" r="60" fill="rgba(255,255,255,0.05)"/>
          <text x="100" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">Findr</text>
          <text x="100" y="280" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.9)">${category === 'emplois' ? 'Emplois' : category === 'services' ? 'Services' : category === 'housing' ? 'Immobilier' : category === 'cars' ? 'Véhicules' : 'Terrains'} au Cameroun</text>
          <text x="100" y="450" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.8)">Trouvez facilement ce que vous cherchez</text>
          <text x="100" y="500" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.8)">à Douala, Yaoundé et partout au Cameroun</text>
        </svg>
      `
      
      await sharp(Buffer.from(ogSvg))
        .png()
        .toFile(path.join(__dirname, '..', 'public', `og-${category}.jpg`))
      
      console.log(`✅ Generated og-${category}.jpg`)
    }
    
    // Generate main OG image
    const mainOgSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${EMERALD_GREEN};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#mainGrad)"/>
        <circle cx="900" cy="150" r="100" fill="rgba(255,255,255,0.1)"/>
        <circle cx="1050" cy="400" r="60" fill="rgba(255,255,255,0.05)"/>
        <text x="100" y="200" font-family="Arial, sans-serif" font-size="84" font-weight="bold" fill="white">Findr</text>
        <text x="100" y="280" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.9)">Trouvez tout au Cameroun</text>
        <text x="100" y="400" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.8)">Logements • Voitures • Emplois • Services</text>
        <text x="100" y="450" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.8)">Une seule plateforme pour le Cameroun</text>
      </svg>
    `
    
    await sharp(Buffer.from(mainOgSvg))
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'og-image.jpg'))
    
    console.log('✅ Generated og-image.jpg')
    
    console.log('🎉 All icons generated successfully!')
    
  } catch (error) {
    console.error('❌ Error generating icons:', error)
    process.exit(1)
  }
}

// Generate placeholder screenshots for PWA manifest
async function generateScreenshots() {
  try {
    const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots')
    await fs.mkdir(screenshotsDir, { recursive: true })
    
    console.log('📱 Generating PWA screenshots...')
    
    // Desktop screenshot (1280x720)
    const desktopSvg = `
      <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
        <rect width="1280" height="720" fill="#f9fafb"/>
        
        <!-- Header -->
        <rect width="1280" height="64" fill="white"/>
        <rect x="40" y="20" width="32" height="24" rx="4" fill="${EMERALD_GREEN}"/>
        <text x="80" y="38" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1f2937">Findr</text>
        
        <!-- Hero section -->
        <rect y="64" width="1280" height="300" fill="url(#heroGrad)"/>
        <defs>
          <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <text x="80" y="150" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">Trouvez tout au Cameroun</text>
        <text x="80" y="200" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">Logements, voitures, emplois — une seule plateforme</text>
        
        <!-- Search bar -->
        <rect x="80" y="240" width="800" height="60" rx="30" fill="white"/>
        <text x="110" y="275" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">Que cherchez-vous ?</text>
        
        <!-- Content cards -->
        <rect x="80" y="400" width="280" height="200" rx="12" fill="white"/>
        <rect x="90" y="410" width="260" height="120" rx="8" fill="#f3f4f6"/>
        <rect x="90" y="540" width="120" height="20" rx="4" fill="${EMERALD_GREEN}"/>
        
        <rect x="400" y="400" width="280" height="200" rx="12" fill="white"/>
        <rect x="410" y="410" width="260" height="120" rx="8" fill="#f3f4f6"/>
        <rect x="410" y="540" width="120" height="20" rx="4" fill="${EMERALD_GREEN}"/>
        
        <rect x="720" y="400" width="280" height="200" rx="12" fill="white"/>
        <rect x="730" y="410" width="260" height="120" rx="8" fill="#f3f4f6"/>
        <rect x="730" y="540" width="120" height="20" rx="4" fill="${EMERALD_GREEN}"/>
      </svg>
    `
    
    await sharp(Buffer.from(desktopSvg))
      .png()
      .toFile(path.join(screenshotsDir, 'home.png'))
    
    console.log('✅ Generated desktop screenshot (home.png)')
    
    // Mobile screenshot (750x1334)
    const mobileSvg = `
      <svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
        <rect width="750" height="1334" fill="#f9fafb"/>
        
        <!-- Header -->
        <rect width="750" height="64" fill="white"/>
        <rect x="20" y="20" width="32" height="24" rx="4" fill="${EMERALD_GREEN}"/>
        <text x="60" y="38" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1f2937">Findr</text>
        
        <!-- Hero section -->
        <rect y="64" width="750" height="400" fill="url(#mobileHeroGrad)"/>
        <defs>
          <linearGradient id="mobileHeroGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <text x="40" y="150" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">Trouvez tout</text>
        <text x="40" y="185" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">au Cameroun</text>
        <text x="40" y="230" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">Une seule plateforme pour tous vos besoins</text>
        
        <!-- Search bar -->
        <rect x="40" y="300" width="670" height="50" rx="25" fill="white"/>
        <text x="65" y="330" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Que cherchez-vous ?</text>
        
        <!-- Category cards -->
        <rect x="40" y="500" width="320" height="180" rx="12" fill="white"/>
        <rect x="50" y="520" width="300" height="100" rx="8" fill="#f3f4f6"/>
        <text x="50" y="640" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">🏠 Immobilier</text>
        <text x="50" y="660" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Appartements, maisons...</text>
        
        <rect x="390" y="500" width="320" height="180" rx="12" fill="white"/>
        <rect x="400" y="520" width="300" height="100" rx="8" fill="#f3f4f6"/>
        <text x="400" y="640" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">🚗 Véhicules</text>
        <text x="400" y="660" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Voitures, motos...</text>
        
        <rect x="40" y="720" width="320" height="180" rx="12" fill="white"/>
        <rect x="50" y="740" width="300" height="100" rx="8" fill="#f3f4f6"/>
        <text x="50" y="860" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">💼 Emplois</text>
        <text x="50" y="880" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">CDI, CDD, freelance...</text>
        
        <rect x="390" y="720" width="320" height="180" rx="12" fill="white"/>
        <rect x="400" y="740" width="300" height="100" rx="8" fill="#f3f4f6"/>
        <text x="400" y="860" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">🔧 Services</text>
        <text x="400" y="880" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Tous les services...</text>
      </svg>
    `
    
    await sharp(Buffer.from(mobileSvg))
      .png()
      .toFile(path.join(screenshotsDir, 'mobile-home.png'))
    
    console.log('✅ Generated mobile screenshot (mobile-home.png)')
    
    console.log('📱 Screenshots generated successfully!')
    
  } catch (error) {
    console.error('❌ Error generating screenshots:', error)
  }
}

// Run the generation
if (require.main === module) {
  (async () => {
    await generateIcons()
    await generateScreenshots()
  })()
}

module.exports = { generateIcons, generateScreenshots }