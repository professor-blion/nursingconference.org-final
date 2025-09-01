const { createClient } = require('@sanity/client');

// This script sets up a webhook for automatic revalidation
// Run this once to configure the webhook

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You need to set this environment variable
});

async function setupWebhook() {
  try {
    console.log('Setting up webhook for automatic revalidation...');
    
    const webhook = {
      name: 'Next.js Auto Revalidation',
      url: 'http://localhost:3000/api/revalidate', // Change to your production URL
      dataset: 'production',
      trigger: 'mutation',
      filter: '_type in ["siteSettings", "conferenceEvent", "aboutUs", "heroSection"]',
      includeDrafts: false,
      httpMethod: 'POST',
      apiVersion: 'v2021-06-07',
      headers: {
        'Content-Type': 'application/json',
      },
      projection: `{
        "_type": _type,
        "_id": _id,
        "slug": slug.current
      }`
    };

    // Note: This requires a management token with webhook permissions
    // For now, this is just a template - you'll need to set up the webhook manually
    // through the Sanity management interface at https://www.sanity.io/manage
    
    console.log('Webhook configuration:');
    console.log(JSON.stringify(webhook, null, 2));
    
    console.log('\nTo set up the webhook:');
    console.log('1. Go to https://www.sanity.io/manage');
    console.log('2. Select your project: Eventapp');
    console.log('3. Go to API > Webhooks');
    console.log('4. Click "Create webhook"');
    console.log('5. Use the configuration above');
    
  } catch (error) {
    console.error('Error setting up webhook:', error);
  }
}

setupWebhook();
