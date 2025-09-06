// Load environment variables
require('dotenv').config();

const { createClient } = require('next-sanity');

// Sanity write client for creating documents
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Required for writes
});

async function populateReceiptSettings() {
  console.log('🧾 POPULATING RECEIPT SETTINGS IN SANITY...');
  console.log('=' .repeat(60));

  try {
    // Check if receipt settings already exist
    const existingSettings = await sanityWriteClient.fetch(
      `*[_type == "receiptSettings" && _id == "receipt-settings-main"][0]`
    );

    if (existingSettings) {
      console.log('⚠️  Receipt settings already exist');
      console.log(`📋 Current conference title: "${existingSettings.conferenceTitle}"`);
      console.log(`🏢 Current company name: "${existingSettings.companyName}"`);
      console.log('✅ You can edit these in Sanity Studio');
      return;
    }

    // Create default receipt settings document
    const receiptSettings = {
      _type: 'receiptSettings',
      _id: 'receipt-settings-main',
      title: 'Payment Receipt Configuration',
      conferenceTitle: 'International Nursing Conference 2025',
      companyName: 'Intelli Global Conferences',
      receiptTemplate: {
        useBlueHeader: true,
        headerColor: {
          hex: '#4267B2'
        },
        logoSize: {
          width: 72,
          height: 24
        }
      },
      emailSettings: {
        senderName: 'Intelli Global Conferences',
        senderEmail: 'contactus@intelliglobalconferences.com',
        subjectLine: 'Payment Receipt - International Nursing Conference 2025',
        emailTemplate: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #4267B2 0%, #5a7bc8 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px;">
    <h1 style="margin: 0; font-size: 24px;">Payment Receipt</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">{{conferenceTitle}}</p>
  </div>
  
  <div style="padding: 30px 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #4267B2; margin: 0 0 15px 0;">Dear {{customerName}},</h2>
    <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
      Thank you for your registration! Your payment has been successfully processed.
    </p>
    <p style="color: #333; line-height: 1.6; margin: 0;">
      Transaction ID: <strong>{{transactionId}}</strong>
    </p>
  </div>
  
  <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
    <p>For any questions, please contact us at {{supportEmail}}</p>
    <p>© 2025 {{conferenceTitle}}</p>
  </div>
</div>`
      },
      contactInformation: {
        supportEmail: 'contactus@intelliglobalconferences.com',
        phone: '+1-555-0123',
        website: 'https://intelliglobalconferences.com'
      },
      pdfSettings: {
        enablePdfAttachment: true,
        storePdfInSanity: true,
        pdfFilenameFormat: 'Payment_Receipt_{{transactionId}}.pdf'
      },
      isActive: true,
      lastUpdated: new Date().toISOString()
    };

    // Create the document in Sanity
    const result = await sanityWriteClient.create(receiptSettings);

    console.log('✅ RECEIPT SETTINGS CREATED SUCCESSFULLY!');
    console.log('=' .repeat(40));
    console.log(`📋 Document ID: ${result._id}`);
    console.log(`📋 Conference Title: "${result.conferenceTitle}"`);
    console.log(`🏢 Company Name: "${result.companyName}"`);
    console.log(`📧 Sender Email: "${result.emailSettings.senderEmail}"`);
    console.log(`🎨 Blue Header Enabled: ${result.receiptTemplate.useBlueHeader}`);
    console.log('=' .repeat(40));

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Visit Sanity Studio: http://localhost:3333/structure/');
    console.log('2. Click on "Receipt & Email Settings"');
    console.log('3. Edit the "Conference Title" field to change:');
    console.log('   "International Nursing Conference 2025"');
    console.log('4. This will update BOTH email and PDF receipts automatically');

    console.log('\n🔧 ADMIN PANEL ACCESS:');
    console.log('- Frontend Admin: http://localhost:3001/admin/receipt-settings');
    console.log('- Sanity Studio: https://nursing-conferences-cms.sanity.studio/');

  } catch (error) {
    console.error('❌ FAILED TO CREATE RECEIPT SETTINGS:');
    console.error(`Error: ${error.message}`);
    
    if (error.message.includes('token')) {
      console.log('\n🔑 SANITY TOKEN ISSUE:');
      console.log('- Make sure SANITY_API_TOKEN is set in your .env file');
      console.log('- The token needs write permissions');
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🧾 RECEIPT SETTINGS POPULATION COMPLETE');
  console.log('=' .repeat(60));
}

// Run the population script
populateReceiptSettings().catch(console.error);
