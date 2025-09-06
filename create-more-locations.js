const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n'
});

// Additional sample locations
const additionalLocations = [
  {
    _type: 'mapLocation',
    title: 'New York Office',
    category: 'office',
    address: 'Jacob K. Javits Convention Center, 429 11th Ave, New York, NY 10001, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'Premier destination for technology and business conferences in North America.',
    isActive: true,
    priority: 85,
    markerColor: 'orange'
  },
  {
    _type: 'mapLocation',
    title: 'Singapore Event Venue',
    category: 'venue',
    address: 'Marina Bay Sands Expo and Convention Centre, 10 Bayfront Ave, Singapore 018956',
    latitude: 1.3521,
    longitude: 103.8198,
    description: 'Gateway to Asia-Pacific conferences and international symposiums.',
    isActive: true,
    priority: 80,
    markerColor: 'orange'
  }
];

async function createAdditionalLocations() {
  try {
    console.log('📍 Creating additional map locations...');
    
    for (const location of additionalLocations) {
      const result = await client.create(location);
      console.log(`✅ Created: ${result.title}`);
    }
    
    // Fetch all locations to show current state
    const allLocations = await client.fetch('*[_type == "mapLocation"] | order(priority desc)');
    console.log(`\n📊 Total map locations: ${allLocations.length}`);
    
    allLocations.forEach((loc, index) => {
      const status = loc.isActive ? '🟢' : '🔴';
      console.log(`${index + 1}. ${status} ${loc.title} (${loc.category}) - Priority: ${loc.priority}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdditionalLocations();
