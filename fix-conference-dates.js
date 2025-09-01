const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  // Note: This script requires a write token to update dates
  // You can get this from Sanity Studio -> API -> Tokens
  token: process.env.SANITY_API_TOKEN,
});

async function fixConferenceDates() {
  try {
    console.log('🔍 Checking existing conferences...');
    
    // Get all conferences
    const allConferences = await client.fetch(`*[_type == "conferenceEvent"] {
      _id,
      title,
      date,
      location
    }`);
    
    console.log(`📊 Found ${allConferences.length} conferences`);
    
    if (allConferences.length === 0) {
      console.log('❌ No conferences found. Please create some conferences first.');
      return;
    }
    
    // Update each conference to have a future date
    const updates = [];
    const baseDate = new Date();
    
    for (let i = 0; i < allConferences.length; i++) {
      const conference = allConferences[i];
      const currentDate = new Date(conference.date);
      
      // Set new date to be 30, 60, 90 days from now
      const daysToAdd = 30 + (i * 30);
      const newDate = new Date(baseDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
      
      console.log(`📅 Updating "${conference.title}"`);
      console.log(`   Old date: ${currentDate.toLocaleDateString()}`);
      console.log(`   New date: ${newDate.toLocaleDateString()}`);
      
      updates.push({
        id: conference._id,
        newDate: newDate.toISOString(),
        title: conference.title
      });
    }
    
    // Apply updates
    for (const update of updates) {
      try {
        await client
          .patch(update.id)
          .set({ date: update.newDate })
          .commit();
        
        console.log(`✅ Updated: ${update.title}`);
      } catch (error) {
        console.error(`❌ Failed to update ${update.title}:`, error.message);
      }
    }
    
    console.log('\n🎉 Conference dates updated successfully!');
    console.log('🔄 Now checking upcoming conferences...');
    
    // Verify the updates
    const upcomingConferences = await client.fetch(`*[_type == "conferenceEvent" && date > now()] | order(date asc) {
      _id,
      title,
      date,
      location
    }`);
    
    console.log(`\n✅ Found ${upcomingConferences.length} upcoming conferences:`);
    upcomingConferences.forEach(conf => {
      console.log(`  - ${conf.title} | ${new Date(conf.date).toLocaleDateString()} | ${conf.location}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing conference dates:', error.message);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('\n🔑 Permission Error:');
      console.log('This script requires a Sanity API token with write permissions.');
      console.log('To get a token:');
      console.log('1. Go to https://sanity.io/manage');
      console.log('2. Select your project');
      console.log('3. Go to API -> Tokens');
      console.log('4. Create a new token with Editor permissions');
      console.log('5. Set it as SANITY_API_TOKEN environment variable');
      console.log('\nAlternatively, you can manually update the conference dates in Sanity Studio:');
      console.log('1. Open http://localhost:3333');
      console.log('2. Go to Conference Event section');
      console.log('3. Edit each conference and set the date to a future date');
    }
  }
}

// Run the fix
fixConferenceDates();
