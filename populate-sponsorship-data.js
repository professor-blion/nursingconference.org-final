const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
});

const sponsorshipTiers = [
  {
    _type: 'sponsorshipTiers',
    name: 'Platinum Sponsor',
    slug: { _type: 'slug', current: 'platinum-sponsor' },
    price: 6000,
    order: 1,
    featured: true,
    description: 'Our premier sponsorship package with maximum visibility and benefits.',
    benefits: [
      { benefit: '5 Complimentary event registrations', highlighted: true },
      { benefit: 'Listing on meeting website', highlighted: false },
      { benefit: 'Logo recognition on meeting material', highlighted: false },
      { benefit: 'Logo printed on general session banner', highlighted: false },
      { benefit: 'Acknowledgement in inaugural address', highlighted: true },
      { benefit: 'Advertisement on printed final program', highlighted: false },
      { benefit: 'Opportunity to deliver a presentation', highlighted: true },
      { benefit: 'One exhibition booth/table (Booth size 3X3 Sqm)', highlighted: false },
      { benefit: 'On-site signage recognition', highlighted: false },
      { benefit: 'Sponsor representative to serve as organizing committee member', highlighted: true },
      { benefit: 'Opportunity to chair a scientific session', highlighted: true },
      { benefit: 'Full page advertisement in the abstracts book on Back Cover Page', highlighted: false },
      { benefit: 'Company name included in Press Release', highlighted: false },
      { benefit: 'Lunch sponsor', highlighted: true },
      { benefit: 'Tea/Coffee break sponsor', highlighted: true },
    ],
    color: { hex: '#FFD700' },
    active: true,
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Gold Sponsor',
    slug: { _type: 'slug', current: 'gold-sponsor' },
    price: 5000,
    order: 2,
    featured: false,
    description: 'Excellent visibility and networking opportunities for your brand.',
    benefits: [
      { benefit: '4 Complimentary event registrations', highlighted: true },
      { benefit: 'Listing on meeting website', highlighted: false },
      { benefit: 'Logo recognition on meeting material', highlighted: false },
      { benefit: 'Logo printed on general session banner', highlighted: false },
      { benefit: 'Acknowledgement in inaugural address', highlighted: true },
      { benefit: 'Advertisement on printed final program', highlighted: false },
      { benefit: 'Opportunity to deliver a presentation', highlighted: true },
      { benefit: 'One exhibition booth/table (Booth size 3X3 Sqm)', highlighted: false },
      { benefit: 'On-site signage recognition', highlighted: false },
      { benefit: 'Sponsor representative to serve as organizing committee member', highlighted: true },
      { benefit: 'Opportunity to chair a scientific session', highlighted: true },
      { benefit: 'Full page advertisement in the abstracts book on Inside Front Cover Page', highlighted: false },
      { benefit: 'Company name included in Press Release', highlighted: false },
      { benefit: 'Lunch sponsor', highlighted: true },
    ],
    color: { hex: '#FFD700' },
    active: true,
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Silver Sponsor',
    slug: { _type: 'slug', current: 'silver-sponsor' },
    price: 4000,
    order: 3,
    featured: false,
    description: 'Great value sponsorship with solid brand exposure.',
    benefits: [
      { benefit: '3 Complimentary event registrations', highlighted: true },
      { benefit: 'Listing on meeting website', highlighted: false },
      { benefit: 'Logo recognition on meeting material', highlighted: false },
      { benefit: 'Logo printed on general session banner', highlighted: false },
      { benefit: 'Acknowledgement in inaugural address', highlighted: false },
      { benefit: 'Advertisement on printed final program', highlighted: false },
      { benefit: 'Opportunity to deliver a presentation', highlighted: true },
      { benefit: 'One exhibition booth/table (Booth size 3X3 Sqm)', highlighted: false },
      { benefit: 'On-site signage recognition', highlighted: false },
      { benefit: 'Sponsor representative to serve as organizing committee member', highlighted: false },
      { benefit: 'Opportunity to chair a scientific session', highlighted: true },
      { benefit: 'Full page advertisement in the abstracts book on Inside Back Cover Page', highlighted: false },
    ],
    color: { hex: '#C0C0C0' },
    active: true,
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Exhibition',
    slug: { _type: 'slug', current: 'exhibition' },
    price: 1999,
    order: 4,
    featured: false,
    description: 'Perfect for showcasing your products and services.',
    benefits: [
      { benefit: '2 Complimentary event registrations', highlighted: true },
      { benefit: 'Listing on meeting website', highlighted: false },
      { benefit: 'Logo recognition on meeting material', highlighted: false },
      { benefit: 'Logo printed on general session banner', highlighted: false },
      { benefit: 'Acknowledgement in inaugural address', highlighted: false },
      { benefit: 'Advertisement on printed final program', highlighted: false },
      { benefit: 'Opportunity to deliver a presentation', highlighted: false },
      { benefit: 'One exhibition booth/table (Booth size 3X3 Sqm)', highlighted: true },
    ],
    color: { hex: '#CD7F32' },
    active: true,
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Bag Inserts',
    slug: { _type: 'slug', current: 'bag-inserts' },
    price: 999,
    order: 5,
    featured: false,
    description: 'Cost-effective way to reach all attendees.',
    benefits: [
      { benefit: 'Marketing materials in attendee bags', highlighted: true },
      { benefit: 'Listing on meeting website', highlighted: false },
      { benefit: 'Logo recognition on meeting material', highlighted: false },
    ],
    color: { hex: '#4A90E2' },
    active: true,
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Ad Sponsor',
    slug: { _type: 'slug', current: 'ad-sponsor' },
    price: 899,
    order: 6,
    featured: false,
    description: 'Advertise in our conference materials.',
    benefits: [
      { benefit: 'Advertisement in conference program', highlighted: true },
      { benefit: 'Listing on meeting website', highlighted: false },
      { benefit: 'Logo recognition on meeting material', highlighted: false },
    ],
    color: { hex: '#50C878' },
    active: true,
  },
];

async function populateSponsorshipData() {
  try {
    console.log('🚀 Starting to populate sponsorship data...');
    
    // Create sponsorship tiers
    for (const tier of sponsorshipTiers) {
      try {
        const result = await client.create(tier);
        console.log(`✅ Created sponsorship tier: ${tier.name} (ID: ${result._id})`);
      } catch (error) {
        console.error(`❌ Error creating tier ${tier.name}:`, error.message);
      }
    }
    
    console.log('🎉 Sponsorship data population completed!');
    console.log('\n📋 Summary:');
    console.log(`- Created ${sponsorshipTiers.length} sponsorship tiers`);
    console.log('- Tiers range from $899 to $6000');
    console.log('- Platinum tier is marked as featured');
    console.log('\n🔧 Next steps:');
    console.log('1. Open Sanity Studio (http://localhost:3333)');
    console.log('2. Navigate to "Sponsorship Tiers" to verify the data');
    console.log('3. Configure admin email in "Site Settings" > "Admin Settings"');
    console.log('4. Test the sponsorship flow on the frontend');
    
  } catch (error) {
    console.error('❌ Error populating sponsorship data:', error);
  }
}

// Run the population script
populateSponsorshipData();
