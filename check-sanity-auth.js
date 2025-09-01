const { createClient } = require('@sanity/client');

// Test different authentication scenarios
async function checkSanityAuth() {
  console.log('🔍 Checking Sanity Authentication Status...\n');
  
  // Test 1: Read-only access (should work)
  console.log('📖 Testing READ access...');
  const readClient = createClient({
    projectId: 'fl5uetho',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-05-03',
  });
  
  try {
    const readTest = await readClient.fetch('*[_type == "pastConferencesSection"][0]{_id, title}');
    console.log('✅ READ access working:', readTest);
  } catch (error) {
    console.log('❌ READ access failed:', error.message);
  }
  
  // Test 2: Write access without token (should fail)
  console.log('\n✏️ Testing WRITE access without token...');
  try {
    await readClient.patch('f9a18796-4666-480b-a5c3-c2cfc8a0a912').set({ title: 'Test Update' }).commit();
    console.log('✅ WRITE access working without token (unexpected!)');
  } catch (error) {
    console.log('❌ WRITE access failed without token (expected):', error.message);
  }
  
  // Test 3: Check if environment token exists
  console.log('\n🔑 Checking environment token...');
  const envToken = process.env.SANITY_API_TOKEN;
  if (envToken) {
    console.log('✅ SANITY_API_TOKEN found in environment');
    
    const writeClient = createClient({
      projectId: 'fl5uetho',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2023-05-03',
      token: envToken
    });
    
    try {
      const writeTest = await writeClient.patch('f9a18796-4666-480b-a5c3-c2cfc8a0a912').set({ title: 'Past Conferences Section Styling' }).commit();
      console.log('✅ WRITE access working with token:', writeTest._id);
    } catch (error) {
      console.log('❌ WRITE access failed with token:', error.message);
    }
  } else {
    console.log('❌ SANITY_API_TOKEN not found in environment');
  }
  
  console.log('\n🔧 SOLUTION STEPS:');
  console.log('1. Open Sanity Studio: http://localhost:3333');
  console.log('2. Sign in with your Sanity account');
  console.log('3. Once signed in, the color picker and opacity controls should work');
  console.log('4. If still not working, you may need to generate an API token');
  console.log('\n📋 To generate an API token:');
  console.log('1. Go to https://sanity.io/manage');
  console.log('2. Select your project (fl5uetho)');
  console.log('3. Go to API tab');
  console.log('4. Create a new token with Editor permissions');
  console.log('5. Add it to your .env.local file as SANITY_API_TOKEN=your_token_here');
}

checkSanityAuth();
