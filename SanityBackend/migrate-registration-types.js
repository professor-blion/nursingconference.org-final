const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // You'll need to set this
  apiVersion: '2023-05-03',
});

// Standardized registration types with pricing
const standardizedRegistrationTypes = [
  {
    _type: 'registrationTypes',
    name: 'Speaker Registration',
    category: 'speaker',
    description: 'For conference speakers and presenters',
    displayOrder: 1,
    isActive: true,
    pricing: {
      earlyBird: {
        academiaPrice: 799,
        businessPrice: 999,
      },
      nextRound: {
        academiaPrice: 899,
        businessPrice: 1099,
      },
      spotRegistration: {
        academiaPrice: 999,
        businessPrice: 1199,
      },
    },
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
    pricing: {
      earlyBird: {
        academiaPrice: 699,
        businessPrice: 799,
      },
      nextRound: {
        academiaPrice: 799,
        businessPrice: 899,
      },
      spotRegistration: {
        academiaPrice: 899,
        businessPrice: 999,
      },
    },
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
    pricing: {
      earlyBird: {
        academiaPrice: 399,
        businessPrice: 399,
      },
      nextRound: {
        academiaPrice: 499,
        businessPrice: 499,
      },
      spotRegistration: {
        academiaPrice: 599,
        businessPrice: 599,
      },
    },
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
    pricing: {
      earlyBird: {
        academiaPrice: 499,
        businessPrice: 599,
      },
      nextRound: {
        academiaPrice: 599,
        businessPrice: 699,
      },
      spotRegistration: {
        academiaPrice: 699,
        businessPrice: 799,
      },
    },
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
    pricing: {
      earlyBird: {
        academiaPrice: 200,
        businessPrice: 300,
      },
      nextRound: {
        academiaPrice: 300,
        businessPrice: 400,
      },
      spotRegistration: {
        academiaPrice: 400,
        businessPrice: 500,
      },
    },
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
    pricing: {
      earlyBird: {
        academiaPrice: 250,
        businessPrice: 250,
      },
      nextRound: {
        academiaPrice: 300,
        businessPrice: 300,
      },
      spotRegistration: {
        academiaPrice: 350,
        businessPrice: 350,
      },
    },
    benefits: [
      'Access to social events',
      'Lunch and refreshments',
      'Welcome kit',
      'Networking opportunities',
    ],
  },
];

async function migrateRegistrationTypes() {
  try {
    console.log('Starting migration of registration types...');

    // First, delete all existing registration types
    console.log('Deleting existing registration types...');
    const existingTypes = await client.fetch('*[_type == "registrationTypes"]');

    if (existingTypes.length > 0) {
      const deletePromises = existingTypes.map(type =>
        client.delete(type._id)
      );
      await Promise.all(deletePromises);
      console.log(`Deleted ${existingTypes.length} existing registration types.`);
    }

    // Create new standardized registration types
    console.log('Creating new standardized registration types...');
    const createPromises = standardizedRegistrationTypes.map(type =>
      client.create(type)
    );

    const results = await Promise.all(createPromises);
    console.log(`Successfully created ${results.length} new registration types:`);

    results.forEach((result, index) => {
      console.log(`- ${standardizedRegistrationTypes[index].name} (ID: ${result._id})`);
    });

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  migrateRegistrationTypes();
}

module.exports = { migrateRegistrationTypes, standardizedRegistrationTypes };