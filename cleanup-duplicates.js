#!/usr/bin/env node

/**
 * Script to clean up duplicate registration types and keep only the 8 approved ones
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

// The 8 approved registration types we want to keep
const approvedTypes = [
  { name: 'Speaker/Poster (In-Person)', category: 'speaker-inperson' },
  { name: 'Speaker/Poster (Virtual)', category: 'speaker-virtual' },
  { name: 'Listener (In-Person)', category: 'listener-inperson' },
  { name: 'Listener (Virtual)', category: 'listener-virtual' },
  { name: 'Student (In-Person)', category: 'student-inperson' },
  { name: 'Student (Virtual)', category: 'student-virtual' },
  { name: 'E-poster (Virtual)', category: 'eposter-virtual' },
  { name: 'Exhibitor', category: 'exhibitor' },
];

async function cleanupDuplicates() {
  try {
    console.log('🧹 Starting duplicate cleanup...\n');

    // Get all registration types
    const allTypes = await client.fetch('*[_type == "registrationTypes"] | order(displayOrder asc)');
    console.log(`📋 Found ${allTypes.length} registration types total`);

    // Group by category
    const typesByCategory = {};
    allTypes.forEach(type => {
      if (!typesByCategory[type.category]) {
        typesByCategory[type.category] = [];
      }
      typesByCategory[type.category].push(type);
    });

    console.log('\n📊 Types by category:');
    Object.keys(typesByCategory).forEach(category => {
      console.log(`   ${category}: ${typesByCategory[category].length} types`);
    });

    let kept = 0;
    let deactivated = 0;
    let deleted = 0;

    // Process each approved type
    for (let i = 0; i < approvedTypes.length; i++) {
      const approvedType = approvedTypes[i];
      console.log(`\n🔍 Processing: ${approvedType.name} (${approvedType.category})`);
      
      const matchingTypes = typesByCategory[approvedType.category] || [];
      
      if (matchingTypes.length === 0) {
        console.log(`   ⚠️  No types found for category ${approvedType.category}`);
        continue;
      }

      // Find the best match (prefer active ones, then by name match)
      let bestMatch = matchingTypes.find(t => t.isActive && t.name === approvedType.name);
      if (!bestMatch) {
        bestMatch = matchingTypes.find(t => t.name === approvedType.name);
      }
      if (!bestMatch) {
        bestMatch = matchingTypes.find(t => t.isActive);
      }
      if (!bestMatch) {
        bestMatch = matchingTypes[0];
      }

      console.log(`   ✅ Keeping: ${bestMatch.name} (ID: ${bestMatch._id})`);
      
      // Ensure the kept one is active and has correct properties
      await client
        .patch(bestMatch._id)
        .set({
          name: approvedType.name,
          category: approvedType.category,
          isActive: true,
          displayOrder: i + 1,
        })
        .commit();
      
      kept++;

      // Deactivate or delete duplicates
      const duplicates = matchingTypes.filter(t => t._id !== bestMatch._id);
      for (const duplicate of duplicates) {
        console.log(`   🗑️  Removing duplicate: ${duplicate.name} (ID: ${duplicate._id})`);
        
        try {
          // Try to delete the duplicate
          await client.delete(duplicate._id);
          deleted++;
          console.log(`      ✅ Deleted`);
        } catch (error) {
          // If deletion fails, deactivate instead
          console.log(`      ⚠️  Could not delete, deactivating instead`);
          await client
            .patch(duplicate._id)
            .set({ isActive: false })
            .commit();
          deactivated++;
        }
      }
    }

    // Deactivate any remaining types that don't match approved categories
    const approvedCategories = approvedTypes.map(t => t.category);
    const otherTypes = allTypes.filter(t => !approvedCategories.includes(t.category) && t.isActive);
    
    if (otherTypes.length > 0) {
      console.log(`\n🔄 Deactivating ${otherTypes.length} non-approved types...`);
      for (const type of otherTypes) {
        console.log(`   ❌ Deactivating: ${type.name} (${type.category})`);
        await client
          .patch(type._id)
          .set({ isActive: false })
          .commit();
        deactivated++;
      }
    }

    console.log('\n' + '=' .repeat(50));
    console.log('📊 CLEANUP SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`Kept: ${kept}`);
    console.log(`Deactivated: ${deactivated}`);
    console.log(`Deleted: ${deleted}`);

    // Final verification
    console.log('\n🔄 Running final verification...');
    const finalTypes = await client.fetch('*[_type == "registrationTypes" && isActive == true] | order(displayOrder asc) {name, category, displayOrder}');
    
    console.log('\n✅ Final Active Registration Types:');
    console.log('=' .repeat(50));
    finalTypes.forEach((type, index) => {
      console.log(`${index + 1}. ${type.name} (${type.category})`);
    });

    if (finalTypes.length === 8) {
      console.log('\n🎉 SUCCESS: Exactly 8 approved registration types are now active!');
    } else {
      console.log(`\n⚠️  WARNING: Expected 8 active types, found ${finalTypes.length}`);
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupDuplicates();
