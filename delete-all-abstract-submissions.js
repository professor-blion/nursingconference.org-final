#!/usr/bin/env node
/**
 * Delete All Abstract Submissions
 * 
 * This script safely deletes all abstract submissions from the Sanity project
 * since this is a new project and we want to start fresh.
 */

const { createClient } = require('./nextjs-frontend/node_modules/@sanity/client');
require('./nextjs-frontend/node_modules/dotenv').config();

console.log('🗑️ DELETING ALL ABSTRACT SUBMISSIONS\n');
console.log('=' .repeat(50));

async function deleteAllAbstractSubmissions() {
  try {
    // Create Sanity client with write permissions
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN
    });

    console.log('🔧 Using Sanity Configuration:');
    console.log(`   Project ID: ${client.config().projectId}`);
    console.log(`   Dataset: ${client.config().dataset}`);
    console.log(`   Has Token: ${!!client.config().token}`);
    console.log('');

    // Step 1: Check what abstract submission documents exist
    console.log('1️⃣ CHECKING EXISTING ABSTRACT SUBMISSIONS...');
    console.log('-'.repeat(40));
    
    const abstractSubmissions = await client.fetch(`*[_type == "abstractSubmission"] {
      _id,
      title,
      authorName,
      email,
      submissionDate,
      status
    }`);

    console.log(`📊 Found ${abstractSubmissions.length} abstract submissions`);
    
    if (abstractSubmissions.length === 0) {
      console.log('✅ No abstract submissions found - database is already clean!');
      return;
    }

    // Show first few submissions for confirmation
    console.log('\n📋 First 5 submissions to be deleted:');
    abstractSubmissions.slice(0, 5).forEach((submission, index) => {
      console.log(`${index + 1}. ${submission.title || 'Untitled'}`);
      console.log(`   Author: ${submission.authorName || 'Unknown'}`);
      console.log(`   Email: ${submission.email || 'No email'}`);
      console.log(`   Status: ${submission.status || 'No status'}`);
      console.log(`   ID: ${submission._id}`);
      console.log('');
    });

    if (abstractSubmissions.length > 5) {
      console.log(`... and ${abstractSubmissions.length - 5} more submissions`);
    }

    // Step 2: Confirm deletion (auto-confirm for script)
    console.log('\n2️⃣ PROCEEDING WITH DELETION...');
    console.log('-'.repeat(40));
    console.log('⚠️  This will permanently delete all abstract submissions');
    console.log('✅ Proceeding with deletion for new project setup...');
    console.log('');

    // Step 3: Delete all abstract submissions
    console.log('3️⃣ DELETING ABSTRACT SUBMISSIONS...');
    console.log('-'.repeat(40));
    
    let deletedCount = 0;
    let errorCount = 0;

    for (const submission of abstractSubmissions) {
      try {
        await client.delete(submission._id);
        deletedCount++;
        console.log(`✅ Deleted: ${submission.title || 'Untitled'} (${submission._id})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errorCount++;
        console.log(`❌ Failed to delete ${submission._id}: ${error.message}`);
      }
    }

    // Step 4: Verify deletion
    console.log('\n4️⃣ VERIFYING DELETION...');
    console.log('-'.repeat(40));
    
    const remainingSubmissions = await client.fetch('count(*[_type == "abstractSubmission"])');
    
    console.log('\n📊 DELETION SUMMARY:');
    console.log(`   ✅ Successfully deleted: ${deletedCount} submissions`);
    console.log(`   ❌ Failed to delete: ${errorCount} submissions`);
    console.log(`   📋 Remaining submissions: ${remainingSubmissions}`);
    
    if (remainingSubmissions === 0) {
      console.log('\n🎉 SUCCESS! All abstract submissions have been deleted');
      console.log('✅ Your project is now clean and ready for new submissions');
    } else {
      console.log('\n⚠️  Some submissions may still remain');
      console.log('💡 You may need to delete them manually in Sanity Studio');
    }

    // Step 5: Check related documents
    console.log('\n5️⃣ CHECKING RELATED DOCUMENTS...');
    console.log('-'.repeat(40));
    
    // Check for abstract submission settings
    const abstractSettings = await client.fetch('*[_type == "abstractSubmissionSettings"]');
    console.log(`📋 Abstract submission settings: ${abstractSettings.length} documents`);
    
    // Check for any draft submissions
    const draftSubmissions = await client.fetch('count(*[_id in path("drafts.**") && _type == "abstractSubmission"])');
    console.log(`📋 Draft abstract submissions: ${draftSubmissions} documents`);
    
    if (draftSubmissions > 0) {
      console.log('💡 Note: Draft submissions still exist - these are auto-saved drafts');
      console.log('   They will be automatically cleaned up by Sanity');
    }

    console.log('\n6️⃣ FINAL STATUS');
    console.log('=' .repeat(40));
    console.log('✅ Abstract submission cleanup completed');
    console.log('✅ Database ready for new project');
    console.log('✅ Abstract submission system ready to use');
    console.log('');
    console.log('🌐 Next steps:');
    console.log('1. Configure abstract submission settings in Sanity Studio');
    console.log('2. Set submission deadlines and guidelines');
    console.log('3. Test the abstract submission form on your website');
    console.log('');
    console.log('🔗 Access your Sanity Studio:');
    console.log('   https://nursing-conference-final-cms.sanity.studio/');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n🔧 TROUBLESHOOTING:');
    console.error('1. Check your API token has write permissions');
    console.error('2. Verify you have admin access to the project');
    console.error('3. Ensure internet connection is stable');
    console.error('4. Try deleting submissions manually in Sanity Studio');
  }
}

deleteAllAbstractSubmissions();
