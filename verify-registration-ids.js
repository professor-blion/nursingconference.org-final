/**
 * Verify registration ID uniqueness in Sanity
 * This script will check for duplicate registration IDs and report the current state
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  useCdn: false,
  apiVersion: '2023-01-01',
});

async function verifyRegistrationIds() {
  try {
    console.log('🔍 Verifying registration ID uniqueness...\n');

    // 1. Check conference registrations
    console.log('📋 Checking conference registrations...');
    
    const conferenceRegs = await client.fetch(`
      *[_type == "conferenceRegistration"] {
        _id,
        registrationId,
        personalDetails.firstName,
        personalDetails.lastName,
        personalDetails.email,
        _createdAt
      } | order(registrationId)
    `);

    console.log(`📊 Found ${conferenceRegs.length} conference registrations`);

    // Group by registrationId
    const conferenceGroups = {};
    conferenceRegs.forEach(reg => {
      const regId = reg.registrationId;
      if (!conferenceGroups[regId]) {
        conferenceGroups[regId] = [];
      }
      conferenceGroups[regId].push(reg);
    });

    // Find duplicates
    const conferenceDuplicates = Object.entries(conferenceGroups).filter(([regId, regs]) => regs.length > 1);
    
    if (conferenceDuplicates.length > 0) {
      console.log(`❌ Found ${conferenceDuplicates.length} duplicate conference registration groups:`);
      
      conferenceDuplicates.forEach(([regId, duplicates]) => {
        console.log(`\n  📋 Registration ID: ${regId} (${duplicates.length} duplicates)`);
        duplicates.forEach((dup, index) => {
          console.log(`    ${index + 1}. ${dup._id} - ${dup.personalDetails?.firstName} ${dup.personalDetails?.lastName} (${dup.personalDetails?.email}) - Created: ${dup._createdAt}`);
        });
      });
    } else {
      console.log('✅ No duplicate conference registration IDs found');
    }

    // 2. Check sponsor registrations
    console.log('\n🏢 Checking sponsor registrations...');
    
    const sponsorRegs = await client.fetch(`
      *[_type == "sponsorRegistration"] {
        _id,
        registrationId,
        companyDetails.companyName,
        contactPerson.email,
        _createdAt
      } | order(registrationId)
    `);

    console.log(`📊 Found ${sponsorRegs.length} sponsor registrations`);

    // Group by registrationId
    const sponsorGroups = {};
    sponsorRegs.forEach(reg => {
      const regId = reg.registrationId;
      if (!sponsorGroups[regId]) {
        sponsorGroups[regId] = [];
      }
      sponsorGroups[regId].push(reg);
    });

    // Find duplicates
    const sponsorDuplicates = Object.entries(sponsorGroups).filter(([regId, regs]) => regs.length > 1);
    
    if (sponsorDuplicates.length > 0) {
      console.log(`❌ Found ${sponsorDuplicates.length} duplicate sponsor registration groups:`);
      
      sponsorDuplicates.forEach(([regId, duplicates]) => {
        console.log(`\n  🏢 Registration ID: ${regId} (${duplicates.length} duplicates)`);
        duplicates.forEach((dup, index) => {
          console.log(`    ${index + 1}. ${dup._id} - ${dup.companyDetails?.companyName} (${dup.contactPerson?.email}) - Created: ${dup._createdAt}`);
        });
      });
    } else {
      console.log('✅ No duplicate sponsor registration IDs found');
    }

    // 3. Check for cross-type conflicts
    console.log('\n🔄 Checking for cross-type registration ID conflicts...');
    
    const allConferenceIds = conferenceRegs.map(r => r.registrationId);
    const allSponsorIds = sponsorRegs.map(r => r.registrationId);
    
    const crossConflicts = allConferenceIds.filter(id => allSponsorIds.includes(id));
    
    if (crossConflicts.length > 0) {
      console.log(`❌ Found ${crossConflicts.length} cross-type registration ID conflicts:`);
      crossConflicts.forEach(conflictId => {
        console.log(`  ⚠️ ID ${conflictId} exists in both conference and sponsor registrations`);
      });
    } else {
      console.log('✅ No cross-type registration ID conflicts found');
    }

    // 4. Summary
    console.log('\n📊 Summary:');
    console.log(`  - Total conference registrations: ${conferenceRegs.length}`);
    console.log(`  - Total sponsor registrations: ${sponsorRegs.length}`);
    console.log(`  - Conference duplicate groups: ${conferenceDuplicates.length}`);
    console.log(`  - Sponsor duplicate groups: ${sponsorDuplicates.length}`);
    console.log(`  - Cross-type conflicts: ${crossConflicts.length}`);
    
    const totalIssues = conferenceDuplicates.length + sponsorDuplicates.length + crossConflicts.length;
    
    if (totalIssues === 0) {
      console.log('\n🎉 All registration IDs are unique! No issues found.');
    } else {
      console.log(`\n⚠️ Found ${totalIssues} registration ID issues that need to be resolved.`);
      console.log('💡 Run the fix-duplicate-registration-ids.js script to resolve these issues.');
    }

    // 5. Show some sample registration IDs for verification
    console.log('\n📋 Sample registration IDs:');
    const sampleConference = conferenceRegs.slice(0, 3);
    const sampleSponsor = sponsorRegs.slice(0, 3);
    
    if (sampleConference.length > 0) {
      console.log('  Conference:');
      sampleConference.forEach(reg => {
        console.log(`    ${reg.registrationId} - ${reg.personalDetails?.firstName} ${reg.personalDetails?.lastName}`);
      });
    }
    
    if (sampleSponsor.length > 0) {
      console.log('  Sponsor:');
      sampleSponsor.forEach(reg => {
        console.log(`    ${reg.registrationId} - ${reg.companyDetails?.companyName}`);
      });
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

// Run the verification
verifyRegistrationIds()
  .then(() => {
    console.log('\n✅ Verification completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });
