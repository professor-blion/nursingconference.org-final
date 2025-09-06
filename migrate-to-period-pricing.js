#!/usr/bin/env node

/**
 * Migration script to convert single price to period-specific prices
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n',
  apiVersion: '2023-05-03',
});

// Price multipliers for different periods (relative to base price)
const PRICE_MULTIPLIERS = {
  earlyBird: 1.0,    // Base price (100%)
  nextRound: 1.25,   // 25% more than early bird
  onSpot: 1.5,       // 50% more than early bird
};

async function migrateToPeriodPricing() {
  try {
    console.log('🔄 Starting migration to period-specific pricing structure...\n');

    // Get all registration types
    const registrationTypes = await client.fetch(`
      *[_type == "registrationTypes"] | order(displayOrder asc) {
        _id,
        name,
        category,
        price,
        isActive
      }
    `);

    console.log(`📋 Found ${registrationTypes.length} registration types to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const regType of registrationTypes) {
      console.log(`\n🔍 Processing: ${regType.name} (${regType.category})`);

      // Get the base price
      const basePrice = regType.price || 0;
      
      if (basePrice <= 0) {
        console.log(`   ⚠️ No valid base price found, using default values`);
      }

      // Calculate period-specific prices
      const earlyBirdPrice = Math.round(basePrice * PRICE_MULTIPLIERS.earlyBird);
      const nextRoundPrice = Math.round(basePrice * PRICE_MULTIPLIERS.nextRound);
      const onSpotPrice = Math.round(basePrice * PRICE_MULTIPLIERS.onSpot);

      console.log(`   📊 Calculated prices:`);
      console.log(`      Early Bird: $${earlyBirdPrice}`);
      console.log(`      Next Round: $${nextRoundPrice}`);
      console.log(`      OnSpot: $${onSpotPrice}`);

      try {
        // Update the registration type with period-specific prices
        await client
          .patch(regType._id)
          .set({
            earlyBirdPrice,
            nextRoundPrice,
            onSpotPrice,
          })
          .unset(['price']) // Remove the old single price field
          .commit();

        console.log(`   ✅ Migrated successfully`);
        migrated++;

      } catch (error) {
        console.log(`   ❌ Failed to migrate: ${error.message}`);
        skipped++;
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('📊 MIGRATION SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`Total processed: ${registrationTypes.length}`);
    console.log(`Successfully migrated: ${migrated}`);
    console.log(`Skipped/Failed: ${skipped}`);

    if (migrated > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n🔄 Verifying migrated data...');

      // Verify the migration
      const updatedTypes = await client.fetch(`
        *[_type == "registrationTypes" && isActive == true] | order(displayOrder asc) {
          name,
          category,
          earlyBirdPrice,
          nextRoundPrice,
          onSpotPrice,
          isActive
        }
      `);

      console.log('\n✅ Updated Registration Types with Period Pricing:');
      console.log('=' .repeat(70));
      updatedTypes.forEach((type, index) => {
        console.log(`${index + 1}. ${type.name} (${type.category})`);
        console.log(`   Early Bird: $${type.earlyBirdPrice} | Next Round: $${type.nextRoundPrice} | OnSpot: $${type.onSpotPrice}`);
      });

      console.log('\n📝 NEXT STEPS:');
      console.log('1. Update the frontend code to use the period-specific pricing');
      console.log('2. Test the registration form to ensure the correct price displays based on the active period');
      console.log('3. Verify that pricing periods still work as expected');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
if (require.main === module) {
  migrateToPeriodPricing();
}

module.exports = { migrateToPeriodPricing };
