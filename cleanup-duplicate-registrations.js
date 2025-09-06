const { createClient } = require('@sanity/client');

console.log('🧹 CLEANING UP DUPLICATE REGISTRATIONS');
console.log('=====================================\n');

// Use the same configuration as the app
const writeClient = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  useCdn: false,
});

async function cleanupDuplicates() {
  try {
    console.log('🔍 Finding duplicate registrations...');

    // Get all conference registrations
    const allRegistrations = await writeClient.fetch(`
      *[_type == "conferenceRegistration"] {
        _id,
        registrationId,
        personalDetails,
        _createdAt
      } | order(_createdAt desc)
    `);

    console.log(`📊 Found ${allRegistrations.length} total registrations`);

    // Group by registrationId to find duplicates
    const registrationGroups = {};
    allRegistrations.forEach(reg => {
      const regId = reg.registrationId;
      if (!registrationGroups[regId]) {
        registrationGroups[regId] = [];
      }
      registrationGroups[regId].push(reg);
    });

    // Find duplicates
    const duplicateGroups = Object.entries(registrationGroups).filter(([regId, regs]) => regs.length > 1);

    console.log(`🔍 Found ${duplicateGroups.length} duplicate registration groups:`);

    let deletedCount = 0;

    for (const [regId, duplicates] of duplicateGroups) {
      console.log(`\n📋 Processing duplicates for ${regId}:`);

      // Sort by creation date (newest first)
      duplicates.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));

      // Keep the newest one, delete the rest
      const toKeep = duplicates[0];
      const toDelete = duplicates.slice(1);

      console.log(`  ✅ Keeping: ${toKeep._id} (created: ${toKeep._createdAt})`);

      for (const duplicate of toDelete) {
        try {
          // First, find and delete any payment records that reference this registration
          const paymentRecords = await writeClient.fetch(`
            *[_type == "paymentRecord" && (registrationId == "${duplicate.registrationId}" || registrationRef._ref == "${duplicate._id}")]
          `);

          for (const payment of paymentRecords) {
            console.log(`    🗑️  Deleting payment record: ${payment._id}`);
            await writeClient.delete(payment._id);
          }

          console.log(`  🗑️  Deleting: ${duplicate._id} (created: ${duplicate._createdAt})`);
          await writeClient.delete(duplicate._id);
          deletedCount++;
        } catch (error) {
          console.error(`  ❌ Failed to delete ${duplicate._id}:`, error.message);
        }
      }
    }

    // Also clean up any test documents
    console.log('\n🧪 Cleaning up test documents...');
    const testDocs = await writeClient.fetch(`
      *[_type == "conferenceRegistration" && registrationId match "TEST-*"] {
        _id,
        registrationId
      }
    `);

    console.log(`🔍 Found ${testDocs.length} test documents to clean up`);
    
    for (const testDoc of testDocs) {
      try {
        console.log(`  🗑️  Deleting test doc: ${testDoc._id} (${testDoc.registrationId})`);
        await writeClient.delete(testDoc._id);
        deletedCount++;
      } catch (error) {
        console.error(`  ❌ Failed to delete test doc ${testDoc._id}:`, error.message);
      }
    }

    // Clean up orphaned payment records
    console.log('\n💳 Cleaning up orphaned payment records...');
    const paymentRecords = await writeClient.fetch(`
      *[_type == "paymentRecord"] {
        _id,
        registrationId,
        paymentId
      }
    `);

    const validRegistrationIds = Object.keys(registrationGroups).filter(regId => 
      !regId.startsWith('TEST-')
    );

    let orphanedPayments = 0;
    for (const payment of paymentRecords) {
      if (!validRegistrationIds.includes(payment.registrationId) || payment.registrationId.startsWith('TEST-')) {
        try {
          console.log(`  🗑️  Deleting orphaned payment: ${payment._id} (${payment.paymentId})`);
          await writeClient.delete(payment._id);
          orphanedPayments++;
        } catch (error) {
          console.error(`  ❌ Failed to delete payment ${payment._id}:`, error.message);
        }
      }
    }

    console.log('\n✅ CLEANUP COMPLETED!');
    console.log(`📊 Summary:`);
    console.log(`  - Deleted ${deletedCount} duplicate/test registrations`);
    console.log(`  - Deleted ${orphanedPayments} orphaned payment records`);
    console.log(`  - Remaining unique registrations: ${Object.keys(registrationGroups).length - duplicateGroups.length}`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupDuplicates();
