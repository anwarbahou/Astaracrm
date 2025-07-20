#!/usr/bin/env node

/**
 * Check Redirect URI Configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Redirect URI Configuration Check\n');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const googleClientId = envVars.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.log('❌ VITE_GOOGLE_CLIENT_ID not found');
  process.exit(1);
}

// Simulate the same logic as the app
const currentOrigin = 'http://localhost:8080';
const redirectUri = `${currentOrigin}/google-oauth-callback.html`;

console.log('📋 Current Configuration:');
console.log(`✅ Google Client ID: ${googleClientId}`);
console.log(`✅ Redirect URI: ${redirectUri}`);
console.log(`✅ Origin: ${currentOrigin}`);

console.log('\n📋 Google Cloud Console Configuration Required:');
console.log('1. Go to: https://console.cloud.google.com/');
console.log('2. Navigate to: APIs & Services > Credentials');
console.log('3. Edit your OAuth 2.0 Client ID');
console.log('4. In "Authorized redirect URIs" section:');
console.log('   - REMOVE: http://localhost:8080/dashboard/calendar');
console.log('   - ADD: http://localhost:8080/google-oauth-callback.html');
console.log('5. Click "Save"');

console.log('\n🔧 After updating Google Cloud Console:');
console.log('1. Wait 1-2 minutes for changes to propagate');
console.log('2. Try the sync again');
console.log('3. If still failing, clear browser cache and try again');

console.log('\n⚠️  Common Issues:');
console.log('- Extra spaces in the redirect URI');
console.log('- Missing or extra characters');
console.log('- Wrong port number (should be 8080)');
console.log('- Wrong protocol (should be http:// for localhost)'); 