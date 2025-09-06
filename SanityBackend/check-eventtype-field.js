// Simple script to check if eventType field exists in heroSection documents
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function checkEventTypeField() {
  console.log('🔍 Checking eventType field in heroSection documents...\n');

  try {
    // Fetch heroSection documents with eventType field
    const heroSections = await client.fetch(`
      *[_type == "heroSection"]{
        _id,
        _type,
        conferenceTitle,
        conferenceSubject,
        conferenceVenue,
        eventType,
        _updatedAt
      }
    `);

    if (heroSections.length === 0) {
      console.log('❌ No heroSection documents found in the dataset');
      console.log('💡 You may need to create a heroSection document first');
      return;
    }

    console.log(`📋 Found ${heroSections.length} heroSection document(s):\n`);

    heroSections.forEach((doc, index) => {
      console.log(`📄 Document ${index + 1}:`);
      console.log(`   ID: ${doc._id}`);
      console.log(`   Title: ${doc.conferenceTitle || 'Not set'}`);
      console.log(`   Subject: ${doc.conferenceSubject || 'Not set'}`);
      console.log(`   Venue: ${doc.conferenceVenue || 'Not set'}`);
      console.log(`   Event Type: ${doc.eventType || '❌ NOT SET'}`);
      console.log(`   Last Updated: ${doc._updatedAt || 'Unknown'}`);
      console.log('');
    });

    // Check if any document has eventType field
    const hasEventType = heroSections.some(doc => doc.eventType);
    
    if (hasEventType) {
      console.log('✅ eventType field found in at least one document');
      console.log('🎯 The field should now be visible in Sanity Studio');
    } else {
      console.log('❌ eventType field not found in any document');
      console.log('💡 The field exists in schema but documents need to be updated');
      console.log('🔧 Try editing the heroSection document in Sanity Studio to add the field');
    }

  } catch (error) {
    console.error('❌ Error checking eventType field:', error.message);
  }
}

checkEventTypeField();
