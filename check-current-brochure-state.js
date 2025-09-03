const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n'
});

async function checkCurrentState() {
  try {
    console.log('🔍 Checking current brochure settings state...\n');
    
    const settings = await client.fetch(`*[_type == "brochureSettings"] {
      _id,
      title,
      description,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename,
          size,
          mimeType
        }
      },
      active,
      downloadCount,
      lastUpdated
    }`);
    
    console.log(`Found ${settings.length} brochure settings documents:`);
    settings.forEach((setting, index) => {
      console.log(`\n📋 Document ${index + 1}:`);
      console.log(`  ID: ${setting._id}`);
      console.log(`  Title: ${setting.title}`);
      console.log(`  Active: ${setting.active}`);
      console.log(`  PDF URL: ${setting.pdfFile?.asset?.url || 'No PDF'}`);
      console.log(`  PDF Filename: ${setting.pdfFile?.asset?.originalFilename || 'N/A'}`);
      console.log(`  Downloads: ${setting.downloadCount || 0}`);
      console.log(`  Last Updated: ${setting.lastUpdated}`);
    });
    
    // Test the API endpoint
    console.log('\n🌐 Testing API endpoint...');
    const fetch = require('node-fetch');
    try {
      const response = await fetch('http://localhost:3000/api/brochure/download');
      const apiResult = await response.json();
      
      if (apiResult.success) {
        console.log('✅ API Response:');
        console.log(`  Title: ${apiResult.title}`);
        console.log(`  Filename: ${apiResult.filename}`);
        console.log(`  Download URL: ${apiResult.downloadUrl}`);
        console.log(`  Size: ${apiResult.size} bytes`);
      } else {
        console.log('❌ API Error:', apiResult.error);
      }
    } catch (apiError) {
      console.log('❌ Failed to test API:', apiError.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking state:', error);
  }
}

checkCurrentState();
