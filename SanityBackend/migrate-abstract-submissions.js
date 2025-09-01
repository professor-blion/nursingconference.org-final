// Migration script to add title field to existing abstract submissions
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function migrateAbstractSubmissions() {
  try {
    console.log('🔍 Starting migration of abstract submissions...');
    
    // Find all abstract submissions without title field
    const query = '*[_type == "abstractSubmission" && !defined(title)]{ _id, firstName, lastName }';
    const submissionsToUpdate = await client.fetch(query);
    
    console.log(`📊 Found ${submissionsToUpdate.length} submissions without title field`);
    
    if (submissionsToUpdate.length === 0) {
      console.log('✅ No submissions need migration. All submissions already have title field.');
      return;
    }
    
    // Update each submission with default title value
    const updatePromises = submissionsToUpdate.map(submission => {
      console.log(`🔄 Updating submission ${submission._id} (${submission.firstName} ${submission.lastName})`);
      return client
        .patch(submission._id)
        .set({ title: 'N/A' })
        .commit();
    });
    
    const results = await Promise.all(updatePromises);
    console.log(`✅ Successfully updated ${results.length} submissions with default title 'N/A'`);
    
    // Verify the migration
    const verifyQuery = '*[_type == "abstractSubmission"]{ _id, title, firstName, lastName }';
    const allSubmissions = await client.fetch(verifyQuery);
    
    console.log('\n📋 Migration verification:');
    allSubmissions.forEach(submission => {
      console.log(`  - ${submission.firstName} ${submission.lastName}: title = "${submission.title || 'MISSING'}"`);
    });
    
    const missingTitles = allSubmissions.filter(s => !s.title);
    if (missingTitles.length === 0) {
      console.log('\n✅ Migration completed successfully! All submissions now have title field.');
    } else {
      console.log(`\n⚠️ Warning: ${missingTitles.length} submissions still missing title field.`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateAbstractSubmissions();
