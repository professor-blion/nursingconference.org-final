const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  apiVersion: '2023-05-03',
});

// 6 Standardized Registration Types matching your reference image
const standardizedRegistrationTypes = [
  {
    _type: 'registrationTypes',
    name: 'Speaker Registration',
    category: 'speaker',
    description: 'For conference speakers and presenters',
    displayOrder: 1,
    isActive: true,
    benefits: [
      'Access to all conference sessions',
      'Speaker networking events',
      'Conference materials',
      'Certificate of participation',
      'Lunch and refreshments',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Delegate',
    category: 'delegate',
    description: 'For conference attendees and delegates',
    displayOrder: 2,
    isActive: true,
    benefits: [
      'Access to all conference sessions',
      'Conference materials',
      'Certificate of participation',
      'Lunch and refreshments',
      'Networking opportunities',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Student',
    category: 'student',
    description: 'For students with valid student ID',
    displayOrder: 3,
    isActive: true,
    benefits: [
      'Access to all conference sessions',
      'Student networking events',
      'Conference materials',
      'Certificate of participation',
      'Lunch and refreshments',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Poster Presentation',
    category: 'poster',
    description: 'For poster presentation participants',
    displayOrder: 4,
    isActive: true,
    benefits: [
      'Access to all conference sessions',
      'Poster presentation opportunity',
      'Conference materials',
      'Certificate of participation',
      'Lunch and refreshments',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Online',
    category: 'online',
    description: 'For virtual conference attendance',
    displayOrder: 5,
    isActive: true,
    benefits: [
      'Access to live streaming sessions',
      'Digital conference materials',
      'Certificate of participation',
      'Recording access (limited time)',
      'Virtual networking opportunities',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Accompanying Person',
    category: 'accompanying',
    description: 'For accompanying persons/guests',
    displayOrder: 6,
    isActive: true,
    benefits: [
      'Access to social events',
      'Lunch and refreshments',
      'Welcome kit',
      'Networking opportunities',
    ],
  },
];

async function seedRegistrationTypes() {
  try {
    console.log('🌱 Starting registration types seeding...');

    // First, get existing registration types
    const existingTypes = await client.fetch('*[_type == "registrationTypes"]');
    console.log(`Found ${existingTypes.length} existing registration types.`);

    // Delete existing registration types
    if (existingTypes.length > 0) {
      console.log('🗑️ Deleting existing registration types...');
      const deletePromises = existingTypes.map(type => client.delete(type._id));
      await Promise.all(deletePromises);
      console.log(`✅ Deleted ${existingTypes.length} existing registration types.`);
    }

    // Create new standardized registration types
    console.log('📝 Creating 6 standardized registration types...');
    const createPromises = standardizedRegistrationTypes.map(type => client.create(type));
    
    const results = await Promise.all(createPromises);
    console.log(`✅ Successfully created ${results.length} new registration types:`);
    
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${standardizedRegistrationTypes[index].name} (${standardizedRegistrationTypes[index].category})`);
    });

    console.log('\n🎉 Registration types seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to Sanity Studio: https://eventapp.sanity.studio');
    console.log('2. Navigate to Registration Management > Registration Types');
    console.log('3. Add pricing for each registration type for all 3 periods');
    console.log('4. Verify the frontend displays all 6 types correctly');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  seedRegistrationTypes();
}

module.exports = { seedRegistrationTypes, standardizedRegistrationTypes };
