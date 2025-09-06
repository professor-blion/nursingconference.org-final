#!/usr/bin/env node

/**
 * Test script to verify registration types API and Sanity connection
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client with the same config as the app
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function testRegistrationTypes() {
  try {
    console.log('🔍 Testing Sanity connection and registration types...\n');

    // Test basic connection
    console.log('1. Testing basic Sanity connection...');
    const basicTest = await client.fetch('*[_type == "registrationTypes"][0..2]{_id, name, category}');
    console.log(`✅ Connection successful. Found ${basicTest.length} registration types (sample)`);
    
    if (basicTest.length > 0) {
      console.log('   Sample data:', basicTest.map(t => `${t.name} (${t.category})`).join(', '));
    }

    // Test the specific query used by the dynamic config API
    console.log('\n2. Testing dynamic config query...');
    const approvedCategories = [
      'speaker-inperson', 'speaker-virtual', 
      'listener-inperson', 'listener-virtual',
      'student-inperson', 'student-virtual',
      'eposter-virtual', 'exhibitor'
    ];

    const dynamicQuery = `*[_type == "registrationTypes" && category in ["speaker-inperson", "speaker-virtual", "listener-inperson", "listener-virtual", "student-inperson", "student-virtual", "eposter-virtual", "exhibitor"]] | order(displayOrder asc) {
      _id,
      name,
      category,
      description,
      pricing[] {
        pricingPeriod-> {
          _id,
          periodId,
          title,
          startDate,
          endDate,
          isActive
        },
        academiaPrice,
        businessPrice,
        isActive
      },
      benefits,
      isActive,
      displayOrder,
      maxParticipants,
      availableFrom,
      availableUntil
    }`;

    const approvedTypes = await client.fetch(dynamicQuery);
    console.log(`✅ Found ${approvedTypes.length} approved registration types`);

    if (approvedTypes.length > 0) {
      console.log('\n📋 Approved Registration Types:');
      console.log('=' .repeat(50));
      approvedTypes.forEach((type, index) => {
        const status = type.isActive ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${type.name} (${type.category})`);
      });
    } else {
      console.log('⚠️  No approved registration types found!');
      console.log('   This means the registration types need to be created or updated.');
    }

    // Test all registration types
    console.log('\n3. Testing all registration types...');
    const allTypes = await client.fetch('*[_type == "registrationTypes"] | order(displayOrder asc) {_id, name, category, isActive}');
    console.log(`✅ Total registration types in database: ${allTypes.length}`);

    if (allTypes.length > 0) {
      const activeTypes = allTypes.filter(t => t.isActive);
      const inactiveTypes = allTypes.filter(t => !t.isActive);
      
      console.log(`   Active: ${activeTypes.length}, Inactive: ${inactiveTypes.length}`);
      
      console.log('\n📊 All Registration Types:');
      console.log('-' .repeat(50));
      allTypes.forEach((type, index) => {
        const status = type.isActive ? '✅' : '❌';
        const approved = approvedCategories.includes(type.category) ? '🎯' : '⚠️';
        console.log(`${index + 1}. ${status} ${approved} ${type.name} (${type.category})`);
      });
    }

    // Test pricing periods
    console.log('\n4. Testing pricing periods...');
    const pricingPeriods = await client.fetch('*[_type == "pricingPeriods"] | order(displayOrder asc) {_id, periodId, title, isActive}');
    console.log(`✅ Found ${pricingPeriods.length} pricing periods`);
    
    if (pricingPeriods.length > 0) {
      pricingPeriods.forEach((period, index) => {
        const status = period.isActive ? '✅' : '❌';
        console.log(`   ${index + 1}. ${status} ${period.title} (${period.periodId})`);
      });
    }

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`Total registration types: ${allTypes.length}`);
    console.log(`Approved registration types: ${approvedTypes.length}/8`);
    console.log(`Pricing periods: ${pricingPeriods.length}`);
    
    if (approvedTypes.length === 8) {
      console.log('🎉 SUCCESS: All 8 approved registration types are configured!');
    } else {
      console.log('⚠️  ACTION NEEDED: Registration types need to be updated.');
      console.log('   Run the update script: node SanityBackend/update-registration-types.js');
    }

  } catch (error) {
    console.error('❌ Error testing registration types:', error);
    console.error('\nPossible issues:');
    console.error('- Sanity project ID or dataset incorrect');
    console.error('- Network connection issues');
    console.error('- Sanity service unavailable');
  }
}

// Run the test
if (require.main === module) {
  testRegistrationTypes();
}

module.exports = { testRegistrationTypes };
