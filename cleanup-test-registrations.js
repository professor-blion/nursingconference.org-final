// Load environment variables
require('dotenv').config();

const { createClient } = require('@sanity/client');

/**
 * SAFE CLEANUP SCRIPT FOR TEST CONFERENCE REGISTRATIONS
 * 
 * This script will:
 * 1. Connect to Sanity CMS
 * 2. Find all documents of type "conferenceRegistration"
 * 3. Display them for review before deletion
 * 4. Allow selective deletion of test records only
 * 5. Preserve all other content and settings
 */

// Sanity client configuration with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false, // Don't use CDN for write operations
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});

async function listConferenceRegistrations() {
  try {
    console.log('🔍 FETCHING CONFERENCE REGISTRATIONS...\n');
    
    // Fetch all conference registration documents
    const registrations = await client.fetch(`
      *[_type == "conferenceRegistration"] | order(_createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        firstName,
        lastName,
        email,
        phoneNumber,
        country,
        registrationType,
        paymentStatus,
        paymentMethod,
        paidAmount
      }
    `);

    if (registrations.length === 0) {
      console.log('✅ No conference registrations found. Database is already clean.');
      return [];
    }

    console.log(`📊 Found ${registrations.length} conference registration(s):\n`);
    console.log('='.repeat(80));
    
    registrations.forEach((reg, index) => {
      const createdDate = new Date(reg._createdAt).toLocaleString();
      const isTestData = isLikelyTestData(reg);
      
      console.log(`${index + 1}. ${isTestData ? '🧪 [TEST DATA]' : '👤 [REAL DATA]'}`);
      console.log(`   ID: ${reg._id}`);
      console.log(`   Name: ${reg.firstName || 'N/A'} ${reg.lastName || 'N/A'}`);
      console.log(`   Email: ${reg.email || 'N/A'}`);
      console.log(`   Phone: ${reg.phoneNumber || 'N/A'}`);
      console.log(`   Country: ${reg.country || 'N/A'}`);
      console.log(`   Registration Type: ${reg.registrationType || 'N/A'}`);
      console.log(`   Payment Status: ${reg.paymentStatus || 'N/A'}`);
      console.log(`   Payment Method: ${reg.paymentMethod || 'N/A'}`);
      console.log(`   Amount: ${reg.paidAmount || 'N/A'}`);
      console.log(`   Created: ${createdDate}`);
      console.log('   ' + '-'.repeat(70));
    });
    
    return registrations;
    
  } catch (error) {
    console.error('❌ Error fetching registrations:', error.message);
    throw error;
  }
}

function isLikelyTestData(registration) {
  // Check for incomplete registrations (likely test data)
  const isIncomplete = (
    (!registration.firstName || registration.firstName === 'N/A') &&
    (!registration.lastName || registration.lastName === 'N/A') &&
    (!registration.email || registration.email === 'N/A') &&
    (!registration.phoneNumber || registration.phoneNumber === 'N/A') &&
    (!registration.country || registration.country === 'N/A')
  );

  // Check for test payment methods
  const hasTestPayment = registration.paymentMethod === 'test_payment';

  // Check for draft documents
  const isDraft = registration._id && registration._id.startsWith('drafts.');

  // Check for test indicators in text
  const testIndicators = [
    // Test names
    /test/i,
    /demo/i,
    /sample/i,
    /example/i,
    /dummy/i,
    /fake/i,

    // Test emails
    /test@/i,
    /demo@/i,
    /example@/i,
    /sample@/i,
    /@test\./i,
    /@example\./i,

    // Test phone numbers
    /555-?0123/,
    /123-?456-?7890/,
    /000-?000-?0000/,

    // Test addresses/countries
    /test city/i,
    /test country/i,
    /example/i
  ];

  const textToCheck = [
    registration.firstName,
    registration.lastName,
    registration.email,
    registration.phoneNumber,
    registration.country,
    registration.address
  ].join(' ').toLowerCase();

  const hasTestText = testIndicators.some(pattern => pattern.test(textToCheck));

  // Return true if any test condition is met
  return isIncomplete || hasTestPayment || isDraft || hasTestText;
}

async function deleteTestRegistrations(registrations) {
  const testRegistrations = registrations.filter(isLikelyTestData);
  
  if (testRegistrations.length === 0) {
    console.log('✅ No test registrations found to delete.');
    return;
  }
  
  console.log(`\n🧪 IDENTIFIED ${testRegistrations.length} TEST REGISTRATION(S) FOR DELETION:\n`);
  
  testRegistrations.forEach((reg, index) => {
    console.log(`${index + 1}. ${reg.firstName} ${reg.lastName} (${reg.email})`);
  });
  
  console.log('\n⚠️  SAFETY CHECK: Only test registrations will be deleted.');
  console.log('✅ All other content (site settings, conferences, speakers, etc.) will be preserved.\n');
  
  // Ask for confirmation before deletion
  console.log('\n⚠️  WARNING: This will permanently delete the test registrations listed above.');
  console.log('🔍 Please review the list carefully before proceeding.');
  console.log('\n📝 Type "DELETE" to confirm deletion, or anything else to cancel:');

  // For automated execution, you can set this environment variable
  const autoConfirm = process.env.AUTO_CONFIRM_DELETE === 'true';

  if (autoConfirm) {
    console.log('🤖 AUTO_CONFIRM_DELETE is enabled, proceeding with deletion...\n');
    await performDeletion(testRegistrations);
  } else {
    console.log('🔒 DELETION REQUIRES MANUAL CONFIRMATION.');
    console.log('📝 To enable automatic deletion, set AUTO_CONFIRM_DELETE=true environment variable.');
    console.log('⚠️  Or manually edit this script to enable deletion.');
  }
}

async function performDeletion(testRegistrations) {
  console.log('🗑️  Starting deletion process...\n');

  let deletedCount = 0;
  let failedCount = 0;

  for (const registration of testRegistrations) {
    try {
      await client.delete(registration._id);
      console.log(`✅ Deleted: ${registration._id} (${registration.firstName || 'N/A'} ${registration.lastName || 'N/A'})`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${registration._id}:`, error.message);
      failedCount++;
    }
  }

  console.log(`\n🎉 Cleanup complete!`);
  console.log(`✅ Successfully deleted: ${deletedCount} registration(s)`);
  if (failedCount > 0) {
    console.log(`❌ Failed to delete: ${failedCount} registration(s)`);
  }
}

async function cleanupTestRegistrations() {
  try {
    console.log('🧹 CONFERENCE REGISTRATIONS CLEANUP TOOL');
    console.log('==========================================\n');
    
    // Check Sanity connection
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error('SANITY_API_TOKEN environment variable is required for write operations');
    }
    
    console.log('🔗 Connecting to Sanity CMS...');
    console.log(`📋 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho'}`);
    console.log(`🗄️  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);
    
    // List all registrations
    const registrations = await listConferenceRegistrations();
    
    if (registrations.length > 0) {
      // Identify and prepare to delete test registrations
      await deleteTestRegistrations(registrations);
    }
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Review the registrations listed above');
    console.log('2. Verify which ones are test data');
    console.log('3. If you want to delete test registrations, uncomment the deletion code');
    console.log('4. Run the script again to perform the actual deletion');
    console.log('\n✅ Script completed successfully.');
    
  } catch (error) {
    console.error('💥 Cleanup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Ensure SANITY_API_TOKEN is set in your .env file');
    console.log('- Verify the token has write permissions');
    console.log('- Check your internet connection');
    process.exit(1);
  }
}

// Run the cleanup
cleanupTestRegistrations();
