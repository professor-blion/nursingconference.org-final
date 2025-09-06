// Script to populate footer text field in site settings
require('dotenv').config();

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

const defaultFooterText = `We at Nursing Conference 2026 built an ecosystem that brings the Scholars, people in the Scientific Study & Research, knowledge group of the society, the students, learners and more on a common ground – to share their knowledge, on the scientific progress that brings along the benefits to humanity and to our existence itself.`;

async function populateFooterText() {
  try {
    console.log('🔍 Checking for existing site settings...');
    
    const query = '*[_type == "siteSettings"][0]{ _id, footerContent }';
    const siteSettings = await client.fetch(query);
    
    if (!siteSettings) {
      console.log('❌ No site settings document found!');
      console.log('💡 Please create site settings first through Sanity Studio');
      return;
    }
    
    console.log('📋 Found site settings document:', siteSettings._id);
    
    // Check if footerText already exists
    if (siteSettings.footerContent?.footerText) {
      console.log('✅ Footer text already exists:');
      console.log(`"${siteSettings.footerContent.footerText}"`);
      console.log('');
      console.log('🔧 To update the footer text, please use Sanity Studio:');
      console.log('   http://localhost:3333/structure/siteSettings');
      return;
    }
    
    console.log('🔄 Adding footer text to site settings...');
    
    // Update the site settings with footer text
    const updatedDoc = await client
      .patch(siteSettings._id)
      .setIfMissing({ 'footerContent.footerText': defaultFooterText })
      .commit();
    
    console.log('✅ Successfully added footer text to site settings!');
    console.log('');
    console.log('📝 Footer text added:');
    console.log(`"${defaultFooterText}"`);
    console.log('');
    console.log('🎉 You can now edit this text in Sanity Studio:');
    console.log('   http://localhost:3333/structure/siteSettings');
    console.log('   Go to Footer Content → Footer Description Text');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

populateFooterText();
