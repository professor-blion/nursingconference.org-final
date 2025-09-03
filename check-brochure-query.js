const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n'
});

async function testBrochureQueries() {
  try {
    console.log('🔍 Testing different brochure queries...\n');
    
    // Query 1: Current API query (what's being used)
    const query1 = `*[_type == "brochureSettings" && active == true][0] {
      _id,
      title,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename
        }
      },
      active
    }`;
    
    const result1 = await client.fetch(query1);
    console.log('📋 Current API Query Result (first active):');
    console.log(`  ID: ${result1?._id}`);
    console.log(`  Title: ${result1?.title}`);
    console.log(`  PDF: ${result1?.pdfFile?.asset?.originalFilename}`);
    console.log(`  URL: ${result1?.pdfFile?.asset?.url}`);
    
    // Query 2: Get the document with ID "brochureSettings" (singleton pattern)
    const query2 = `*[_type == "brochureSettings" && _id == "brochureSettings"][0] {
      _id,
      title,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename
        }
      },
      active
    }`;
    
    const result2 = await client.fetch(query2);
    console.log('\n📋 Singleton Document Query Result:');
    console.log(`  ID: ${result2?._id}`);
    console.log(`  Title: ${result2?.title}`);
    console.log(`  PDF: ${result2?.pdfFile?.asset?.originalFilename}`);
    console.log(`  URL: ${result2?.pdfFile?.asset?.url}`);
    
    // Query 3: Get all active, ordered by lastUpdated
    const query3 = `*[_type == "brochureSettings" && active == true] | order(lastUpdated desc) {
      _id,
      title,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename
        }
      },
      active,
      lastUpdated
    }`;
    
    const result3 = await client.fetch(query3);
    console.log('\n📋 All Active Documents (by lastUpdated):');
    result3.forEach((doc, index) => {
      console.log(`  ${index + 1}. ID: ${doc._id}`);
      console.log(`     Title: ${doc.title}`);
      console.log(`     PDF: ${doc.pdfFile?.asset?.originalFilename}`);
      console.log(`     Last Updated: ${doc.lastUpdated}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing queries:', error);
  }
}

testBrochureQueries();
