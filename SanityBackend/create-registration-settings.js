const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
});

async function createRegistrationSettings() {
  try {
    console.log('Creating registration settings...');

    const registrationSettings = {
      _id: 'registrationSettings',
      _type: 'registrationSettings',
      title: 'Registration Settings',
      heroSection: {
        title: 'REGISTRATION',
        subtitle: 'Register for the International Conference on Nursing',
        breadcrumb: 'Home » Registration',
      },
      pricingDates: {
        earlyBirdEnd: '2025-02-28T23:59:59.000Z',
        nextRoundStart: '2025-03-01T00:00:00.000Z',
        nextRoundEnd: '2025-05-31T23:59:59.000Z',
        spotRegistrationStart: '2025-06-01T00:00:00.000Z',
      },
      registrationStatus: {
        isOpen: true,
        closedMessage: 'Registration is currently closed. Please check back later.',
      },
      conferenceDetails: {
        conferenceName: 'International Conference on Nursing',
        conferenceDate: '2025-06-23',
        venue: 'Hotel Indigo Kuala Lumpur On The Park',
        city: 'Kuala Lumpur',
        country: 'Malaysia',
      },
      contactInfo: {
        email: 'intelliglobalconferences@gmail.com',
        phone: '+1-234-567-8900',
        supportEmail: 'support@intelliglobalconferences.com',
      },
      paymentSettings: {
        currency: 'USD',
        currencySymbol: '$',
        paymentMethods: ['card', 'netbanking', 'upi'],
      },
      formSettings: {
        maxParticipants: 10,
        requiredFields: ['firstName', 'lastName', 'email', 'phoneNumber', 'country', 'fullPostalAddress'],
      },
    };

    const result = await client.createOrReplace(registrationSettings);
    console.log('✅ Registration settings created successfully:', result._id);
    
    return result;
  } catch (error) {
    console.error('❌ Error creating registration settings:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createRegistrationSettings()
    .then(() => {
      console.log('🎉 Registration settings setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createRegistrationSettings };
