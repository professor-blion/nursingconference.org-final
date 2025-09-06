#!/usr/bin/env node

/**
 * Simple script to update registration type categories
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

// Mapping from old categories to new categories
const categoryMapping = {
  'speaker': 'speaker-inperson',      // Speaker/Poster (In-Person)
  'delegate': 'listener-inperson',    // Listener (In-Person) 
  'student': 'student-inperson',      // Student (In-Person)
  'poster': 'eposter-virtual',        // E-poster (Virtual)
  'online': 'listener-virtual',       // Listener (Virtual) - but we need to check the names
};

// Name-based mapping for more accurate updates
const nameBasedMapping = {
  'Speaker/Poster (In-Person)': 'speaker-inperson',
  'Speaker/Poster (Virtual)': 'speaker-virtual',
  'Listener (In-Person)': 'listener-inperson',
  'Listener (Virtual)': 'listener-virtual',
  'Student (In-Person)': 'student-inperson',
  'Student (Virtual)': 'student-virtual',
  'E-poster (Virtual)': 'eposter-virtual',
  'Exhibitor': 'exhibitor',
};

async function updateCategories() {
  try {
    console.log('🔄 Starting category update...\n');

    // Get all registration types
    const allTypes = await client.fetch('*[_type == "registrationTypes"] | order(displayOrder asc)');
    console.log(`📋 Found ${allTypes.length} registration types to update`);

    let updated = 0;
    let skipped = 0;

    for (const type of allTypes) {
      console.log(`\n🔍 Processing: ${type.name} (${type.category})`);
      
      // Determine new category based on name first, then fallback to old category
      let newCategory = nameBasedMapping[type.name];
      
      if (!newCategory) {
        newCategory = categoryMapping[type.category];
      }
      
      if (newCategory && newCategory !== type.category) {
        console.log(`   ✏️  Updating category: ${type.category} → ${newCategory}`);
        
        try {
          await client
            .patch(type._id)
            .set({ category: newCategory })
            .commit();
          
          console.log(`   ✅ Updated successfully`);
          updated++;
        } catch (error) {
          console.log(`   ❌ Failed to update: ${error.message}`);
        }
      } else if (newCategory === type.category) {
        console.log(`   ✅ Already correct category`);
        skipped++;
      } else {
        console.log(`   ⚠️  No mapping found for: ${type.name} (${type.category})`);
        skipped++;
      }
    }

    console.log('\n' + '=' .repeat(50));
    console.log('📊 UPDATE SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`Total processed: ${allTypes.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    
    if (updated > 0) {
      console.log('\n🎉 Categories updated successfully!');
      console.log('🔄 Running verification...');
      
      // Verify the updates
      const updatedTypes = await client.fetch('*[_type == "registrationTypes"] | order(displayOrder asc) {name, category, isActive}');
      
      console.log('\n📋 Updated Registration Types:');
      console.log('-' .repeat(40));
      updatedTypes.forEach((type, index) => {
        const status = type.isActive ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${type.name} (${type.category})`);
      });
    }

  } catch (error) {
    console.error('❌ Error updating categories:', error);
  }
}

// Run the update
updateCategories();
