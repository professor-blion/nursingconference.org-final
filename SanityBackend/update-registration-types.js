const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  apiVersion: '2023-05-03',
});

// The 8 approved registration types with proper structure
const approvedRegistrationTypes = [
  {
    _type: 'registrationTypes',
    name: 'Speaker/Poster (In-Person)',
    category: 'speaker-inperson',
    description: 'For conference speakers and poster presenters attending in person',
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
    name: 'Speaker/Poster (Virtual)',
    category: 'speaker-virtual',
    description: 'For conference speakers and poster presenters attending virtually',
    displayOrder: 2,
    isActive: true,
    benefits: [
      'Access to all virtual conference sessions',
      'Virtual networking opportunities',
      'Digital conference materials',
      'Certificate of participation',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Listener (In-Person)',
    category: 'listener-inperson',
    description: 'For attendees listening to presentations in person',
    displayOrder: 3,
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
    name: 'Listener (Virtual)',
    category: 'listener-virtual',
    description: 'For attendees listening to presentations virtually',
    displayOrder: 4,
    isActive: true,
    benefits: [
      'Access to all virtual conference sessions',
      'Digital conference materials',
      'Certificate of participation',
      'Virtual networking opportunities',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Student (In-Person)',
    category: 'student-inperson',
    description: 'For students attending the conference in person',
    displayOrder: 5,
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
    name: 'Student (Virtual)',
    category: 'student-virtual',
    description: 'For students attending the conference virtually',
    displayOrder: 6,
    isActive: true,
    benefits: [
      'Access to all virtual conference sessions',
      'Digital conference materials',
      'Certificate of participation',
      'Virtual student networking',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'E-poster (Virtual)',
    category: 'eposter-virtual',
    description: 'For electronic poster presentations in virtual format',
    displayOrder: 7,
    isActive: true,
    benefits: [
      'Virtual poster presentation slot',
      'Access to all virtual sessions',
      'Digital conference materials',
      'Certificate of participation',
    ],
  },
  {
    _type: 'registrationTypes',
    name: 'Exhibitor',
    category: 'exhibitor',
    description: 'For exhibitors showcasing products or services',
    displayOrder: 8,
    isActive: true,
    benefits: [
      'Exhibition space',
      'Access to all conference sessions',
      'Exhibitor networking events',
      'Conference materials',
      'Certificate of participation',
    ],
  },
];

async function updateRegistrationTypes() {
  try {
    console.log('🧹 Starting registration types cleanup...');

    // 1. First, deactivate all existing registration types
    console.log('📝 Deactivating existing registration types...');
    const existingTypes = await client.fetch('*[_type == "registrationTypes"]');

    for (const type of existingTypes) {
      await client
        .patch(type._id)
        .set({ isActive: false })
        .commit();
    }

    console.log(`✅ Deactivated ${existingTypes.length} existing registration types`);

    // 2. Create or update the 8 approved registration types
    console.log('🎫 Creating/updating approved registration types...');

    for (const regType of approvedRegistrationTypes) {
      // Check if a registration type with this category already exists
      const existing = await client.fetch(
        '*[_type == "registrationTypes" && category == $category][0]',
        { category: regType.category }
      );

      if (existing) {
        // Update existing registration type
        await client
          .patch(existing._id)
          .set({
            name: regType.name,
            category: regType.category,
            description: regType.description,
            displayOrder: regType.displayOrder,
            isActive: regType.isActive,
            benefits: regType.benefits,
          })
          .commit();

        console.log(`✅ Updated: ${regType.name}`);
      } else {
        // Create new registration type
        await client.create(regType);
        console.log(`✅ Created: ${regType.name}`);
      }
    }

    console.log('🎉 Registration types cleanup completed successfully!');
    console.log('📋 The following 8 registration types are now active:');
    approvedRegistrationTypes.forEach((type, index) => {
      console.log(`   ${index + 1}. ${type.name}`);
    });

  } catch (error) {
    console.error('❌ Error updating registration types:', error);
  }
}

// Run the update
updateRegistrationTypes();