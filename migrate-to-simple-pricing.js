#!/usr/bin/env node

/**
 * Migration script to convert complex pricing structure to simple single price
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'skjc5mkFKiTdcpHQsCWU8p2mUXSlrlvzMpb9TiyRBOoKWOwVjGHLcVaD7cdkCopUZK767GIyCj26Qo4nfnout8TpPgACQdKxvsfetjD1RBbpwQJUmcBXMvXtdGDbXze4YTkc3D8uLLJQBYBy920sd2RNQy1TTwTbbyGxzeyDnTyqVkaMLNgC',
  apiVersion: '2023-05-03',
});

// Default prices for each registration type (you can adjust these)
const defaultPrices = {
  'speaker-inperson': 299,
  'speaker-virtual': 199,
  'listener-inperson': 399,
  'listener-virtual': 299,
  'student-inperson': 199,
  'student-virtual': 149,
  'eposter-virtual': 99,
  'exhibitor': 599,
};

async function migrateToSimplePricing() {
  try {
    console.log('🔄 Starting migration to simple pricing structure...\n');

    // Get all registration types
    const registrationTypes = await client.fetch(`
      *[_type == "registrationTypes"] | order(displayOrder asc) {
        _id,
        name,
        category,
        pricing,
        simplePricing,
        isActive
      }
    `);

    console.log(`📋 Found ${registrationTypes.length} registration types to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const regType of registrationTypes) {
      console.log(`\n🔍 Processing: ${regType.name} (${regType.category})`);

      // Determine the price to use
      let priceToUse = null;

      // Try to extract price from existing complex pricing structure
      if (regType.pricing && regType.pricing.length > 0) {
        // Use the first active pricing entry's academia price as default
        const activePricing = regType.pricing.find(p => p.isActive !== false);
        if (activePricing) {
          priceToUse = activePricing.academiaPrice || activePricing.businessPrice;
          console.log(`   📊 Using price from complex pricing: $${priceToUse}`);
        }
      }

      // Try to extract from simple pricing structure
      if (!priceToUse && regType.simplePricing) {
        if (regType.simplePricing.earlyBird?.academiaPrice) {
          priceToUse = regType.simplePricing.earlyBird.academiaPrice;
          console.log(`   📊 Using price from simple pricing (early bird): $${priceToUse}`);
        } else if (regType.simplePricing.nextRound?.academiaPrice) {
          priceToUse = regType.simplePricing.nextRound.academiaPrice;
          console.log(`   📊 Using price from simple pricing (next round): $${priceToUse}`);
        }
      }

      // Fall back to default price based on category
      if (!priceToUse) {
        priceToUse = defaultPrices[regType.category] || 299;
        console.log(`   📊 Using default price for category: $${priceToUse}`);
      }

      try {
        // Update the registration type with simplified structure
        await client
          .patch(regType._id)
          .set({
            price: priceToUse,
          })
          .unset(['pricing', 'simplePricing', 'availableFrom', 'availableUntil'])
          .commit();

        console.log(`   ✅ Migrated successfully - Price: $${priceToUse}`);
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
          price,
          isActive
        }
      `);

      console.log('\n✅ Updated Registration Types:');
      console.log('=' .repeat(50));
      updatedTypes.forEach((type, index) => {
        console.log(`${index + 1}. ${type.name} (${type.category}) - $${type.price}`);
      });

      console.log('\n📝 NEXT STEPS:');
      console.log('1. Update the frontend code to use the simplified pricing structure');
      console.log('2. Test the registration form to ensure pricing displays correctly');
      console.log('3. Verify that pricing periods still work as expected');
      console.log('4. The pricing periods (Early Bird, Next Round, Spot Registration) are managed separately in the Pricing Periods schema');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
if (require.main === module) {
  migrateToSimplePricing();
}

module.exports = { migrateToSimplePricing };
