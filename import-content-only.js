#!/usr/bin/env node
/**
 * SAFE Content Import Script
 * 
 * This script imports ONLY the content data from the complete clone
 * into your existing Sanity project WITHOUT changing any API keys,
 * project IDs, or configurations.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('./nextjs-frontend/node_modules/@sanity/client');

console.log('🚀 Starting SAFE content import...');
console.log('=====================================');

// Use existing project credentials from .env
require('./nextjs-frontend/node_modules/dotenv').config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

console.log('🔧 Using existing project configuration:');
console.log(`   Project ID: ${client.config().projectId}`);
console.log(`   Dataset: ${client.config().dataset}`);
console.log(`   Has Token: ${!!client.config().token}`);
console.log('');

async function importContentSafely() {
  try {
    const sourceDataPath = 'C:\\Users\\berlin\\Downloads\\COMPLETE-NURSING-CONFERENCES-CLONE\\exported-data\\complete-nursing-conferences-backup.ndjson';
    
    if (!fs.existsSync(sourceDataPath)) {
      console.error('❌ Source data file not found at:', sourceDataPath);
      console.log('💡 Please ensure the COMPLETE-NURSING-CONFERENCES-CLONE directory exists');
      process.exit(1);
    }

    console.log('📄 Reading source data...');
    const sourceData = fs.readFileSync(sourceDataPath, 'utf8');
    const documents = sourceData.trim().split('\n').map(line => JSON.parse(line));
    
    console.log(`📊 Found ${documents.length} documents to import`);
    
    // Filter out system documents and assets, keep only content
    const contentDocuments = documents.filter(doc => {
      // Skip system documents
      if (doc._id.startsWith('_')) return false;
      
      // Skip asset documents (we'll handle them separately)
      if (doc._type === 'sanity.imageAsset' || doc._type === 'sanity.fileAsset') return false;
      
      // Keep content documents
      return true;
    });

    console.log(`📝 Filtered to ${contentDocuments.length} content documents`);
    
    // Group documents by type for better organization
    const documentsByType = {};
    contentDocuments.forEach(doc => {
      if (!documentsByType[doc._type]) {
        documentsByType[doc._type] = [];
      }
      documentsByType[doc._type].push(doc);
    });

    console.log('📋 Document types found:');
    Object.keys(documentsByType).forEach(type => {
      console.log(`   ${type}: ${documentsByType[type].length} documents`);
    });
    console.log('');

    // Import documents in batches
    console.log('🔄 Starting import process...');
    let importedCount = 0;
    let skippedCount = 0;

    for (const [docType, docs] of Object.entries(documentsByType)) {
      console.log(`\n📝 Importing ${docType} documents...`);
      
      for (const doc of docs) {
        try {
          // Check if document already exists
          const existing = await client.getDocument(doc._id);
          
          if (existing) {
            console.log(`   ⏭️  Skipping existing: ${doc._id}`);
            skippedCount++;
            continue;
          }
        } catch (error) {
          // Document doesn't exist, which is what we want
        }

        try {
          // Clean the document for import
          const cleanDoc = { ...doc };
          
          // Remove any system fields that shouldn't be imported
          delete cleanDoc._rev;
          delete cleanDoc._updatedAt;
          delete cleanDoc._createdAt;
          
          // Import the document
          await client.createOrReplace(cleanDoc);
          console.log(`   ✅ Imported: ${doc._id} (${doc.title || doc.name || 'untitled'})`);
          importedCount++;
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.log(`   ❌ Failed to import ${doc._id}: ${error.message}`);
        }
      }
    }

    console.log('\n=====================================');
    console.log('✅ Content import completed!');
    console.log(`📊 Results:`);
    console.log(`   ✅ Imported: ${importedCount} documents`);
    console.log(`   ⏭️  Skipped: ${skippedCount} existing documents`);
    console.log(`   📝 Total processed: ${contentDocuments.length} documents`);
    console.log('');
    console.log('🔧 Your project configuration remains unchanged:');
    console.log(`   Project ID: ${client.config().projectId}`);
    console.log(`   Dataset: ${client.config().dataset}`);
    console.log('');
    console.log('🌐 You can now access your content at:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Sanity Studio: http://localhost:3333');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

importContentSafely();
