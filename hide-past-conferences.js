// Load environment variables
require('dotenv').config();

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

console.log('🔧 Using Sanity Configuration:');
console.log('   Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho');
console.log('   Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'production');
console.log('   Has Token:', !!process.env.SANITY_API_TOKEN);
console.log('');

async function hidePastConferencesFromMenu() {
  try {
    console.log('🔍 Checking Past Conferences toggle setting...');
    
    const query = '*[_type == "pastConference"][0]{ _id, title, showInMenu, isActive, redirectUrl }';
    const result = await client.fetch(query);
    
    console.log('📊 Current Past Conferences Configuration:');
    console.log(JSON.stringify(result, null, 2));
    
    if (!result) {
      console.log('❌ No pastConference document found!');
      console.log('💡 Creating default pastConference document with Past Conferences HIDDEN...');
      
      const newDoc = await client.create({
        _type: 'pastConference',
        title: 'Past Conferences Redirect Configuration',
        redirectUrl: 'https://intelliglobalconferences.com/past-conferences',
        description: 'External link to past conferences',
        isActive: true,
        showInMenu: false, // Hide by default
        lastUpdated: new Date().toISOString()
      });
      
      console.log('✅ Created pastConference document:', newDoc._id);
      console.log('🔧 Past Conferences is now HIDDEN from navigation menu');
    } else {
      console.log('📋 Document exists with ID:', result._id);
      console.log('🔧 Current showInMenu:', result.showInMenu);
      console.log('⚡ Current isActive:', result.isActive);
      
      // Update to hide Past Conferences from menu
      if (result.showInMenu !== false) {
        console.log('🔄 Updating showInMenu to false (hiding Past Conferences)...');
        
        const updatedDoc = await client
          .patch(result._id)
          .set({ 
            showInMenu: false,
            lastUpdated: new Date().toISOString()
          })
          .commit();
        
        console.log('✅ Updated pastConference document');
        console.log('🔧 Past Conferences is now HIDDEN from navigation menu');
      } else {
        console.log('✅ Past Conferences is already HIDDEN from navigation menu');
      }
    }
    
    // Verify the change
    console.log('\n🔍 Verifying current state...');
    const verifyResult = await client.fetch(query);
    console.log('📊 Final Configuration:');
    console.log('   showInMenu:', verifyResult?.showInMenu);
    console.log('   isActive:', verifyResult?.isActive);
    
    if (verifyResult?.showInMenu === false) {
      console.log('\n🎉 SUCCESS: Past Conferences is now hidden from the navigation menu!');
      console.log('🔄 The frontend will update automatically within 10 seconds');
      console.log('🌐 You can verify at: http://localhost:3000');
      console.log('');
      console.log('📝 To show Past Conferences again, you can:');
      console.log('   1. Go to Sanity Studio: http://localhost:3333');
      console.log('   2. Navigate to Past Conferences Redirect');
      console.log('   3. Toggle "Show in Navigation Menu" to true');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

hidePastConferencesFromMenu();
