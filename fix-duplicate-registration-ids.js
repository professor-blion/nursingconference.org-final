/**
 * Fix duplicate registration IDs in Sanity
 * This script will:
 * 1. Find all registrations with duplicate registrationId values
 * 2. Keep the most recent registration for each duplicate group
 * 3. Delete older duplicates
 * 4. Regenerate unique IDs for any remaining conflicts
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity write client
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  useCdn: false,
  apiVersion: '2023-01-01',
});

// Generate unique registration ID with microsecond precision
function generateRegistrationId() {
  const now = new Date();
  const timestamp = now.getTime().toString(36); // milliseconds
  const microseconds = (performance.now() % 1000).toFixed(3).replace('.', '');
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `REG-${timestamp}${microseconds}-${randomStr}`.toUpperCase();
}

// Generate unique sponsor registration ID
function generateSponsorRegistrationId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `SPR-${timestamp}-${randomStr}`.toUpperCase();
}

async function fixDuplicateRegistrationIds() {
  try {
    console.log('🔍 Starting duplicate registration ID cleanup...');

    // 1. Handle conference registrations
    console.log('\n📋 Processing conference registrations...');
    
    const allConferenceRegs = await writeClient.fetch(`
      *[_type == "conferenceRegistration"] {
        _id,
        registrationId,
        personalDetails,
        _createdAt,
        _updatedAt
      } | order(_createdAt desc)
    `);

    console.log(`📊 Found ${allConferenceRegs.length} conference registrations`);

    // Group by registrationId
    const conferenceGroups = {};
    allConferenceRegs.forEach(reg => {
      const regId = reg.registrationId;
      if (!conferenceGroups[regId]) {
        conferenceGroups[regId] = [];
      }
      conferenceGroups[regId].push(reg);
    });

    // Find and fix duplicates
    const conferenceDuplicates = Object.entries(conferenceGroups).filter(([regId, regs]) => regs.length > 1);
    console.log(`🔍 Found ${conferenceDuplicates.length} duplicate conference registration groups`);

    let conferenceDeletedCount = 0;
    let conferenceUpdatedCount = 0;

    for (const [regId, duplicates] of conferenceDuplicates) {
      console.log(`\n📋 Processing conference duplicates for ${regId}:`);

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
          conferenceDeletedCount++;
        } catch (error) {
          console.error(`  ❌ Failed to delete ${duplicate._id}:`, error.message);
        }
      }
    }

    // 2. Handle sponsor registrations
    console.log('\n🏢 Processing sponsor registrations...');
    
    const allSponsorRegs = await writeClient.fetch(`
      *[_type == "sponsorRegistration"] {
        _id,
        registrationId,
        companyDetails,
        _createdAt,
        _updatedAt
      } | order(_createdAt desc)
    `);

    console.log(`📊 Found ${allSponsorRegs.length} sponsor registrations`);

    // Group by registrationId
    const sponsorGroups = {};
    allSponsorRegs.forEach(reg => {
      const regId = reg.registrationId;
      if (!sponsorGroups[regId]) {
        sponsorGroups[regId] = [];
      }
      sponsorGroups[regId].push(reg);
    });

    // Find and fix duplicates
    const sponsorDuplicates = Object.entries(sponsorGroups).filter(([regId, regs]) => regs.length > 1);
    console.log(`🔍 Found ${sponsorDuplicates.length} duplicate sponsor registration groups`);

    let sponsorDeletedCount = 0;

    for (const [regId, duplicates] of sponsorDuplicates) {
      console.log(`\n🏢 Processing sponsor duplicates for ${regId}:`);

      // Sort by creation date (newest first)
      duplicates.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));

      // Keep the newest one, delete the rest
      const toKeep = duplicates[0];
      const toDelete = duplicates.slice(1);

      console.log(`  ✅ Keeping: ${toKeep._id} (created: ${toKeep._createdAt})`);

      for (const duplicate of toDelete) {
        try {
          console.log(`  🗑️  Deleting: ${duplicate._id} (created: ${duplicate._createdAt})`);
          await writeClient.delete(duplicate._id);
          sponsorDeletedCount++;
        } catch (error) {
          console.error(`  ❌ Failed to delete ${duplicate._id}:`, error.message);
        }
      }
    }

    // 3. Ensure all remaining registrations have unique IDs
    console.log('\n🔄 Ensuring all remaining registrations have unique IDs...');
    
    const remainingConferenceRegs = await writeClient.fetch(`
      *[_type == "conferenceRegistration"] {
        _id,
        registrationId
      }
    `);

    const remainingSponsorRegs = await writeClient.fetch(`
      *[_type == "sponsorRegistration"] {
        _id,
        registrationId
      }
    `);

    // Check for any remaining conflicts between conference and sponsor registrations
    const allRegIds = [
      ...remainingConferenceRegs.map(r => r.registrationId),
      ...remainingSponsorRegs.map(r => r.registrationId)
    ];

    const duplicateIds = allRegIds.filter((id, index) => allRegIds.indexOf(id) !== index);
    const uniqueDuplicateIds = [...new Set(duplicateIds)];

    if (uniqueDuplicateIds.length > 0) {
      console.log(`⚠️ Found ${uniqueDuplicateIds.length} cross-type duplicate IDs, fixing...`);
      
      for (const duplicateId of uniqueDuplicateIds) {
        const conflictingSponsors = remainingSponsorRegs.filter(r => r.registrationId === duplicateId);
        
        for (const sponsor of conflictingSponsors) {
          const newId = generateSponsorRegistrationId();
          console.log(`  🔄 Updating sponsor ${sponsor._id}: ${duplicateId} → ${newId}`);
          
          try {
            await writeClient.patch(sponsor._id).set({ registrationId: newId }).commit();
            conferenceUpdatedCount++;
          } catch (error) {
            console.error(`  ❌ Failed to update ${sponsor._id}:`, error.message);
          }
        }
      }
    }

    console.log('\n✅ Cleanup completed!');
    console.log(`📊 Summary:`);
    console.log(`  - Conference registrations deleted: ${conferenceDeletedCount}`);
    console.log(`  - Sponsor registrations deleted: ${sponsorDeletedCount}`);
    console.log(`  - Registration IDs updated: ${conferenceUpdatedCount}`);
    console.log(`  - Total operations: ${conferenceDeletedCount + sponsorDeletedCount + conferenceUpdatedCount}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
fixDuplicateRegistrationIds()
  .then(() => {
    console.log('\n🎉 All done! Registration IDs are now unique.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  });
