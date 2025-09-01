const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho', // Your actual project ID
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN || 'your-token-here' // You'll need to set this
});

async function populateAbstractData() {
  try {
    console.log('🚀 Starting to populate abstract submission data...');

    // 1. Create Abstract Settings
    const abstractSettings = {
      _type: 'abstractSettings',
      title: 'Abstract Submission Settings',
      isSubmissionOpen: true,
      submissionDeadline: '2025-12-31T23:59:59.000Z',
      earlyBirdDeadline: '2025-10-31T23:59:59.000Z',
      maxAbstractLength: 3000,
      maxKeywords: 10,
      allowedFileTypes: ['pdf', 'doc', 'docx'],
      maxFileSize: 10,
      submissionGuidelines: 'Please ensure your abstract follows the conference guidelines. Include clear objectives, methodology, results, and conclusions.',
      reviewProcess: 'All abstracts will be peer-reviewed by our expert panel. You will receive notification within 4-6 weeks.',
      notificationDate: '2025-09-15',
      contactEmail: 'abstracts@nursingconference.com',
      autoConfirmationEmail: true,
      confirmationEmailTemplate: 'Dear {{name}}, thank you for submitting your abstract titled "{{title}}". We have received your submission and will review it shortly.',
      submissionFee: {
        amount: 50,
        currency: 'USD',
        earlyBirdAmount: 35
      }
    };

    const settingsResult = await client.create(abstractSettings);
    console.log('✅ Created abstract settings:', settingsResult._id);

    // 2. Create Track Names
    const trackNames = [
      {
        _type: 'abstractTrackName',
        name: 'Clinical Nursing Practice',
        description: 'Research and innovations in clinical nursing practice',
        isActive: true,
        sortOrder: 1,
        guidelines: 'Focus on evidence-based clinical practices and patient care innovations',
        maxWordCount: 300
      },
      {
        _type: 'abstractTrackName',
        name: 'Nursing Education',
        description: 'Educational methodologies and curriculum development in nursing',
        isActive: true,
        sortOrder: 2,
        guidelines: 'Include educational outcomes and teaching methodologies',
        maxWordCount: 300
      },
      {
        _type: 'abstractTrackName',
        name: 'Healthcare Technology',
        description: 'Technology applications in healthcare and nursing',
        isActive: true,
        sortOrder: 3,
        guidelines: 'Demonstrate technology impact on patient care or nursing practice',
        maxWordCount: 300
      },
      {
        _type: 'abstractTrackName',
        name: 'Public Health Nursing',
        description: 'Community health and population-based nursing interventions',
        isActive: true,
        sortOrder: 4,
        guidelines: 'Focus on community health outcomes and population health strategies',
        maxWordCount: 300
      },
      {
        _type: 'abstractTrackName',
        name: 'Mental Health Nursing',
        description: 'Mental health care and psychiatric nursing practices',
        isActive: true,
        sortOrder: 5,
        guidelines: 'Include mental health interventions and patient outcomes',
        maxWordCount: 300
      }
    ];

    for (const track of trackNames) {
      const result = await client.create(track);
      console.log(`✅ Created track: ${track.name} (${result._id})`);
    }

    // 3. Create Interest Categories
    const interestCategories = [
      {
        _type: 'abstractInterestedIn',
        name: 'Oral Presentation',
        description: '15-minute presentation followed by 5-minute Q&A',
        isActive: true,
        sortOrder: 1,
        requirements: 'Presenter must be available for the full conference duration',
        duration: '20 minutes',
        additionalFee: 0
      },
      {
        _type: 'abstractInterestedIn',
        name: 'Poster Session',
        description: 'Visual presentation during dedicated poster sessions',
        isActive: true,
        sortOrder: 2,
        requirements: 'Poster must be A0 size (841 x 1189 mm)',
        duration: '2 hours',
        additionalFee: 0
      },
      {
        _type: 'abstractInterestedIn',
        name: 'Workshop Facilitation',
        description: 'Interactive workshop session with participants',
        isActive: true,
        sortOrder: 3,
        requirements: 'Must provide detailed workshop outline and materials list',
        duration: '90 minutes',
        additionalFee: 25
      },
      {
        _type: 'abstractInterestedIn',
        name: 'Panel Discussion',
        description: 'Participate in expert panel discussions',
        isActive: true,
        sortOrder: 4,
        requirements: 'Must be available for pre-conference planning meeting',
        duration: '60 minutes',
        additionalFee: 0
      }
    ];

    for (const category of interestCategories) {
      const result = await client.create(category);
      console.log(`✅ Created interest category: ${category.name} (${result._id})`);
    }

    console.log('🎉 Successfully populated all abstract submission data!');
    console.log('📝 You can now:');
    console.log('   - Configure abstract settings in Sanity Studio');
    console.log('   - Add/edit track categories');
    console.log('   - Manage interest categories');
    console.log('   - View abstract submissions when they start coming in');

  } catch (error) {
    console.error('❌ Error populating abstract data:', error);
  }
}

// Run the population script
populateAbstractData();
