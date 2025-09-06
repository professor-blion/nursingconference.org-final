const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  apiVersion: '2023-05-03'
});

async function checkBrandingData() {
  try {
    console.log('Checking all document types...');
    
    // Check all documents
    const allDocs = await client.fetch(`*[]{_type, _id, title}`);
    console.log('All documents:', allDocs);
    
    // Check specifically for aboutOrganization
    const aboutOrg = await client.fetch(`*[_type == "aboutOrganization"]`);
    console.log('About Organization documents:', aboutOrg);
    
    // Check for any document with branding fields
    const brandingDocs = await client.fetch(`*[defined(primaryBrandName) || defined(secondaryBrandText)]`);
    console.log('Documents with branding fields:', brandingDocs);
    
  } catch (error) {
    console.error('Error checking branding data:', error);
  }
}

checkBrandingData();
