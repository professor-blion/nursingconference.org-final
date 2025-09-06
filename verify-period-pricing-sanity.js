#!/usr/bin/env node

/**
 * Direct verification of period-specific pricing in Sanity
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function verifyPeriodPricing() {
  try {
    console.log('🔍 VERIFYING PERIOD-SPECIFIC PRICING IN SANITY\n');
    console.log('=' .repeat(70));

    // Get all registration types with the new pricing fields
    const registrationTypes = await client.fetch(`
      *[_type == "registrationTypes" && isActive == true] | order(displayOrder asc) {
        _id,
        name,
        category,
        earlyBirdPrice,
        nextRoundPrice,
        onSpotPrice,
        isActive,
        displayOrder
      }
    `);

    console.log(`📋 Found ${registrationTypes.length} active registration types\n`);

    if (registrationTypes.length > 0) {
      console.log('📊 REGISTRATION TYPES WITH PERIOD PRICING:');
      console.log('=' .repeat(70));
      
      registrationTypes.forEach((type, index) => {
        console.log(`${index + 1}. ${type.name} (${type.category})`);
        console.log(`   🟢 Early Bird: $${type.earlyBirdPrice || 'Not set'}`);
        console.log(`   🟡 Next Round: $${type.nextRoundPrice || 'Not set'}`);
        console.log(`   🔴 OnSpot: $${type.onSpotPrice || 'Not set'}`);
        
        // Calculate price increases
        if (type.earlyBirdPrice && type.nextRoundPrice && type.onSpotPrice) {
          const nextRoundIncrease = ((type.nextRoundPrice - type.earlyBirdPrice) / type.earlyBirdPrice * 100).toFixed(1);
          const onSpotIncrease = ((type.onSpotPrice - type.earlyBirdPrice) / type.earlyBirdPrice * 100).toFixed(1);
          console.log(`   📈 Price increases: Next Round +${nextRoundIncrease}%, OnSpot +${onSpotIncrease}%`);
        }
        console.log('');
      });
    }

    // Get pricing periods
    const pricingPeriods = await client.fetch(`
      *[_type == "pricingPeriods"] | order(displayOrder asc) {
        _id,
        periodId,
        title,
        startDate,
        endDate,
        isActive,
        displayOrder
      }
    `);

    console.log('\n📅 PRICING PERIODS:');
    console.log('=' .repeat(50));
    
    const now = new Date();
    let activePeriod = null;
    
    pricingPeriods.forEach((period, index) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const isCurrentlyActive = now >= startDate && now <= endDate && period.isActive;
      
      if (isCurrentlyActive) {
        activePeriod = period;
      }
      
      const status = period.isActive ? '✅' : '❌';
      const current = isCurrentlyActive ? '🎯 CURRENT' : '';
      
      console.log(`${index + 1}. ${status} ${period.title} (${period.periodId}) ${current}`);
      console.log(`   📅 ${period.startDate} to ${period.endDate}`);
    });

    // Summary
    console.log('\n' + '=' .repeat(70));
    console.log('📊 VERIFICATION SUMMARY:');
    console.log('=' .repeat(70));
    
    const hasAllPriceFields = registrationTypes.every(type => 
      typeof type.earlyBirdPrice === 'number' && 
      typeof type.nextRoundPrice === 'number' && 
      typeof type.onSpotPrice === 'number'
    );
    
    const hasPriceVariation = registrationTypes.some(type => 
      type.earlyBirdPrice !== type.nextRoundPrice || 
      type.nextRoundPrice !== type.onSpotPrice
    );
    
    console.log(`✅ Registration Types: ${registrationTypes.length}/8 expected`);
    console.log(`✅ Pricing Periods: ${pricingPeriods.length}/3 expected`);
    console.log(`✅ All Price Fields Present: ${hasAllPriceFields ? 'Yes' : 'No'}`);
    console.log(`✅ Price Variation by Period: ${hasPriceVariation ? 'Yes' : 'No'}`);
    console.log(`✅ Current Active Period: ${activePeriod ? activePeriod.title : 'None found'}`);
    
    if (hasAllPriceFields && registrationTypes.length === 8 && pricingPeriods.length === 3) {
      console.log('\n🎉 SUCCESS: Period-specific pricing is fully implemented!');
      console.log('✅ All registration types have three price fields');
      console.log('✅ Pricing periods are properly configured');
      console.log('✅ System ready for time-based pricing');
      
      if (activePeriod) {
        console.log(`✅ Currently in ${activePeriod.title} period`);
        
        // Show current prices for each registration type
        console.log('\n💰 CURRENT PRICES (based on active period):');
        console.log('-' .repeat(50));
        
        registrationTypes.forEach(type => {
          let currentPrice;
          switch (activePeriod.periodId) {
            case 'earlyBird':
              currentPrice = type.earlyBirdPrice;
              break;
            case 'nextRound':
              currentPrice = type.nextRoundPrice;
              break;
            case 'spotRegistration':
              currentPrice = type.onSpotPrice;
              break;
            default:
              currentPrice = type.earlyBirdPrice;
          }
          
          console.log(`${type.name}: $${currentPrice}`);
        });
      }
    } else {
      console.log('\n⚠️  Issues detected:');
      if (!hasAllPriceFields) {
        console.log('- Some registration types are missing price fields');
      }
      if (registrationTypes.length !== 8) {
        console.log(`- Expected 8 registration types, found ${registrationTypes.length}`);
      }
      if (pricingPeriods.length !== 3) {
        console.log(`- Expected 3 pricing periods, found ${pricingPeriods.length}`);
      }
    }

    console.log('\n' + '=' .repeat(70));

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Run the verification
verifyPeriodPricing();
