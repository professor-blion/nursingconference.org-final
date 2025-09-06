const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  apiVersion: '2023-05-03'
});

async function updateContentField() {
  try {
    // Get the aboutUsSection document that contains the old content
    const brandingData = await client.fetch(`*[_type == "aboutUsSection"][0]`);

    if (!brandingData) {
      console.log('No aboutUsSection data found');
      return;
    }

    console.log('Current aboutUsSection data:', brandingData);

    // Create the new content based on the current branding
    const primaryBrandName = brandingData.primaryBrandName || 'Nursing';
    const secondaryBrandText = brandingData.secondaryBrandText || 'Conference 2026';

    const newContent = `${primaryBrandName} ${secondaryBrandText} is dedicated to advancing research by bringing together leading medical professionals, researchers, engineers, and scientists. Through our international conferences, events, and exhibitions, we aim to keep the global community informed about developments in the scientific field. Our goal is to foster collaboration among experienced scholars, early-career researchers, and industry experts by building strong networks across academia and the market. We strive to enhance the quality and impact of scientific exchange through our events.`;

    // Update the content field
    const result = await client
      .patch(brandingData._id)
      .set({ content: newContent })
      .commit();

    console.log('Successfully updated content field:', result);
    console.log('New content:', newContent);

  } catch (error) {
    console.error('Error updating content field:', error);
  }
}

updateContentField();
