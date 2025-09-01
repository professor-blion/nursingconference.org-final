const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  // Using public read access for testing
});

async function createSampleConferences() {
  try {
    console.log('🔍 Checking existing conferences...');
    
    // Check existing conferences (this should work without token for read operations)
    const allConferences = await client.fetch(`*[_type == "conferenceEvent"] | order(date asc) {
      _id,
      title,
      date,
      location
    }`);
    
    console.log(`📊 Found ${allConferences.length} total conferences in database`);
    
    if (allConferences.length > 0) {
      console.log('📅 Existing conferences:');
      allConferences.forEach(conf => {
        const date = new Date(conf.date);
        const isUpcoming = date > new Date();
        console.log(`  - ${conf.title} | ${date.toLocaleDateString()} | ${conf.location} | ${isUpcoming ? '✅ Upcoming' : '❌ Past'}`);
      });
    }
    
    // Check upcoming conferences specifically
    const upcomingConferences = await client.fetch(`*[_type == "conferenceEvent" && date > now()] | order(date asc) {
      _id,
      title,
      date,
      location
    }`);
    
    console.log(`\n🚀 Found ${upcomingConferences.length} upcoming conferences`);
    
    if (upcomingConferences.length === 0) {
      console.log('\n⚠️  No upcoming conferences found!');
      console.log('📝 To fix this issue, you need to:');
      console.log('1. Open Sanity Studio: http://localhost:3333');
      console.log('2. Navigate to "Conference Event" section');
      console.log('3. Create new conferences with future dates');
      console.log('\nSample conferences to create:');
      
      const sampleConferences = [
        {
          title: 'International Conference on Artificial Intelligence 2024',
          location: 'San Francisco, CA, USA',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        {
          title: 'Global Healthcare Innovation Summit 2024',
          location: 'London, UK',
          date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        },
        {
          title: 'International Biotechnology Conference 2024',
          location: 'Boston, MA, USA',
          date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        }
      ];
      
      sampleConferences.forEach((conf, index) => {
        console.log(`\n${index + 1}. Conference Title: ${conf.title}`);
        console.log(`   Location: ${conf.location}`);
        console.log(`   Date: ${conf.date.toLocaleDateString()}`);
        console.log(`   Slug: ${conf.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`);
      });
      
      console.log('\n📋 Instructions for creating conferences in Sanity Studio:');
      console.log('1. Click "Create" button');
      console.log('2. Select "Conference Event"');
      console.log('3. Fill in the required fields:');
      console.log('   - Event Title');
      console.log('   - Slug (auto-generated from title)');
      console.log('   - Event Poster (upload any image)');
      console.log('   - Location');
      console.log('   - Event Date (set to future date)');
      console.log('4. Save the document');
      console.log('5. Repeat for multiple conferences');
    } else {
      console.log('✅ Upcoming conferences are available for sponsorship!');
    }
    
  } catch (error) {
    console.error('❌ Error checking conferences:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the frontend server is running (npm run dev)');
    console.log('2. Make sure the Sanity backend is running (npm run dev in SanityBackend folder)');
    console.log('3. Check if there are any CORS issues in the browser console');
  }
}

// Run the check
createSampleConferences();
