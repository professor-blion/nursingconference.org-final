const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  useCdn: false,
});

// Sample Google Maps locations data
const googleMapsLocations = [
  {
    _type: 'googleMapsLocation',
    title: 'London, United Kingdom',
    address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
    placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
    latitude: 51.5074,
    longitude: -0.1278,
    description: 'Major European hub for international conferences and academic events.',
    isActive: true,
    order: 1,
    markerColor: '#f97316',
  },
  {
    _type: 'googleMapsLocation',
    title: 'New York, USA',
    address: 'Jacob K. Javits Convention Center, 429 11th Ave, New York, NY 10001, USA',
    placeId: 'ChIJKxjxuaNZwokRVf__s8CPn-o',
    latitude: 40.7589,
    longitude: -74.0020,
    description: 'Premier destination for technology and business conferences in North America.',
    isActive: true,
    order: 2,
    markerColor: '#f97316',
  },
  {
    _type: 'googleMapsLocation',
    title: 'Singapore',
    address: 'Marina Bay Sands Expo and Convention Centre, 10 Bayfront Ave, Singapore 018956',
    placeId: 'ChIJ2V-Mo_l6jzERqZXGbIr3CLE',
    latitude: 1.2834,
    longitude: 103.8607,
    description: 'Gateway to Asia-Pacific conferences and international symposiums.',
    isActive: true,
    order: 3,
    markerColor: '#f97316',
  },
  {
    _type: 'googleMapsLocation',
    title: 'Dubai, UAE',
    address: 'Dubai World Trade Centre, Sheikh Zayed Rd, Dubai, UAE',
    placeId: 'ChIJIQBpAG2ahz4RhvL_4dMTBQQ',
    latitude: 25.2285,
    longitude: 55.3273,
    description: 'Middle East hub for global conferences and business events.',
    isActive: true,
    order: 4,
    markerColor: '#f97316',
  },
  {
    _type: 'googleMapsLocation',
    title: 'Tokyo, Japan',
    address: 'Tokyo International Forum, 3-5-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
    placeId: 'ChIJ51cu8IcbXWARiRtXIothAS4',
    latitude: 35.6762,
    longitude: 139.7633,
    description: 'Leading venue for technology and innovation conferences in Asia.',
    isActive: true,
    order: 5,
    markerColor: '#f97316',
  },
  {
    _type: 'googleMapsLocation',
    title: 'Sydney, Australia',
    address: 'International Convention Centre Sydney, 14 Darling Dr, Sydney NSW 2000, Australia',
    placeId: 'ChIJP3Sa8ziuEmsRUKgyFmh9AQM',
    latitude: -33.8688,
    longitude: 151.2093,
    description: 'Premier conference destination in the Asia-Pacific region.',
    isActive: true,
    order: 6,
    markerColor: '#f97316',
  },
  {
    _type: 'googleMapsLocation',
    title: 'Berlin, Germany',
    address: 'Messe Berlin, Messedamm 22, 14055 Berlin, Germany',
    placeId: 'ChIJAVkDPzdOqEcRcDteW0YgIQQ',
    latitude: 52.5050,
    longitude: 13.2762,
    description: 'Central European location for academic and research conferences.',
    isActive: true,
    order: 7,
    markerColor: '#f97316',
  },
  {
    _type: 'googleMapsLocation',
    title: 'Toronto, Canada',
    address: 'Metro Toronto Convention Centre, 255 Front St W, Toronto, ON M5V 2W6, Canada',
    placeId: 'ChIJpTvG15DL1IkRd8S0KlIVNiI',
    latitude: 43.6426,
    longitude: -79.3871,
    description: 'Major North American venue for international conferences.',
    isActive: true,
    order: 8,
    markerColor: '#f97316',
  },
];

async function populateGoogleMapsLocations() {
  try {
    console.log('🗺️ Starting to populate Google Maps locations...');

    // Check if locations already exist
    const existingLocations = await client.fetch('*[_type == "googleMapsLocation"]');
    
    if (existingLocations.length > 0) {
      console.log(`⚠️ Found ${existingLocations.length} existing Google Maps locations.`);
      console.log('Skipping population to avoid duplicates.');
      console.log('If you want to repopulate, delete existing locations first.');
      return;
    }

    // Create Google Maps locations
    const results = [];
    for (const location of googleMapsLocations) {
      console.log(`📍 Creating location: ${location.title}...`);
      
      const result = await client.create(location);
      results.push(result);
      
      console.log(`✅ Created location: ${result.title} (ID: ${result._id})`);
    }

    console.log(`\n🎉 Successfully created ${results.length} Google Maps locations!`);
    console.log('\n📋 Summary:');
    results.forEach((location, index) => {
      console.log(`${index + 1}. ${location.title} - ${location.address}`);
    });

    console.log('\n🚀 Next steps:');
    console.log('1. Get a Google Maps API key from: https://console.cloud.google.com/');
    console.log('2. Enable Maps JavaScript API and Places API');
    console.log('3. Add your API key to .env.local: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here');
    console.log('4. Start your Sanity Studio: npm run dev (in SanityBackend folder)');
    console.log('5. Visit http://localhost:3333 to manage locations');
    console.log('6. Start your Next.js app: npm run dev (in nextjs-frontend folder)');
    console.log('7. Visit http://localhost:3000 to see the interactive Google Map');

  } catch (error) {
    console.error('❌ Error populating Google Maps locations:', error);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('\n🔑 Authentication Error:');
      console.log('Please set your SANITY_API_TOKEN environment variable.');
      console.log('You can get a token from: https://sanity.io/manage');
    }
  }
}

// Run the population script
if (require.main === module) {
  populateGoogleMapsLocations();
}

module.exports = { populateGoogleMapsLocations, googleMapsLocations };
