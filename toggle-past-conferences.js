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

// Get command line argument for show/hide
const action = process.argv[2]; // 'show' or 'hide'

console.log('🔧 Using Sanity Configuration:');
console.log('   Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho');
console.log('   Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'production');
console.log('   Has Token:', !!process.env.SANITY_API_TOKEN);
console.log('');

async function togglePastConferencesMenu(showInMenu) {
  try {
    console.log(`🔍 ${showInMenu ? 'Showing' : 'Hiding'} Past Conferences in navigation menu...`);
    
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
        showInMenu: showInMenu,
        lastUpdated: new Date().toISOString()
      });
      
      console.log('✅ Created pastConference document:', newDoc._id);
      console.log(`🔧 Past Conferences is now ${showInMenu ? 'VISIBLE' : 'HIDDEN'} in navigation menu`);
    } else {
      console.log('📋 Document exists with ID:', result._id);
      console.log('🔧 Current showInMenu:', result.showInMenu);
      
      if (result.showInMenu !== showInMenu) {
        console.log(`🔄 Updating showInMenu to ${showInMenu}...`);
        
        const updatedDoc = await client
          .patch(result._id)
          .set({ 
            showInMenu: showInMenu,
            lastUpdated: new Date().toISOString()
          })
          .commit();
        
        console.log('✅ Updated pastConference document');
        console.log(`🔧 Past Conferences is now ${showInMenu ? 'VISIBLE' : 'HIDDEN'} in navigation menu`);
      } else {
        console.log(`✅ Past Conferences is already ${showInMenu ? 'VISIBLE' : 'HIDDEN'} in navigation menu`);
      }
    }
    
    // Verify the change
    console.log('\n🔍 Verifying current state...');
    const verifyResult = await client.fetch(query);
    console.log('📊 Final Configuration:');
    console.log('   showInMenu:', verifyResult?.showInMenu);
    console.log('   isActive:', verifyResult?.isActive);
    
    console.log(`\n🎉 SUCCESS: Past Conferences is now ${showInMenu ? 'visible' : 'hidden'} in the navigation menu!`);
    console.log('🔄 The frontend will update automatically within 10 seconds');
    console.log('🌐 You can verify at: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Parse command line arguments
if (action === 'show') {
  togglePastConferencesMenu(true);
} else if (action === 'hide') {
  togglePastConferencesMenu(false);
} else {
  console.log('📋 Past Conferences Navigation Toggle');
  console.log('');
  console.log('Usage:');
  console.log('  node toggle-past-conferences.js show    # Show Past Conferences in menu');
  console.log('  node toggle-past-conferences.js hide    # Hide Past Conferences from menu');
  console.log('');
  console.log('Current Status:');
  
  // Show current status
  client.fetch('*[_type == "pastConference"][0]{ showInMenu, isActive }')
    .then(result => {
      if (result) {
        console.log(`  Show in Menu: ${result.showInMenu}`);
        console.log(`  Is Active: ${result.isActive}`);
        console.log('');
        console.log(`💡 Past Conferences is currently ${result.showInMenu ? 'VISIBLE' : 'HIDDEN'} in navigation`);
      } else {
        console.log('  No configuration found');
      }
    })
    .catch(error => {
      console.error('Error checking status:', error);
    });
}
