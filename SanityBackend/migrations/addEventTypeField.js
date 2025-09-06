// Migration script to add eventType field to existing heroSection documents
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_AUTH_TOKEN, // You'll need to set this
  useCdn: false
});

async function addEventTypeToHeroSections() {
  console.log('🔄 Starting migration: Adding eventType field to heroSection documents...');

  try {
    // Fetch all heroSection documents
    const heroSections = await client.fetch('*[_type == "heroSection"]');
    
    console.log(`📋 Found ${heroSections.length} heroSection document(s)`);

    if (heroSections.length === 0) {
      console.log('ℹ️  No heroSection documents found. Creating a new one...');
      
      // Create a new heroSection document with eventType field
      const newHeroSection = await client.create({
        _type: 'heroSection',
        conferenceTitle: 'INTERNATIONAL CONFERENCE ON',
        conferenceSubject: 'NURSING',
        conferenceTheme: 'Theme: Advancing Excellence in Nursing Practice and Education',
        conferenceDate: 'June 23-24, 2025',
        conferenceVenue: 'Hotel Indigo Kuala Lumpur On The Park, Kuala Lumpur, Malaysia',
        eventType: 'Hybrid event (Online and Offline)',
        abstractSubmissionInfo: 'Abstract Submission Opens: March 20, 2024',
        registrationInfo: 'Early Bird Registration Start: April 15, 2024',
        showRegisterButton: true,
        registerButtonText: 'Register Now',
        registerButtonUrl: '/registration',
        textColor: {
          hex: '#ffffff',
          alpha: 1
        },
        slideshowSettings: {
          enableSlideshow: true,
          overlayColor: { hex: '#000000' },
          overlayOpacity: 50,
          transitionDuration: 5,
          enableZoomEffect: true,
          enableFadeTransition: true,
          showNavigationDots: true
        }
      });
      
      console.log('✅ Created new heroSection document with eventType field');
      console.log('📄 Document ID:', newHeroSection._id);
      return;
    }

    // Update existing documents
    for (const heroSection of heroSections) {
      if (!heroSection.eventType) {
        console.log(`🔄 Updating document: ${heroSection._id}`);
        
        await client
          .patch(heroSection._id)
          .set({ eventType: 'Hybrid event (Online and Offline)' })
          .commit();
          
        console.log(`✅ Added eventType field to document: ${heroSection._id}`);
      } else {
        console.log(`ℹ️  Document ${heroSection._id} already has eventType field: "${heroSection.eventType}"`);
      }
    }

    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  addEventTypeToHeroSections()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export default addEventTypeToHeroSections;
