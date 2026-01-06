#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Studixa for local development...\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
    console.log('⚠️  Please edit .env with your Supabase credentials\n');
  } else {
    console.log('❌ .env.example not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check if Supabase CLI is installed
try {
  execSync('supabase --version', { stdio: 'ignore' });
  console.log('✅ Supabase CLI is installed\n');
} catch (error) {
  console.log('❌ Supabase CLI not found');
  console.log('📦 Install it with: npm install -g supabase');
  console.log('Or visit: https://supabase.com/docs/guides/cli\n');
}

// Instructions
console.log('📋 Next Steps:\n');
console.log('1. Edit .env file with your Supabase credentials');
console.log('2. Choose your setup:');
console.log('   a) Cloud Supabase:');
console.log('      - Get credentials from https://app.supabase.com');
console.log('      - Run: supabase link --project-ref YOUR_PROJECT_ID');
console.log('      - Run: supabase db push');
console.log('   b) Local Supabase:');
console.log('      - Run: npm run supabase:start');
console.log('      - Run: npm run supabase:reset');
console.log('3. Install dependencies: npm install');
console.log('4. Start development: npm run dev');
console.log('\n✨ Happy coding!\n');
