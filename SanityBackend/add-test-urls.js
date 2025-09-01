const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN || 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function addTestUrls() {
  try {
    console.log('Adding test URLs to conference events...');
    
    // Get all conference events
    const events = await client.fetch(`*[_type == "conferenceEvent"]{_id, title}`);
    
    console.log(`Found ${events.length} conference events`);
    
    // Add test URLs to the first few events
    const testUrls = [
      'https://nursingeducationconference.org',
      'https://nursingeducationconferences.info',
      'https://diabetesconference.org'
    ];
    
    for (let i = 0; i < Math.min(events.length, testUrls.length); i++) {
      const event = events[i];
      const testUrl = testUrls[i];
      
      console.log(`\nUpdating "${event.title}" with imageLinkUrl: ${testUrl}`);

      try {
        await client
          .patch(event._id)
          .set({ imageLinkUrl: testUrl })
          .commit();
        
        console.log('✅ Successfully updated');
      } catch (error) {
        console.log('❌ Failed to update:', error.message);
      }
    }
    
    console.log('\n🎉 Test URLs added! You can now test the external URL redirection on the frontend.');
    console.log('Visit: http://localhost:3000/conferences');
    console.log('Debug: http://localhost:3000/debug-conferences');
    
  } catch (error) {
    console.error('Error adding test URLs:', error);
  }
}

addTestUrls();
