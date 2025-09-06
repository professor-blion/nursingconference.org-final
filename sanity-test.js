// Test Sanity connection and footer text
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n'
});

async function testConnection() {
  try {
    console.log('🔍 Testing Sanity connection...');
    
    // Test basic connection
    const query = '*[_type == "siteSettings"][0]{ _id, footerContent }';
    const result = await client.fetch(query);
    
    console.log('✅ Connection successful!');
    console.log('📋 Site Settings ID:', result?._id);
    console.log('📝 Footer Content exists:', !!result?.footerContent);
    
    if (result?.footerContent) {
      console.log('🔍 Footer Content keys:', Object.keys(result.footerContent));
      console.log('📄 Footer Text:', result.footerContent.footerText);
    }
    
    // Test if we can update the footer text
    if (result?._id) {
      console.log('\n🔄 Testing update capability...');
      const testText = 'Main descriptive text that appears in the footer section about your organization - UPDATED ' + new Date().toISOString();
      
      const updateResult = await client
        .patch(result._id)
        .set({ 'footerContent.footerText': testText })
        .commit();
        
      console.log('✅ Update successful!');
      console.log('📝 New footer text:', testText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
