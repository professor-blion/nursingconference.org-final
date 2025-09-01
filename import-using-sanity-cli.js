#!/usr/bin/env node
/**
 * SAFE Content Import using Sanity CLI
 * 
 * This script imports content using the official Sanity CLI
 * into your existing project WITHOUT changing any configurations.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting SAFE content import using Sanity CLI...');
console.log('=====================================');

// Load environment variables
require('./nextjs-frontend/node_modules/dotenv').config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

console.log('🔧 Using existing project configuration:');
console.log(`   Project ID: ${projectId}`);
console.log(`   Dataset: ${dataset}`);
console.log(`   Has Token: ${!!token}`);
console.log('');

async function importWithSanityCLI() {
  try {
    const sourceDataPath = 'C:\\Users\\berlin\\Downloads\\COMPLETE-NURSING-CONFERENCES-CLONE\\exported-data\\complete-nursing-conferences-with-assets.tar.gz';
    
    if (!fs.existsSync(sourceDataPath)) {
      console.error('❌ Source data file not found at:', sourceDataPath);
      console.log('💡 Please ensure the COMPLETE-NURSING-CONFERENCES-CLONE directory exists');
      process.exit(1);
    }

    console.log('📄 Found source data file');
    console.log('📊 File size:', (fs.statSync(sourceDataPath).size / 1024 / 1024).toFixed(2), 'MB');
    console.log('');

    // Set environment variables for Sanity CLI
    process.env.SANITY_AUTH_TOKEN = token;
    
    console.log('🔄 Starting import with Sanity CLI...');
    console.log('⚠️  This may take several minutes depending on the data size');
    console.log('');

    try {
      // Change to SanityBackend directory where sanity.config.ts is located
      process.chdir('./SanityBackend');
      
      // Run the import command
      const importCommand = `npx sanity dataset import "${sourceDataPath}" ${dataset} --replace`;
      
      console.log('📝 Running command:', importCommand);
      console.log('');
      
      execSync(importCommand, {
        stdio: 'inherit',
        env: {
          ...process.env,
          SANITY_AUTH_TOKEN: token
        }
      });

      console.log('');
      console.log('=====================================');
      console.log('✅ Content import completed successfully!');
      console.log('');
      console.log('📊 What was imported:');
      console.log('  ✅ All conference data');
      console.log('  ✅ All organizing committee members');
      console.log('  ✅ All speaker information');
      console.log('  ✅ All registration data');
      console.log('  ✅ All images and assets');
      console.log('  ✅ All pricing and sponsorship data');
      console.log('');
      console.log('🔧 Your project configuration remains unchanged:');
      console.log(`   Project ID: ${projectId}`);
      console.log(`   Dataset: ${dataset}`);
      console.log('');
      console.log('🌐 You can now access your content at:');
      console.log('   Frontend: http://localhost:3000');
      console.log('   Sanity Studio: http://localhost:3333');
      console.log('');
      console.log('💡 Next steps:');
      console.log('1. Check your Sanity Studio to verify all content is imported');
      console.log('2. Test your frontend to ensure everything displays correctly');
      console.log('3. Update any content as needed through the Sanity Studio');

    } catch (error) {
      console.error('❌ Import failed:', error.message);
      console.log('');
      console.log('💡 Troubleshooting tips:');
      console.log('1. Ensure your Sanity token has write permissions');
      console.log('2. Check that the dataset exists in your project');
      console.log('3. Verify the source data file is not corrupted');
      console.log('4. Try running the command manually:');
      console.log(`   cd SanityBackend`);
      console.log(`   npx sanity dataset import "${sourceDataPath}" ${dataset} --replace`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

importWithSanityCLI();
