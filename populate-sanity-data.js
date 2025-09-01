const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  useCdn: false,
});

// Realistic conference events data
const conferenceEvents = [
  {
    _type: 'conferenceEvent',
    title: 'Global AI & Machine Learning Summit 2024',
    slug: { current: 'global-ai-ml-summit-2024' },
    location: 'San Francisco, CA, USA',
    date: '2024-09-15T09:00:00.000Z',
    email: 'info@aimlsummit.com',
    eventDomain: 'aimlsummit.com',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-placeholder-ai-summit'
      }
    }
  },
  {
    _type: 'conferenceEvent',
    title: 'International Blockchain & Fintech Conference 2024',
    slug: { current: 'blockchain-fintech-conference-2024' },
    location: 'New York, NY, USA',
    date: '2024-10-22T08:30:00.000Z',
    email: 'contact@blockchainfintech.com',
    eventDomain: 'blockchainfintech.com',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-placeholder-blockchain-conf'
      }
    }
  },
  {
    _type: 'conferenceEvent',
    title: 'Digital Transformation & Cloud Computing Expo 2024',
    slug: { current: 'digital-transformation-cloud-expo-2024' },
    location: 'London, UK',
    date: '2024-11-08T09:00:00.000Z',
    email: 'hello@digitalcloudexpo.com',
    eventDomain: 'digitalcloudexpo.com',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-placeholder-cloud-expo'
      }
    }
  },
  {
    _type: 'conferenceEvent',
    title: 'Cybersecurity & Data Privacy Summit 2024',
    slug: { current: 'cybersecurity-data-privacy-summit-2024' },
    location: 'Austin, TX, USA',
    date: '2024-12-05T08:00:00.000Z',
    email: 'info@cybersecuritysummit.com',
    eventDomain: 'cybersecuritysummit.com',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-placeholder-cybersecurity-summit'
      }
    }
  },
  {
    _type: 'conferenceEvent',
    title: 'Healthcare Innovation & Digital Health Conference 2025',
    slug: { current: 'healthcare-innovation-digital-health-2025' },
    location: 'Boston, MA, USA',
    date: '2025-02-18T09:30:00.000Z',
    email: 'contact@healthinnovation.com',
    eventDomain: 'healthinnovation.com',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-placeholder-health-conf'
      }
    }
  }
];

// Realistic sponsorship tiers data
const sponsorshipTiers = [
  {
    _type: 'sponsorshipTiers',
    name: 'Platinum Elite Sponsor',
    slug: { current: 'platinum-elite-sponsor' },
    price: 25000,
    order: 1,
    featured: true,
    description: 'Premium sponsorship package with maximum visibility and exclusive benefits for industry leaders.',
    benefits: [
      { benefit: 'Prime exhibition booth (20x20 ft) in high-traffic area', highlighted: true },
      { benefit: '45-minute keynote speaking slot during main conference', highlighted: true },
      { benefit: 'Logo prominently featured on all marketing materials and website', highlighted: false },
      { benefit: 'Full-page advertisement in conference program guide', highlighted: false },
      { benefit: 'Exclusive VIP networking reception hosting rights', highlighted: true },
      { benefit: 'Complete attendee contact list (with consent)', highlighted: false },
      { benefit: 'Social media promotion across all conference channels', highlighted: false },
      { benefit: '10 complimentary conference passes for your team', highlighted: false },
      { benefit: 'Priority access to speaker green room and VIP areas', highlighted: false },
      { benefit: 'Custom branded conference swag distribution rights', highlighted: false }
    ],
    color: { hex: '#8B5CF6' },
    active: true
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Gold Premier Sponsor',
    slug: { current: 'gold-premier-sponsor' },
    price: 15000,
    order: 2,
    featured: false,
    description: 'Comprehensive sponsorship package offering excellent visibility and valuable networking opportunities.',
    benefits: [
      { benefit: 'Standard exhibition booth (10x10 ft) in prime location', highlighted: true },
      { benefit: '20-minute presentation slot during breakout sessions', highlighted: true },
      { benefit: 'Logo featured on conference website and select materials', highlighted: false },
      { benefit: 'Half-page advertisement in conference program', highlighted: false },
      { benefit: 'Access to exclusive sponsor networking events', highlighted: false },
      { benefit: 'Attendee contact list (business contacts only)', highlighted: false },
      { benefit: '6 complimentary conference passes', highlighted: false },
      { benefit: 'Social media mentions during conference week', highlighted: false },
      { benefit: 'Branded signage in conference common areas', highlighted: false }
    ],
    color: { hex: '#F59E0B' },
    active: true
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Silver Professional Sponsor',
    slug: { current: 'silver-professional-sponsor' },
    price: 8500,
    order: 3,
    featured: false,
    description: 'Professional sponsorship package perfect for growing companies seeking targeted exposure.',
    benefits: [
      { benefit: 'Exhibition booth (8x8 ft) in designated sponsor area', highlighted: true },
      { benefit: '10-minute lightning talk opportunity', highlighted: false },
      { benefit: 'Logo placement on conference website sponsors page', highlighted: false },
      { benefit: 'Quarter-page advertisement in program guide', highlighted: false },
      { benefit: '4 complimentary conference passes', highlighted: false },
      { benefit: 'Access to digital attendee networking platform', highlighted: false },
      { benefit: 'Branded materials in conference welcome bags', highlighted: false },
      { benefit: 'Social media recognition as official sponsor', highlighted: false }
    ],
    color: { hex: '#6B7280' },
    active: true
  },
  {
    _type: 'sponsorshipTiers',
    name: 'Bronze Startup Sponsor',
    slug: { current: 'bronze-startup-sponsor' },
    price: 3500,
    order: 4,
    featured: false,
    description: 'Entry-level sponsorship package designed for startups and emerging companies.',
    benefits: [
      { benefit: 'Shared exhibition space in startup showcase area', highlighted: true },
      { benefit: 'Logo listing on conference website', highlighted: false },
      { benefit: '2 complimentary conference passes', highlighted: false },
      { benefit: 'Access to startup networking mixer', highlighted: false },
      { benefit: 'Digital marketing materials in welcome email', highlighted: false },
      { benefit: 'Opportunity to participate in startup pitch session', highlighted: false }
    ],
    color: { hex: '#CD7F32' },
    active: true
  }
];

// Function to populate data
async function populateData() {
  try {
    console.log('🚀 Starting to populate Sanity with realistic conference data...');

    // Create conference events
    console.log('📅 Creating conference events...');
    for (const event of conferenceEvents) {
      try {
        const result = await client.create(event);
        console.log(`✅ Created conference: ${event.title} (ID: ${result._id})`);
      } catch (error) {
        console.error(`❌ Failed to create conference ${event.title}:`, error.message);
      }
    }

    // Create sponsorship tiers
    console.log('🏆 Creating sponsorship tiers...');
    for (const tier of sponsorshipTiers) {
      try {
        const result = await client.create(tier);
        console.log(`✅ Created sponsorship tier: ${tier.name} (ID: ${result._id})`);
      } catch (error) {
        console.error(`❌ Failed to create tier ${tier.name}:`, error.message);
      }
    }

    console.log('🎉 Data population completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${conferenceEvents.length} conference events created`);
    console.log(`   - ${sponsorshipTiers.length} sponsorship tiers created`);
    
  } catch (error) {
    console.error('❌ Error during data population:', error);
  }
}

// Run the population script
if (require.main === module) {
  populateData();
}

module.exports = { populateData, conferenceEvents, sponsorshipTiers };
