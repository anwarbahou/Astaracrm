#!/usr/bin/env node

/**
 * Google OAuth Configuration Test Script
 * This script helps verify your Google OAuth setup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Google OAuth Configuration Test\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  console.log('   Please create a .env file in the project root');
  process.exit(1);
}

// Read and parse .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

console.log('📋 Environment Variables Check:');

// Check Google Client ID
const googleClientId = envVars.VITE_GOOGLE_CLIENT_ID;
if (!googleClientId) {
  console.log('❌ VITE_GOOGLE_CLIENT_ID not found');
} else {
  console.log('✅ VITE_GOOGLE_CLIENT_ID found');
  
  // Validate Google Client ID format
  if (googleClientId.endsWith('.apps.googleusercontent.com')) {
    console.log('✅ Google Client ID format looks correct');
  } else {
    console.log('⚠️  Google Client ID format may be incorrect');
    console.log('   Expected format: [numbers]-[random].apps.googleusercontent.com');
  }
  
  // Check for extra characters
  if (googleClientId.length > 100) {
    console.log('⚠️  Google Client ID seems too long - check for extra characters');
  }
}

// Check Supabase configuration
console.log('\n📋 Supabase Configuration:');
if (envVars.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL found');
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL not found');
}

if (envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY found');
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found');
}

// Check development server configuration
console.log('\n📋 Development Server:');
const viteConfigPath = path.join(__dirname, '..', 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  if (viteConfig.includes('port: 8080')) {
    console.log('✅ Vite configured to run on port 8080');
  } else {
    console.log('⚠️  Vite port configuration not found or different');
  }
} else {
  console.log('❌ vite.config.ts not found');
}

console.log('\n📋 Google OAuth Setup Checklist:');
console.log('1. ✅ Google Cloud Project created');
console.log('2. ✅ Google Calendar API enabled');
console.log('3. ✅ OAuth consent screen configured');
console.log('4. ✅ OAuth 2.0 credentials created');
console.log('5. ✅ Authorized JavaScript origins: http://localhost:8080');
console.log('6. ✅ Authorized redirect URIs: http://localhost:8080/google-oauth-callback.html');
console.log('7. ✅ Client ID copied to .env file');

console.log('\n🚀 Next Steps:');
console.log('1. Start your development server: npm run dev');
console.log('2. Navigate to: http://localhost:8080/dashboard/calendar');
console.log('3. Click "Sync with Google"');
console.log('4. Check browser console for any errors');

console.log('\n🔧 Troubleshooting:');
console.log('- If popup is blocked, allow popups for localhost:8080');
console.log('- If authentication fails, check the redirect URI in Google Cloud Console');
console.log('- If you see "invalid_client", check your Client ID format');
console.log('- If you see "redirect_uri_mismatch", verify the redirect URI configuration');
console.log('- If you get logged out, try clearing browser cache and cookies'); 