const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n'
});

async function checkBrochureSettings() {
  try {
    const query = `*[_type == "brochureSettings"] {
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
    }`;
    
    const settings = await client.fetch(query);
    console.log('📄 Current Brochure Settings:');
    console.log(JSON.stringify(settings, null, 2));
    
    if (settings.length === 0) {
      console.log('❌ No brochure settings found!');
    } else {
      settings.forEach((setting, index) => {
        console.log(`\n📋 Setting ${index + 1}:`);
        console.log(`  Title: ${setting.title}`);
        console.log(`  Active: ${setting.active}`);
        console.log(`  PDF URL: ${setting.pdfFile?.asset?.url || 'No PDF'}`);
        console.log(`  PDF Filename: ${setting.pdfFile?.asset?.originalFilename || 'N/A'}`);
        console.log(`  Downloads: ${setting.downloadCount || 0}`);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching brochure settings:', error);
  }
}

checkBrochureSettings();
