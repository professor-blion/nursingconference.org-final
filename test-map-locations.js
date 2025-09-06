const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n'
});

async function testAndCreateMapLocations() {
  try {
    console.log('🔍 Testing Sanity connection and creating map locations...');
    
    // Test basic connection first
    const basicTest = await client.fetch('*[_type == "siteSettings"][0]._id');
    console.log('✅ Basic connection successful');
    
    // Check existing map locations
    const existing = await client.fetch('*[_type == "mapLocation"]');
    console.log(`📊 Found ${existing.length} existing map locations`);
    
    // Create a sample map location
    const sampleLocation = {
      _type: 'mapLocation',
      title: 'London Conference Center',
      category: 'conference',
      address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
      latitude: 51.5074,
      longitude: -0.1278,
      description: 'Major European hub for international conferences and academic events.',
      isActive: true,
      priority: 90,
      markerColor: 'orange'
    };
    
    console.log('📍 Creating sample map location...');
    const result = await client.create(sampleLocation);
    console.log('✅ Successfully created map location:', result.title);
    console.log('🆔 Location ID:', result._id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.body);
    }
  }
}

testAndCreateMapLocations();
