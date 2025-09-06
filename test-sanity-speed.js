#!/usr/bin/env node

/**
 * Test Sanity query speed directly
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function testSanitySpeed() {
  console.log('⚡ Testing Sanity query speed...\n');

  try {
    console.log('1. Testing simple registration types query...');
    const start1 = Date.now();
    
    const registrationTypes = await client.fetch(`
      *[_type == "registrationTypes" && isActive == true] | order(displayOrder asc) {
        _id,
        name,
        category,
        earlyBirdPrice,
        nextRoundPrice,
        onSpotPrice
      }
    `);
    
    const time1 = Date.now() - start1;
    console.log(`✅ Found ${registrationTypes.length} types in ${time1}ms`);

    console.log('\n2. Testing pricing periods query...');
    const start2 = Date.now();
    
    const pricingPeriods = await client.fetch(`
      *[_type == "pricingPeriods" && isActive == true] | order(displayOrder asc) {
        _id,
        periodId,
        title,
        startDate,
        endDate,
        isActive
      }
    `);
    
    const time2 = Date.now() - start2;
    console.log(`✅ Found ${pricingPeriods.length} periods in ${time2}ms`);

    console.log('\n3. Testing combined query...');
    const start3 = Date.now();
    
    const [types, periods] = await Promise.all([
      client.fetch(`*[_type == "registrationTypes" && isActive == true] | order(displayOrder asc) {
        _id, name, category, earlyBirdPrice, nextRoundPrice, onSpotPrice
      }`),
      client.fetch(`*[_type == "pricingPeriods" && isActive == true] | order(displayOrder asc) {
        _id, periodId, title, startDate, endDate, isActive
      }`)
    ]);
    
    const time3 = Date.now() - start3;
    console.log(`✅ Combined query: ${types.length} types + ${periods.length} periods in ${time3}ms`);

    console.log('\n📊 SPEED SUMMARY:');
    console.log(`Registration types: ${time1}ms`);
    console.log(`Pricing periods: ${time2}ms`);
    console.log(`Combined parallel: ${time3}ms`);
    
    if (time3 > 5000) {
      console.log('\n⚠️  Queries are taking too long (>5s)');
      console.log('This could be causing the registration page to load slowly');
    } else if (time3 > 2000) {
      console.log('\n⚠️  Queries are slow (>2s)');
      console.log('Consider optimizing or adding caching');
    } else {
      console.log('\n✅ Query speed is acceptable');
    }

  } catch (error) {
    console.error('❌ Sanity query failed:', error);
  }
}

testSanitySpeed();
