const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN // You'll need to set this or use the CLI
});

async function fixResearchPublicationUrls() {
  try {
    console.log('🔧 Fixing Research Publication URLs...\n');
    
    const correctUrl = 'https://www.youtube.com/watch?v=fqbSpK9z4dk';
    const eventId = 'd2be2222-b30d-4a9c-ba84-f103dd3ed761'; // Research Publication ID
    
    console.log(`📝 Updating event ID: ${eventId}`);
    console.log(`🔗 Setting URLs to: ${correctUrl}\n`);
    
    // Update the Research Publication event with correct URLs
    const result = await client
      .patch(eventId)
      .set({
        registerNowUrl: correctUrl,
        submitAbstractUrl: correctUrl
      })
      .commit();
    
    console.log('✅ Successfully updated URLs!');
    console.log('Updated document:', result);
    
    // Verify the update
    console.log('\n🔍 Verifying the update...');
    const updatedEvent = await client.fetch(
      `*[_id == "${eventId}"][0]{
        _id,
        title,
        registerNowUrl,
        submitAbstractUrl,
        "registerUrlLength": length(registerNowUrl),
        "submitUrlLength": length(submitAbstractUrl)
      }`
    );
    
    console.log('\n📊 VERIFICATION RESULTS:');
    console.log(`Title: ${updatedEvent.title}`);
    console.log(`Register URL: "${updatedEvent.registerNowUrl}" (${updatedEvent.registerUrlLength} chars)`);
    console.log(`Submit URL: "${updatedEvent.submitAbstractUrl}" (${updatedEvent.submitUrlLength} chars)`);
    console.log(`URLs correct: ${updatedEvent.registerNowUrl === correctUrl ? '✅ YES' : '❌ NO'}`);
    
  } catch (error) {
    console.error('❌ Error fixing URLs:', error);
    
    if (error.message.includes('Insufficient permissions')) {
      console.log('\n💡 SOLUTION: You need to either:');
      console.log('1. Set SANITY_API_TOKEN environment variable with a write token');
      console.log('2. Or manually update the URLs in Sanity Studio at http://localhost:3333');
      console.log('\nTo get a write token:');
      console.log('1. Go to https://sanity.io/manage');
      console.log('2. Select your project');
      console.log('3. Go to API > Tokens');
      console.log('4. Create a new token with Editor permissions');
    }
  }
}

fixResearchPublicationUrls();
