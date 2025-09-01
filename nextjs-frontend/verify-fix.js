const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function verifyUrlFix() {
  try {
    console.log('🔍 Verifying URL fix...\n');
    
    const expectedUrl = 'https://www.youtube.com/watch?v=fqbSpK9z4dk';
    
    // Get the Research Publication event
    const event = await client.fetch(
      `*[_type == "conferenceEvent" && title match "Research Publication*"][0]{
        _id,
        title,
        registerNowUrl,
        submitAbstractUrl,
        "registerUrlLength": length(registerNowUrl),
        "submitUrlLength": length(submitAbstractUrl)
      }`
    );
    
    if (!event) {
      console.log('❌ Research Publication event not found!');
      return;
    }
    
    console.log('📊 CURRENT STATUS:');
    console.log(`Title: ${event.title}`);
    console.log(`Register URL: "${event.registerNowUrl || 'null'}" (${event.registerUrlLength || 0} chars)`);
    console.log(`Submit URL: "${event.submitAbstractUrl || 'null'}" (${event.submitUrlLength || 0} chars)`);
    
    console.log('\n🎯 VERIFICATION:');
    console.log(`Expected URL: "${expectedUrl}" (${expectedUrl.length} chars)`);
    
    const registerCorrect = event.registerNowUrl === expectedUrl;
    const submitCorrect = event.submitAbstractUrl === expectedUrl;
    
    console.log(`Register URL correct: ${registerCorrect ? '✅ YES' : '❌ NO'}`);
    console.log(`Submit URL correct: ${submitCorrect ? '✅ YES' : '❌ NO'}`);
    
    if (registerCorrect && submitCorrect) {
      console.log('\n🎉 SUCCESS! URLs are now correct!');
      console.log('✅ The buttons should now work properly on the frontend.');
      console.log('🌐 Test at: http://localhost:3000');
    } else {
      console.log('\n⚠️  URLs still need to be fixed in Sanity Studio');
      console.log('🔧 Go to: http://localhost:3333');
      console.log('📝 Update the Research Publication event URLs to:');
      console.log(`   ${expectedUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Error verifying fix:', error);
  }
}

verifyUrlFix();
