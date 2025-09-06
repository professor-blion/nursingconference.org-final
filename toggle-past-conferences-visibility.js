// Script to toggle Past Conferences visibility in navigation menu
require('dotenv').config();

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

async function togglePastConferencesVisibility() {
  try {
    console.log('🔍 Checking current Past Conferences visibility...');
    
    const query = '*[_type == "pastConference"][0]{ _id, title, showInMenu, isActive, redirectUrl }';
    const result = await client.fetch(query);
    
    if (!result) {
      console.log('❌ No pastConference document found!');
      console.log('💡 Creating default pastConference document...');
      
      const newDoc = await client.create({
        _type: 'pastConference',
        title: 'Past Conferences Redirect Configuration',
        redirectUrl: 'https://intelliglobalconferences.com/past-conferences',
        description: 'External link to past conferences',
        isActive: true,
        showInMenu: false, // Start hidden
        lastUpdated: new Date().toISOString()
      });
      
      console.log('✅ Created pastConference document:', newDoc._id);
      console.log('🔧 Past Conferences is now HIDDEN from navigation menu');
      return;
    }
    
    console.log('📊 Current Configuration:');
    console.log('   Document ID:', result._id);
    console.log('   showInMenu:', result.showInMenu);
    console.log('   isActive:', result.isActive);
    console.log('');
    
    // Toggle the current state
    const newShowInMenu = !result.showInMenu;
    
    console.log(`🔄 Toggling showInMenu from ${result.showInMenu} to ${newShowInMenu}...`);
    
    const updatedDoc = await client
      .patch(result._id)
      .set({ 
        showInMenu: newShowInMenu,
        lastUpdated: new Date().toISOString()
      })
      .commit();
    
    console.log('✅ Updated pastConference document');
    console.log(`🔧 Past Conferences is now ${newShowInMenu ? 'VISIBLE' : 'HIDDEN'} in navigation menu`);
    
    // Verify the change
    console.log('\n🔍 Verifying update...');
    const verifyResult = await client.fetch(query);
    console.log('📊 Updated Configuration:');
    console.log('   showInMenu:', verifyResult?.showInMenu);
    console.log('   isActive:', verifyResult?.isActive);
    
    console.log(`\n🎉 SUCCESS: Past Conferences is now ${verifyResult?.showInMenu ? 'VISIBLE' : 'HIDDEN'}!`);
    console.log('🔄 The frontend will update automatically within 5-10 seconds');
    console.log('🌐 Check at: http://localhost:3000');
    console.log('');
    console.log('💡 To toggle again, run this script again:');
    console.log('   node toggle-past-conferences-visibility.js');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

togglePastConferencesVisibility();
