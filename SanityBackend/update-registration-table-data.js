// Load environment variables
require('dotenv').config();

const { createClient } = require('@sanity/client');

/**
 * Update existing registrations with new table structure data
 * This script populates the registrationTable field for existing registrations
 */

// Sanity client configuration with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false, // Don't use CDN for write operations
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});

async function updateRegistrationTableData() {
  try {
    console.log('🔄 UPDATING REGISTRATION TABLE DATA...\n');
    
    // Check Sanity connection
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error('SANITY_API_TOKEN environment variable is required for write operations');
    }
    
    console.log('🔗 Connecting to Sanity CMS...');
    console.log(`📋 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho'}`);
    console.log(`🗄️  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);
    
    // Fetch all existing registrations
    const registrations = await client.fetch(`
      *[_type == "conferenceRegistration"] {
        _id,
        registrationId,
        registrationType,
        personalDetails {
          title,
          firstName,
          lastName,
          email,
          phoneNumber,
          country,
          fullPostalAddress
        },
        pricing {
          totalPrice,
          currency
        },
        paymentStatus,
        paypalTransactionId,
        paymentId,
        paymentDate,
        registrationDate,
        pdfReceipt
      }
    `);
    
    console.log(`📊 Found ${registrations.length} registration(s) to update\n`);
    
    if (registrations.length === 0) {
      console.log('✅ No registrations found to update.');
      return;
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const registration of registrations) {
      try {
        // Check if registrationTable already exists
        if (registration.registrationTable) {
          console.log(`⏭️  Skipping ${registration._id} - already has table data`);
          skippedCount++;
          continue;
        }
        
        // Prepare table data
        const tableData = {
          paypalTransactionId: registration.paypalTransactionId || registration.paymentId || 'N/A',
          registrationType: registration.registrationType || 'regular',
          participantName: getFullName(registration),
          phoneNumber: registration.personalDetails?.phoneNumber || 'N/A',
          emailAddress: registration.personalDetails?.email || 'N/A',
          paymentAmount: registration.pricing?.totalPrice || 0,
          currency: registration.pricing?.currency || 'USD',
          paymentStatus: mapPaymentStatus(registration.paymentStatus),
          registrationDate: registration.registrationDate || registration.paymentDate || new Date().toISOString(),
          // PDF receipt will be populated when receipts are generated
          pdfReceiptFile: registration.pdfReceipt || null
        };
        
        // Update the registration with table data
        await client
          .patch(registration._id)
          .set({
            registrationTable: tableData
          })
          .commit();
        
        console.log(`✅ Updated ${registration._id} - ${tableData.participantName}`);
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Failed to update ${registration._id}:`, error.message);
      }
    }
    
    console.log(`\n📊 UPDATE SUMMARY:`);
    console.log(`✅ Successfully updated: ${updatedCount} registration(s)`);
    console.log(`⏭️  Skipped (already updated): ${skippedCount} registration(s)`);
    console.log(`❌ Failed: ${registrations.length - updatedCount - skippedCount} registration(s)`);
    
    console.log('\n🎉 Registration table data update completed!');
    
  } catch (error) {
    console.error('💥 Update failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Ensure SANITY_API_TOKEN is set in your .env file');
    console.log('- Verify the token has write permissions');
    console.log('- Check your internet connection');
    process.exit(1);
  }
}

function getFullName(registration) {
  const { title, firstName, lastName } = registration.personalDetails || {};
  const nameParts = [title, firstName, lastName].filter(Boolean);
  return nameParts.length > 0 ? nameParts.join(' ') : 'N/A';
}

function mapPaymentStatus(status) {
  switch (status) {
    case 'completed':
      return 'successful';
    case 'pending':
      return 'pending';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}

// Run the update
updateRegistrationTableData();
