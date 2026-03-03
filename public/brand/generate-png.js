#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Try to use sharp, fall back to canvas if not available
let sharp;
let Canvas;

try {
  sharp = require('sharp');
  console.log('Using Sharp for PNG generation...');
} catch (err) {
  try {
    const { createCanvas, loadImage } = require('canvas');
    Canvas = { createCanvas, loadImage };
    console.log('Using Canvas for PNG generation...');
  } catch (err2) {
    console.error('Neither Sharp nor Canvas available. Installing sharp...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install sharp', { stdio: 'inherit' });
      sharp = require('sharp');
      console.log('Sharp installed and ready!');
    } catch (err3) {
      console.error('Failed to install Sharp. Please run: npm install sharp');
      process.exit(1);
    }
  }
}

const outputDir = __dirname;
const iconSvgPath = path.join(outputDir, 'logo-icon.svg');

// PNG specifications
const pngSpecs = [
  { name: 'logo-icon-512.png', size: 512 },
  { name: 'logo-icon-192.png', size: 192 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 }
];

async function generateWithSharp() {
  const svgBuffer = fs.readFileSync(iconSvgPath);
  
  for (const spec of pngSpecs) {
    try {
      await sharp(svgBuffer)
        .resize(spec.size, spec.size)
        .png({
          quality: 100,
          compressionLevel: 6,
          adaptiveFiltering: false
        })
        .toFile(path.join(outputDir, spec.name));
      
      console.log(`✅ Generated ${spec.name} (${spec.size}x${spec.size})`);
    } catch (err) {
      console.error(`❌ Failed to generate ${spec.name}:`, err.message);
    }
  }
}

async function generateWithCanvas() {
  // For Canvas approach, we'll create simplified PNG versions
  // since Canvas has limited SVG support
  
  for (const spec of pngSpecs) {
    try {
      const canvas = Canvas.createCanvas(spec.size, spec.size);
      const ctx = canvas.getContext('2d');
      
      // Create a simplified version of our icon
      const center = spec.size / 2;
      const scale = spec.size / 80; // Our SVG is 80x80
      
      // Background circle (light gray)
      ctx.beginPath();
      ctx.arc(center, center, center - 4 * scale, 0, 2 * Math.PI);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 0.5 * scale;
      ctx.stroke();
      
      // Main V shape (emerald)
      ctx.beginPath();
      ctx.fillStyle = '#059669';
      const vPath = new Path2D();
      // Simplified V shape
      vPath.moveTo(center - 15 * scale, center - 10 * scale);
      vPath.lineTo(center, center + 10 * scale);
      vPath.lineTo(center + 15 * scale, center - 10 * scale);
      vPath.lineTo(center + 12 * scale, center - 15 * scale);
      vPath.lineTo(center, center + 2 * scale);
      vPath.lineTo(center - 12 * scale, center - 15 * scale);
      vPath.closePath();
      ctx.fill(vPath);
      
      // Search circle (coral)
      ctx.beginPath();
      ctx.arc(center + 8 * scale, center - 5 * scale, 4 * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      
      // Search handle
      ctx.beginPath();
      ctx.moveTo(center + 11 * scale, center - 2 * scale);
      ctx.lineTo(center + 14 * scale, center + 1 * scale);
      ctx.stroke();
      
      // Convert to PNG
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join(outputDir, spec.name), buffer);
      
      console.log(`✅ Generated ${spec.name} (${spec.size}x${spec.size}) with Canvas`);
    } catch (err) {
      console.error(`❌ Failed to generate ${spec.name}:`, err.message);
    }
  }
}

async function main() {
  console.log('🎨 Generating PNG files from SVG...\n');
  
  // Check if SVG file exists
  if (!fs.existsSync(iconSvgPath)) {
    console.error('❌ logo-icon.svg not found!');
    process.exit(1);
  }
  
  if (sharp) {
    await generateWithSharp();
  } else if (Canvas) {
    await generateWithCanvas();
  } else {
    console.error('❌ No image processing library available');
    process.exit(1);
  }
  
  console.log('\n🎉 PNG generation complete!');
  console.log('\nGenerated files:');
  pngSpecs.forEach(spec => {
    const filePath = path.join(outputDir, spec.name);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`  📁 ${spec.name} (${(stats.size / 1024).toFixed(1)}KB)`);
    }
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };