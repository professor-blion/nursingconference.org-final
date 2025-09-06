const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

console.log('🔑 Using Sanity token:', process.env.SANITY_API_TOKEN ? 'Token found' : 'No token found');

async function populateRegistrationData() {
  try {
    console.log('🚀 Populating registration system data...');

    // 1. Create Pricing Periods first
    console.log('📅 Creating pricing periods...');
    const pricingPeriods = await Promise.all([
      client.create({
        _type: 'pricingPeriods',
        periodId: 'earlyBird',
        title: 'Early Bird Registration',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-04-26T23:59:59Z',
        isActive: true,
        displayOrder: 1,
        description: 'Special early bird pricing for early registrants',
        highlightColor: { hex: '#10b981' }
      }),
      client.create({
        _type: 'pricingPeriods',
        periodId: 'nextRound',
        title: 'Mid Term Registration',
        startDate: '2025-04-27T00:00:00Z',
        endDate: '2025-07-22T23:59:59Z',
        isActive: true,
        displayOrder: 2,
        description: 'Standard pricing for mid-term registration',
        highlightColor: { hex: '#f59e0b' }
      }),
      client.create({
        _type: 'pricingPeriods',
        periodId: 'spotRegistration',
        title: 'Onspot Registration',
        startDate: '2025-07-23T00:00:00Z',
        endDate: '2025-12-31T23:59:59Z',
        isActive: true,
        displayOrder: 3,
        description: 'Last minute registration pricing',
        highlightColor: { hex: '#ef4444' }
      })
    ]);

    console.log('✅ Pricing periods created:', pricingPeriods.map(p => p._id));

    // 2. Create Registration Settings
    const registrationSettings = await client.create({
      _type: 'registrationSettings',
      title: 'Conference Registration Settings',
      pricingDates: {
        earlyBirdEnd: '2025-02-28',
        nextRoundStart: '2025-03-01',
        nextRoundEnd: '2025-05-31',
        spotRegistrationStart: '2025-06-01',
      },
      registrationStatus: {
        isOpen: true,
        closedMessage: 'Registration is currently closed. Please check back later.',
      },
      conferenceDetails: {
        conferenceName: 'International Nursing Conference 2025',
        conferenceDate: '2025-07-15',
        venue: 'Grand Convention Center',
        city: 'New York',
        country: 'USA',
      },
      contactInfo: {
        email: 'intelliglobalconferences@gmail.com',
        phone: '+919876543210',
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
        abstractCategories: [
          { value: 'poster', label: 'Poster' },
          { value: 'oral', label: 'Oral' },
          { value: 'delegate', label: 'Delegate' },
          { value: 'other', label: 'Other' },
        ],
      },
    });

    console.log('✅ Registration Settings created:', registrationSettings._id);

    // 3. Create Registration Types with proper pricing structure
    console.log('🎫 Creating registration types...');
    const registrationTypesData = [
      {
        name: 'Speaker/Poster (In-Person)',
        category: 'speaker-inperson',
        description: 'For conference speakers and poster presenters',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 799,
            businessPrice: 899,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 899,
            businessPrice: 999,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 999,
            businessPrice: 1099,
            isActive: true
          }
        ],
        benefits: [
          'Access to all conference sessions',
          'Speaker dinner invitation',
          'Conference materials',
          'Certificate of participation',
          'Networking opportunities',
        ],
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'Speaker/Poster (Virtual)',
        category: 'speaker-virtual',
        description: 'For virtual conference speakers and poster presenters',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 399,
            businessPrice: 499,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 459,
            businessPrice: 599,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 599,
            businessPrice: 699,
            isActive: true
          }
        ],
        benefits: [
          'Access to all virtual conference sessions',
          'Digital conference materials',
          'Certificate of participation',
          'Virtual networking opportunities',
        ],
        isActive: true,
        displayOrder: 2,
      },
      {
        name: 'Listener (In-Person)',
        category: 'listener-inperson',
        description: 'For conference attendees and delegates',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 859,
            businessPrice: 999,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 999,
            businessPrice: 1099,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 1099,
            businessPrice: 1199,
            isActive: true
          }
        ],
        benefits: [
          'Access to all conference sessions',
          'Conference materials',
          'Certificate of participation',
          'Networking opportunities',
        ],
        isActive: true,
        displayOrder: 3,
      },
      {
        name: 'Listener (Virtual)',
        category: 'listener-virtual',
        description: 'Virtual attendance with live streaming access',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 499,
            businessPrice: 599,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 599,
            businessPrice: 699,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 699,
            businessPrice: 799,
            isActive: true
          }
        ],
        benefits: [
          'Live streaming access to all sessions',
          'Digital conference materials',
          'Certificate of participation',
          'Access to recorded sessions for 30 days',
        ],
        isActive: true,
        displayOrder: 4,
      },
      {
        name: 'Student (In-Person)',
        category: 'student-inperson',
        description: 'Special pricing for students with valid ID',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 559,
            businessPrice: 699,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 699,
            businessPrice: 799,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 799,
            businessPrice: 899,
            isActive: true
          }
        ],
        benefits: [
          'Access to all conference sessions',
          'Conference materials',
          'Certificate of participation',
          'Student networking events',
        ],
        isActive: true,
        displayOrder: 5,
      },
      {
        name: 'Student (Virtual)',
        category: 'student-virtual',
        description: 'Virtual student participation',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 259,
            businessPrice: 399,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 399,
            businessPrice: 499,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 499,
            businessPrice: 599,
            isActive: true
          }
        ],
        benefits: [
          'Live streaming access to all sessions',
          'Digital conference materials',
          'Certificate of participation',
          'Student virtual networking events',
        ],
        isActive: true,
        displayOrder: 6,
      },
      {
        name: 'E-poster (Virtual)',
        category: 'eposter-virtual',
        description: 'Virtual poster presentation',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 399,
            businessPrice: 499,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 499,
            businessPrice: 599,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 599,
            businessPrice: 699,
            isActive: true
          }
        ],
        benefits: [
          'Virtual poster presentation slot',
          'Access to all virtual sessions',
          'Digital conference materials',
          'Certificate of participation',
        ],
        isActive: true,
        displayOrder: 7,
      },
      {
        name: 'Exhibitor',
        category: 'exhibitor',
        description: 'Exhibition booth and conference access',
        pricing: [
          {
            pricingPeriod: { _ref: pricingPeriods[0]._id },
            academiaPrice: 1999,
            businessPrice: 2500,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[1]._id },
            academiaPrice: 2500,
            businessPrice: 3000,
            isActive: true
          },
          {
            pricingPeriod: { _ref: pricingPeriods[2]._id },
            academiaPrice: 3000,
            businessPrice: 3500,
            isActive: true
          }
        ],
        benefits: [
          'Exhibition booth space',
          'Access to all conference sessions',
          'Conference materials',
          'Networking opportunities',
          'Company logo in conference materials',
        ],
        isActive: true,
        displayOrder: 8,
      },
    ];

    const registrationTypes = [];
    for (const regTypeData of registrationTypesData) {
      const created = await client.create({
        _type: 'registrationTypes',
        ...regTypeData
      });
      registrationTypes.push(created);
      console.log(`✅ Registration Type created: ${created.name} (${created._id})`);
    }

    // 3. Create Sponsorship Tiers
    const sponsorshipTiers = [
      {
        _type: 'sponsorshipTiersRegistration',
        tierName: 'Platinum Sponsor',
        tierLevel: 'platinum',
        price: 5000,
        description: 'Premium sponsorship with maximum visibility and benefits',
        benefits: [
          { benefit: 'Logo on all conference materials', description: 'Prominent placement on banners, programs, and digital displays' },
          { benefit: 'Exhibition booth (premium location)', description: '3x3 meter booth in prime location' },
          { benefit: 'Speaking opportunity', description: '20-minute presentation slot' },
          { benefit: 'Welcome reception sponsorship', description: 'Exclusive branding at welcome event' },
        ],
        inclusions: {
          registrationIncluded: true,
          accommodationIncluded: true,
          numberOfRegistrations: 5,
          accommodationNights: 3,
        },
        displayOrder: 1,
        isActive: true,
        highlightColor: 'gold',
      },
      {
        _type: 'sponsorshipTiersRegistration',
        tierName: 'Gold Sponsor',
        tierLevel: 'gold',
        price: 3000,
        description: 'High-visibility sponsorship with excellent benefits',
        benefits: [
          { benefit: 'Logo on conference materials', description: 'Placement on programs and digital displays' },
          { benefit: 'Exhibition booth', description: '3x3 meter booth' },
          { benefit: 'Networking session sponsorship', description: 'Branding at networking events' },
        ],
        inclusions: {
          registrationIncluded: true,
          accommodationIncluded: true,
          numberOfRegistrations: 3,
          accommodationNights: 3,
        },
        displayOrder: 2,
        isActive: true,
        highlightColor: 'gold',
      },
      {
        _type: 'sponsorshipTiersRegistration',
        tierName: 'Silver Sponsor',
        tierLevel: 'silver',
        price: 2000,
        description: 'Great value sponsorship with good visibility',
        benefits: [
          { benefit: 'Logo on conference program', description: 'Listing in printed and digital programs' },
          { benefit: 'Exhibition space', description: '2x2 meter exhibition space' },
        ],
        inclusions: {
          registrationIncluded: true,
          accommodationIncluded: false,
          numberOfRegistrations: 2,
          accommodationNights: 0,
        },
        displayOrder: 3,
        isActive: true,
        highlightColor: 'silver',
      },
    ];

    for (const tier of sponsorshipTiers) {
      const created = await client.create(tier);
      console.log(`✅ Sponsorship Tier created: ${created.tierName} (${created._id})`);
    }

    // 4. Create Accommodation Options
    const accommodationOptions = [
      {
        _type: 'accommodationOptions',
        hotelName: 'Grand Convention Hotel',
        hotelCategory: '5star',
        description: 'Luxury 5-star hotel adjacent to the conference venue with premium amenities.',
        location: {
          address: '123 Conference Boulevard, New York, NY 10001',
          distanceFromVenue: 'Walking distance (2 minutes)',
          transportationIncluded: true,
        },
        roomOptions: [
          {
            roomType: 'single',
            pricePerNight: 180,
            roomDescription: 'Deluxe single room with city view, king bed, and premium amenities',
            maxGuests: 1,
            isAvailable: true,
          },
          {
            roomType: 'double',
            pricePerNight: 250,
            roomDescription: 'Deluxe double room with city view, two queen beds, and premium amenities',
            maxGuests: 2,
            isAvailable: true,
          },
        ],
        packageOptions: [
          {
            packageName: '3-Night Conference Package',
            nights: 3,
            checkInDate: '2025-07-14',
            checkOutDate: '2025-07-17',
            inclusions: ['Daily breakfast', 'WiFi', 'Airport shuttle', 'Conference shuttle'],
            isActive: true,
          },
        ],
        amenities: ['Free WiFi', 'Fitness Center', 'Business Center', 'Restaurant', 'Room Service', 'Concierge'],
        displayOrder: 1,
        isActive: true,
        bookingDeadline: '2025-06-15',
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in. After that, one night charge applies.',
      },
      {
        _type: 'accommodationOptions',
        hotelName: 'Business Inn & Suites',
        hotelCategory: '4star',
        description: 'Comfortable 4-star business hotel with excellent conference facilities.',
        location: {
          address: '456 Business District, New York, NY 10002',
          distanceFromVenue: '5 minutes by shuttle',
          transportationIncluded: true,
        },
        roomOptions: [
          {
            roomType: 'single',
            pricePerNight: 120,
            roomDescription: 'Standard single room with business amenities and comfortable workspace',
            maxGuests: 1,
            isAvailable: true,
          },
          {
            roomType: 'double',
            pricePerNight: 160,
            roomDescription: 'Standard double room with two double beds and business amenities',
            maxGuests: 2,
            isAvailable: true,
          },
        ],
        packageOptions: [
          {
            packageName: '3-Night Business Package',
            nights: 3,
            checkInDate: '2025-07-14',
            checkOutDate: '2025-07-17',
            inclusions: ['Continental breakfast', 'WiFi', 'Conference shuttle'],
            isActive: true,
          },
        ],
        amenities: ['Free WiFi', 'Business Center', 'Restaurant', 'Laundry Service'],
        displayOrder: 2,
        isActive: true,
        bookingDeadline: '2025-06-15',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in.',
      },
    ];

    for (const hotel of accommodationOptions) {
      const created = await client.create(hotel);
      console.log(`✅ Accommodation Option created: ${created.hotelName} (${created._id})`);
    }

    // 5. Create Form Configuration
    console.log('📋 Creating form configuration...');
    const formConfig = await client.create({
      _type: 'formConfiguration',
      title: 'Registration Form Configuration',
      countries: [
        { code: 'US', name: 'United States', isActive: true },
        { code: 'CA', name: 'Canada', isActive: true },
        { code: 'GB', name: 'United Kingdom', isActive: true },
        { code: 'AU', name: 'Australia', isActive: true },
        { code: 'DE', name: 'Germany', isActive: true },
        { code: 'FR', name: 'France', isActive: true },
        { code: 'IN', name: 'India', isActive: true },
        { code: 'JP', name: 'Japan', isActive: true },
        { code: 'CN', name: 'China', isActive: true },
        { code: 'BR', name: 'Brazil', isActive: true },
        { code: 'MX', name: 'Mexico', isActive: true },
        { code: 'ZA', name: 'South Africa', isActive: true },
        { code: 'NG', name: 'Nigeria', isActive: true },
        { code: 'EG', name: 'Egypt', isActive: true },
        { code: 'KE', name: 'Kenya', isActive: true },
        { code: 'TW', name: 'Taiwan', isActive: true },
        { code: 'MG', name: 'Madagascar', isActive: true },
      ],
      abstractCategories: [
        { value: 'poster', label: 'Poster', description: 'Poster presentation', isActive: true, displayOrder: 1 },
        { value: 'oral', label: 'Oral', description: 'Oral presentation', isActive: true, displayOrder: 2 },
        { value: 'delegate', label: 'Delegate', description: 'Conference delegate', isActive: true, displayOrder: 3 },
        { value: 'workshop', label: 'Workshop', description: 'Workshop participation', isActive: true, displayOrder: 4 },
        { value: 'panel', label: 'Panel Discussion', description: 'Panel discussion participant', isActive: true, displayOrder: 5 },
        { value: 'keynote', label: 'Keynote', description: 'Keynote speaker', isActive: true, displayOrder: 6 },
        { value: 'other', label: 'Other', description: 'Other category', isActive: true, displayOrder: 7 },
      ],
      titleOptions: [
        { value: 'mr', label: 'Mr.', isActive: true },
        { value: 'mrs', label: 'Mrs.', isActive: true },
        { value: 'ms', label: 'Ms.', isActive: true },
        { value: 'dr', label: 'Dr.', isActive: true },
        { value: 'prof', label: 'Prof.', isActive: true },
        { value: 'assoc_prof', label: 'Assoc Prof', isActive: true },
        { value: 'assist_prof', label: 'Assist Prof', isActive: true },
      ],
      accommodationNightOptions: [
        { nights: 2, label: '2 Nights', isActive: true },
        { nights: 3, label: '3 Nights', isActive: true },
        { nights: 5, label: '5 Nights', isActive: true },
      ],
      lastUpdated: new Date().toISOString(),
    });

    console.log('✅ Form Configuration created:', formConfig._id);

    console.log('🎉 Registration system data populated successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('- Pricing Periods: 3 documents');
    console.log('- Registration Settings: 1 document');
    console.log('- Registration Types: 8 documents');
    console.log('- Sponsorship Tiers: 3 documents');
    console.log('- Accommodation Options: 2 documents');
    console.log('- Form Configuration: 1 document');
    console.log('');
    console.log('🔗 You can now access:');
    console.log('- Registration page: http://localhost:3000/registration');
    console.log('- Admin dashboard: http://localhost:3000/admin/registrations');
    console.log('- Sanity Studio: Configure your Sanity Studio URL');

  } catch (error) {
    console.error('❌ Error populating data:', error);
  }
}

// Run the script
populateRegistrationData();
