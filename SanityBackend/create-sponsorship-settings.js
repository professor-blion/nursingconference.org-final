const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
});

async function createSponsorshipSettings() {
  try {
    console.log('Creating sponsorship settings...');

    const sponsorshipSettings = {
      _id: 'sponsorshipSettings',
      _type: 'sponsorshipSettings',
      title: 'Sponsorship Settings',
      heroSection: {
        title: 'For Sponsor / Exhibitor',
        description: 'Intelli Global Conferences organizes interdisciplinary global conferences to showcase revolutionary basic and applied research outcomes within life sciences including medicine and other diverse roles of science and technology around the world.',
      },
      mainContent: {
        sectionTitle: 'Partnership Value Proposition',
        content: [
          {
            _type: 'block',
            _key: 'content1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span1',
                text: 'Adding value to the experience while integrating your brand\'s products will not only showcase the authenticity of the brand, but will result in great, objective 3rd party recognition that will move the influencer needle. When your brand purchases a Sponsorship package, it is committing itself to delivering experiential relevance and value to thousands of industry influencers including press, creative\'s and their millions of collective followers, who have come to expect nothing less from Intelli Global Conferences and its partners.',
                marks: []
              }
            ],
            markDefs: []
          },
          {
            _type: 'block',
            _key: 'content2',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span2',
                text: 'Intelli Global Conferences offers different packages for sponsors/exhibitors to demonstrate their support towards science and its people by providing financial contributions to facilitate the presentations of noble research findings, hospitality and other necessary management for the scientific gathering.',
                marks: []
              }
            ],
            markDefs: []
          }
        ],
        highlightText: 'Visualize this partnership through the eyes of world class noble people…!!!',
      },
      callToAction: {
        title: 'Ready to Become a Sponsor?',
        description: 'Join us in supporting groundbreaking research and innovation. Choose your sponsorship package and make a lasting impact.',
        buttonText: 'Become a Sponsor',
        buttonLink: '/registration',
      },
      pageSettings: {
        showSponsorshipTiers: true,
        metaTitle: 'Sponsorship Opportunities - Intelli Global Conferences',
        metaDescription: 'Partner with us to showcase your brand at our global conferences. Explore sponsorship packages and benefits for industry leaders.',
      },
      lastUpdated: new Date().toISOString(),
    };

    // Check if settings already exist
    const existingSettings = await client.fetch('*[_type == "sponsorshipSettings"][0]');
    
    if (existingSettings) {
      console.log('Sponsorship settings already exist. Updating...');
      const result = await client
        .patch(existingSettings._id)
        .set(sponsorshipSettings)
        .commit();
      console.log('Sponsorship settings updated successfully:', result._id);
    } else {
      console.log('Creating new sponsorship settings...');
      const result = await client.create(sponsorshipSettings);
      console.log('Sponsorship settings created successfully:', result._id);
    }

  } catch (error) {
    console.error('Error creating sponsorship settings:', error);
    process.exit(1);
  }
}

// Run the script
createSponsorshipSettings();
