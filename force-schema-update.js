import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './nextjs-frontend/.env.local' });

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

console.log('🔄 Forcing Sanity Studio schema update...');

async function forceSchemaUpdate() {
  try {
    // Create a temporary document to trigger schema recognition
    console.log('📝 Creating temporary document to trigger schema update...');
    
    const tempDoc = await client.create({
      _type: 'registrationTypes',
      name: 'TEMP_SCHEMA_UPDATE_TRIGGER',
      category: 'temp',
      earlyBirdPrice: 1,
      earlyBirdPriceEUR: 1,
      earlyBirdPriceGBP: 1,
      nextRoundPrice: 1,
      nextRoundPriceEUR: 1,
      nextRoundPriceGBP: 1,
      onSpotPrice: 1,
      onSpotPriceEUR: 1,
      onSpotPriceGBP: 1,
      isActive: false,
      displayOrder: 999,
      description: 'Temporary document to force schema update - will be deleted'
    });
    
    console.log('✅ Temporary document created:', tempDoc._id);
    
    // Wait a moment for the schema to register
    console.log('⏳ Waiting for schema to register...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Delete the temporary document
    console.log('🗑️ Deleting temporary document...');
    await client.delete(tempDoc._id);
    
    console.log('✅ Temporary document deleted');
    
    // Verify the schema fields are accessible
    console.log('🔍 Verifying schema fields are accessible...');
    const testQuery = `*[_type == 'registrationTypes'][0] {
      _id,
      name,
      earlyBirdPrice,
      earlyBirdPriceEUR,
      earlyBirdPriceGBP
    }`;
    
    const result = await client.fetch(testQuery);
    if (result && result.earlyBirdPriceEUR !== undefined) {
      console.log('✅ Schema fields are accessible in production!');
      console.log('💡 The hosted Sanity Studio should now recognize the new fields');
      console.log('🔄 Try refreshing the Sanity Studio page: https://nursing-conferences-cms.sanity.studio');
      console.log('⚠️  If fields still don\'t appear, clear browser cache and wait 5-10 minutes');
    } else {
      console.log('❌ Schema fields still not accessible');
    }
    
  } catch (error) {
    console.error('❌ Schema update failed:', error.message);
  }
}

forceSchemaUpdate();
