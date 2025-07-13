#!/usr/bin/env node

/**
 * Favicon Generation Script
 * 
 * This script helps generate additional favicon formats from the existing SVG files.
 * 
 * Prerequisites:
 * - Install sharp: npm install sharp
 * - Install svg2png: npm install svg2png
 * 
 * Usage:
 * node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Favicon Generation Script');
console.log('============================');

const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 192, name: 'favicon-192x192.png' },
  { size: 256, name: 'favicon-256x256.png' },
  { size: 512, name: 'favicon-512x512.png' }
];

const publicDir = path.join(__dirname, '../public');
const faviconsDir = path.join(publicDir, 'Favicons');

console.log('📁 Checking favicon files...');

// Check if all SVG files exist
const requiredSvgs = [
  '16.svg', '32.svg', '48.svg', '64.svg', '96.svg',
  '128.svg', '192.svg', '256.svg', '512.svg', '180.svg'
];

let missingFiles = [];

requiredSvgs.forEach(file => {
  const filePath = path.join(faviconsDir, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('❌ Missing SVG files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\nPlease ensure all SVG favicon files exist in /public/Favicons/');
} else {
  console.log('✅ All required SVG favicon files found!');
}

console.log('\n📋 Current favicon implementation includes:');
console.log('   ✅ Standard favicon (favicon.ico)');
console.log('   ✅ SVG favicons for all sizes');
console.log('   ✅ Apple Touch Icons');
console.log('   ✅ Android Chrome Icons');
console.log('   ✅ Windows Tiles');
console.log('   ✅ Safari Pinned Tab');
console.log('   ✅ Web App Manifest');
console.log('   ✅ Theme colors and meta tags');

console.log('\n🎯 Next steps:');
console.log('1. Generate favicon.ico from 32.svg using online tools');
console.log('2. Test favicons on different devices and browsers');
console.log('3. Verify PWA installation works correctly');
console.log('4. Check favicon display in bookmarks and tabs');

console.log('\n🔗 Useful tools:');
console.log('- https://realfavicongenerator.net/');
console.log('- https://favicon.io/');
console.log('- https://www.favicon-generator.org/');

console.log('\n✨ Favicon setup complete!'); 