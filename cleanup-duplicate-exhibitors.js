#!/usr/bin/env node

/**
 * Script to clean up duplicate Exhibitor registration types
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

async function cleanupDuplicates() {
  try {
    console.log('🧹 Cleaning up duplicate registration types...\n');

    // Get all registration types
    const allTypes = await client.fetch(`
      *[_type == "registrationTypes"] | order(displayOrder asc) {
        _id,
        name,
        category,
        price,
        isActive,
        displayOrder
      }
    `);

    console.log(`📋 Found ${allTypes.length} registration types total`);

    // Group by category to find duplicates
    const typesByCategory = {};
    allTypes.forEach(type => {
      if (!typesByCategory[type.category]) {
        typesByCategory[type.category] = [];
      }
      typesByCategory[type.category].push(type);
    });

    let deleted = 0;
    let kept = 0;

    // Process each category
    for (const [category, types] of Object.entries(typesByCategory)) {
      if (types.length > 1) {
        console.log(`\n🔍 Found ${types.length} duplicates for category: ${category}`);
        
        // Keep the first one (usually has the correct display order)
        const typeToKeep = types[0];
        const typesToDelete = types.slice(1);
        
        console.log(`   ✅ Keeping: ${typeToKeep.name} (ID: ${typeToKeep._id})`);
        kept++;
        
        // Delete the duplicates
        for (const typeToDelete of typesToDelete) {
          console.log(`   🗑️  Deleting: ${typeToDelete.name} (ID: ${typeToDelete._id})`);
          
          try {
            await client.delete(typeToDelete._id);
            console.log(`      ✅ Deleted successfully`);
            deleted++;
          } catch (error) {
            console.log(`      ❌ Failed to delete: ${error.message}`);
          }
        }
      } else {
        console.log(`✅ ${category}: No duplicates found`);
        kept++;
      }
    }

    console.log('\n' + '=' .repeat(50));
    console.log('📊 CLEANUP SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`Types kept: ${kept}`);
    console.log(`Duplicates deleted: ${deleted}`);

    // Final verification
    console.log('\n🔄 Final verification...');
    const finalTypes = await client.fetch(`
      *[_type == "registrationTypes" && isActive == true] | order(displayOrder asc) {
        name,
        category,
        price,
        displayOrder
      }
    `);

    console.log('\n✅ Final Registration Types:');
    console.log('=' .repeat(50));
    finalTypes.forEach((type, index) => {
      console.log(`${index + 1}. ${type.name} (${type.category}) - $${type.price}`);
    });

    if (finalTypes.length === 8) {
      console.log('\n🎉 SUCCESS: Exactly 8 unique registration types remain!');
    } else {
      console.log(`\n⚠️  Expected 8 types, found ${finalTypes.length}`);
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupDuplicates();
