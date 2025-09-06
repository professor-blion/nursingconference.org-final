#!/usr/bin/env node

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function checkSponsorshipStructure() {
  try {
    console.log('🔍 Checking detailed structure of sponsorship documents...\n');

    // Check sponsorshipTiers structure
    console.log('📋 sponsorshipTiers documents (with correct pricing):');
    const sponsorshipTiers = await client.fetch(`*[_type == "sponsorshipTiers"] | order(price asc)`);
    
    sponsorshipTiers.forEach((doc, index) => {
      console.log(`${index + 1}. Document ID: ${doc._id}`);
      console.log(`   Full structure:`, JSON.stringify(doc, null, 2));
      console.log('');
    });

    // Check sponsorshipTiersRegistration structure  
    console.log('🎯 sponsorshipTiersRegistration documents (with wrong pricing):');
    const sponsorshipTiersReg = await client.fetch(`*[_type == "sponsorshipTiersRegistration"] | order(displayOrder asc)`);
    
    sponsorshipTiersReg.forEach((doc, index) => {
      console.log(`${index + 1}. Document ID: ${doc._id}`);
      console.log(`   Full structure:`, JSON.stringify(doc, null, 2));
      console.log('');
    });

    // Determine which document type to use
    console.log('💡 ANALYSIS:');
    console.log('=' .repeat(50));
    
    const tiersHasNames = sponsorshipTiers.some(doc => doc.tierName || doc.name);
    const tiersHasLevels = sponsorshipTiers.some(doc => doc.tierLevel || doc.level);
    const regHasCorrectPricing = sponsorshipTiersReg.some(doc => doc.price <= 300);
    
    console.log(`sponsorshipTiers has tier names: ${tiersHasNames}`);
    console.log(`sponsorshipTiers has tier levels: ${tiersHasLevels}`);
    console.log(`sponsorshipTiersRegistration has correct pricing: ${regHasCorrectPricing}`);
    
    console.log('\n🎯 RECOMMENDATION:');
    if (tiersHasNames && tiersHasLevels) {
      console.log('✅ Use sponsorshipTiers - it has complete data with correct pricing');
    } else if (!regHasCorrectPricing) {
      console.log('⚠️  Need to update sponsorshipTiersRegistration prices to match expected values:');
      console.log('   - Gold: $99 (currently $3000)');
      console.log('   - Diamond: $199 (missing)');
      console.log('   - Platinum: $299 (currently $5000)');
      console.log('   - Silver: Remove (currently $2000)');
    } else {
      console.log('🔄 Need to merge data from both document types');
    }

  } catch (error) {
    console.error('❌ Error checking sponsorship structure:', error);
  }
}

checkSponsorshipStructure();
