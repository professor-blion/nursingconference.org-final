// Test Sanity connection and footer text
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
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
