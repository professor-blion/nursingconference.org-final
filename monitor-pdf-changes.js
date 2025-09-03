const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n'
});

async function monitorPDFChanges() {
  console.log('🔄 Monitoring PDF changes...');
  console.log('Upload a new PDF in Sanity Studio and watch for changes here.\n');
  
  let lastUpdate = null;
  let lastFilename = null;
  let lastURL = null;
  
  const checkForChanges = async () => {
    try {
      const doc = await client.fetch(`*[_type == "brochureSettings" && _id == "brochureSettings"][0] {
        pdfFile {
          asset-> {
            originalFilename,
            url
          }
        },
        _updatedAt
      }`);
      
      if (doc) {
        const currentUpdate = doc._updatedAt;
        const currentFilename = doc.pdfFile?.asset?.originalFilename;
        const currentURL = doc.pdfFile?.asset?.url;
        
        if (lastUpdate === null) {
          // First check
          lastUpdate = currentUpdate;
          lastFilename = currentFilename;
          lastURL = currentURL;
          console.log(`📋 Initial state:`);
          console.log(`  PDF: ${currentFilename || 'No PDF'}`);
          console.log(`  Updated: ${currentUpdate}`);
          console.log(`  URL: ${currentURL || 'No URL'}`);
          console.log('\n⏳ Waiting for changes...\n');
        } else if (currentUpdate !== lastUpdate || currentFilename !== lastFilename || currentURL !== lastURL) {
          // Change detected!
          console.log(`🎉 CHANGE DETECTED! ${new Date().toLocaleTimeString()}`);
          console.log(`📄 Old PDF: ${lastFilename || 'No PDF'}`);
          console.log(`📄 New PDF: ${currentFilename || 'No PDF'}`);
          console.log(`🔗 Old URL: ${lastURL || 'No URL'}`);
          console.log(`🔗 New URL: ${currentURL || 'No URL'}`);
          console.log(`⏰ Updated: ${currentUpdate}`);
          
          // Update tracking variables
          lastUpdate = currentUpdate;
          lastFilename = currentFilename;
          lastURL = currentURL;
          
          console.log('\n✅ Change successfully detected in Sanity!');
          console.log('Now test the frontend to see if it reflects the change.\n');
          console.log('⏳ Continuing to monitor for more changes...\n');
        }
      }
    } catch (error) {
      console.error('❌ Error checking for changes:', error.message);
    }
  };
  
  // Check immediately
  await checkForChanges();
  
  // Then check every 2 seconds
  const interval = setInterval(checkForChanges, 2000);
  
  // Stop after 5 minutes
  setTimeout(() => {
    clearInterval(interval);
    console.log('\n⏹️ Monitoring stopped after 5 minutes.');
    console.log('Run the script again if you want to continue monitoring.');
  }, 5 * 60 * 1000);
  
  console.log('Press Ctrl+C to stop monitoring early.');
}

monitorPDFChanges();
