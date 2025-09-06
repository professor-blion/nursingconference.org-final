// Check current footer text in Sanity
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('API_VERSION:', process.env.NEXT_PUBLIC_SANITY_API_VERSION);
console.log('TOKEN exists:', !!process.env.SANITY_API_TOKEN);

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

async function checkFooterText() {
  try {
    console.log('\n🔍 Checking footer text in Sanity...');

    const query = '*[_type == "siteSettings"][0]{ _id, footerContent }';
    const result = await client.fetch(query);

    console.log('📋 Site Settings ID:', result?._id || 'NOT FOUND');
    console.log('📝 Footer Content:', JSON.stringify(result?.footerContent, null, 2));

    if (result?.footerContent?.footerText) {
      console.log('\n✅ Footer Text Found:');
      console.log('"' + result.footerContent.footerText + '"');
    } else {
      console.log('\n❌ Footer Text NOT FOUND');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

checkFooterText();
