const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN || 'skYegVIAaFOFaI7V7mOXSkrnV0L1P1TNbcYNIlfZ0seOUeFLSM1ygvFaAchfi6IfYwtqslz0WrVjBQ7pjcOOB2Spjp2E0ujG16mN5VGppLRnvsFL29nFZHU2ceAy6bBBP8TBJ5TcsrT180LR6HTjC0gzjnmfXl9srhe8kJkx312tqhAekrDp'
});

// Sample map locations data
const mapLocations = [
  {
    _type: 'mapLocation',
    title: 'London Conference Center',
    category: 'conference',
    address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    description: 'Major European hub for international conferences and academic events. State-of-the-art facilities with modern technology.',
    isActive: true,
    priority: 90,
    markerColor: 'orange'
  },
  {
    _type: 'mapLocation',
    title: 'New York Office',
    category: 'office',
    address: 'Jacob K. Javits Convention Center, 429 11th Ave, New York, NY 10001, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'Premier destination for technology and business conferences in North America. Located in the heart of Manhattan.',
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
    description: 'Gateway to Asia-Pacific conferences and international symposiums. Iconic waterfront location.',
    isActive: true,
    priority: 80,
    markerColor: 'orange'
  },
  {
    _type: 'mapLocation',
    title: 'Dubai Regional Office',
    category: 'office',
    address: 'Dubai World Trade Centre, Sheikh Zayed Rd, Dubai, UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    description: 'Middle East hub for global conferences and business events. Modern facilities in the business district.',
    isActive: true,
    priority: 75,
    markerColor: 'orange'
  },
  {
    _type: 'mapLocation',
    title: 'Tokyo Innovation Hub',
    category: 'partner',
    address: 'Tokyo International Forum, 3-5-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    description: 'Leading venue for technology and innovation conferences in Asia. Central Tokyo location.',
    isActive: true,
    priority: 70,
    markerColor: 'orange'
  }
];

async function populateMapLocations() {
  try {
    console.log('🗺️ Starting to populate map locations...');

    // Delete existing map locations
    console.log('🧹 Cleaning existing map locations...');
    const existingLocations = await client.fetch('*[_type == "mapLocation"]');

    if (existingLocations.length > 0) {
      const deletePromises = existingLocations.map(location =>
        client.delete(location._id)
      );
      await Promise.all(deletePromises);
      console.log(`✅ Deleted ${existingLocations.length} existing map locations`);
    }

    // Create new map locations
    console.log('📍 Creating new map locations...');
    const createPromises = mapLocations.map(location =>
      client.create(location)
    );

    const results = await Promise.all(createPromises);
    console.log(`✅ Successfully created ${results.length} map locations`);

    // Display created locations
    console.log('\n📋 Created Map Locations:');
    results.forEach((location, index) => {
      console.log(`${index + 1}. ${location.title} (${location.category}) - ${location.address.substring(0, 50)}...`);
    });

    console.log('\n🎉 Map locations population completed successfully!');
    console.log('💡 You can now manage these locations in your Sanity Studio under "Map Locations"');

  } catch (error) {
    console.error('❌ Error populating map locations:', error);
    process.exit(1);
  }
}

// Run the population script
populateMapLocations();