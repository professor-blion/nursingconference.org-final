// Load environment variables
require('dotenv').config();

const { createClient } = require('@sanity/client');

/**
 * COMPREHENSIVE CLEANUP SCRIPT FOR REFERENCED TEST REGISTRATIONS
 * 
 * This script will:
 * 1. Find all remaining conference registrations
 * 2. Find documents that reference them
 * 3. Delete the referencing documents first
 * 4. Then delete the referenced registrations
 * 5. Clean up any remaining test data
 */

// Sanity client configuration with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false, // Don't use CDN for write operations
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});

async function findAllRemainingRegistrations() {
  try {
    console.log('🔍 FINDING ALL REMAINING CONFERENCE REGISTRATIONS...\n');
    
    // Fetch all remaining conference registration documents
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

    console.log(`📊 Found ${registrations.length} remaining conference registration(s):\n`);
    
    if (registrations.length === 0) {
      console.log('✅ No conference registrations found. Database is completely clean.');
      return [];
    }

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
    console.error('❌ Error fetching remaining registrations:', error.message);
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
    /test/i, /demo/i, /sample/i, /example/i, /dummy/i, /fake/i,
    /test@/i, /demo@/i, /example@/i, /sample@/i, /@test\./i, /@example\./i,
    /555-?0123/, /123-?456-?7890/, /000-?000-?0000/,
    /test city/i, /test country/i, /example/i
  ];
  
  const textToCheck = [
    registration.firstName, registration.lastName, registration.email,
    registration.phoneNumber, registration.country, registration.address
  ].join(' ').toLowerCase();
  
  const hasTestText = testIndicators.some(pattern => pattern.test(textToCheck));
  
  return isIncomplete || hasTestPayment || isDraft || hasTestText;
}

async function findReferencingDocuments(registrationIds) {
  try {
    console.log('\n🔗 FINDING DOCUMENTS THAT REFERENCE THESE REGISTRATIONS...\n');
    
    const referencingDocs = [];
    
    for (const regId of registrationIds) {
      // Find all documents that reference this registration
      const refs = await client.fetch(`
        *[references($regId)] {
          _id,
          _type,
          _createdAt
        }
      `, { regId });
      
      if (refs.length > 0) {
        console.log(`📎 Registration ${regId} is referenced by:`);
        refs.forEach(ref => {
          console.log(`   - ${ref._type}: ${ref._id} (created: ${new Date(ref._createdAt).toLocaleString()})`);
          referencingDocs.push(ref);
        });
        console.log('');
      }
    }
    
    return referencingDocs;
    
  } catch (error) {
    console.error('❌ Error finding referencing documents:', error.message);
    throw error;
  }
}

async function deleteReferencingDocuments(referencingDocs) {
  if (referencingDocs.length === 0) {
    console.log('✅ No referencing documents found to delete.\n');
    return;
  }
  
  console.log(`🗑️  DELETING ${referencingDocs.length} REFERENCING DOCUMENT(S)...\n`);
  
  let deletedCount = 0;
  let failedCount = 0;
  
  for (const doc of referencingDocs) {
    try {
      await client.delete(doc._id);
      console.log(`✅ Deleted referencing document: ${doc._type} (${doc._id})`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Failed to delete referencing document ${doc._id}:`, error.message);
      failedCount++;
    }
  }
  
  console.log(`\n📊 Referencing documents cleanup:`);
  console.log(`✅ Successfully deleted: ${deletedCount}`);
  if (failedCount > 0) {
    console.log(`❌ Failed to delete: ${failedCount}`);
  }
  console.log('');
}

async function deleteTestRegistrations(registrations) {
  const testRegistrations = registrations.filter(isLikelyTestData);
  
  if (testRegistrations.length === 0) {
    console.log('✅ No test registrations found to delete.\n');
    return;
  }
  
  console.log(`🗑️  DELETING ${testRegistrations.length} TEST REGISTRATION(S)...\n`);
  
  let deletedCount = 0;
  let failedCount = 0;
  
  for (const registration of testRegistrations) {
    try {
      await client.delete(registration._id);
      console.log(`✅ Deleted registration: ${registration._id} (${registration.firstName || 'N/A'} ${registration.lastName || 'N/A'})`);
      deletedCount++;
    } catch (error) {
      console.error(`❌ Failed to delete registration ${registration._id}:`, error.message);
      failedCount++;
    }
  }
  
  console.log(`\n📊 Registration cleanup:`);
  console.log(`✅ Successfully deleted: ${deletedCount}`);
  if (failedCount > 0) {
    console.log(`❌ Failed to delete: ${failedCount}`);
  }
  
  return { deletedCount, failedCount };
}

async function comprehensiveCleanup() {
  try {
    console.log('🧹 COMPREHENSIVE CONFERENCE REGISTRATIONS CLEANUP');
    console.log('==================================================\n');
    
    // Check Sanity connection
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error('SANITY_API_TOKEN environment variable is required for write operations');
    }
    
    console.log('🔗 Connecting to Sanity CMS...');
    console.log(`📋 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho'}`);
    console.log(`🗄️  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);
    
    // Step 1: Find all remaining registrations
    const registrations = await findAllRemainingRegistrations();
    
    if (registrations.length === 0) {
      console.log('🎉 Database is already completely clean!');
      return;
    }
    
    // Step 2: Find test registrations
    const testRegistrations = registrations.filter(isLikelyTestData);
    const testRegistrationIds = testRegistrations.map(reg => reg._id);
    
    if (testRegistrationIds.length === 0) {
      console.log('✅ No test registrations found. All remaining registrations appear to be legitimate.');
      return;
    }
    
    console.log(`\n🧪 Identified ${testRegistrationIds.length} test registrations for cleanup.`);
    
    // Step 3: Find and delete referencing documents
    const referencingDocs = await findReferencingDocuments(testRegistrationIds);
    await deleteReferencingDocuments(referencingDocs);
    
    // Step 4: Delete the test registrations
    const result = await deleteTestRegistrations(testRegistrations);
    
    // Step 5: Final verification
    console.log('\n🔍 FINAL VERIFICATION...');
    const finalCheck = await client.fetch('*[_type == "conferenceRegistration"]');
    console.log(`📊 Remaining conference registrations: ${finalCheck.length}`);
    
    if (finalCheck.length === 0) {
      console.log('🎉 SUCCESS! All test registrations have been completely removed!');
    } else {
      console.log(`ℹ️  ${finalCheck.length} registration(s) remain (likely legitimate data).`);
    }
    
    console.log('\n✅ Comprehensive cleanup completed successfully.');
    
  } catch (error) {
    console.error('💥 Comprehensive cleanup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Ensure SANITY_API_TOKEN is set in your .env file');
    console.log('- Verify the token has write permissions');
    console.log('- Check your internet connection');
    process.exit(1);
  }
}

// Run the comprehensive cleanup
comprehensiveCleanup();
