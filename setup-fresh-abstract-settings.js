#!/usr/bin/env node
/**
 * Setup Fresh Abstract Submission Settings
 * 
 * This script creates new abstract submission settings for the fresh project
 */

const { createClient } = require('./nextjs-frontend/node_modules/@sanity/client');
require('./nextjs-frontend/node_modules/dotenv').config();

console.log('🆕 SETTING UP FRESH ABSTRACT SUBMISSION SETTINGS\n');
console.log('=' .repeat(55));

async function setupFreshAbstractSettings() {
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
    console.log('');

    // Step 1: Check if abstract submission settings already exist
    console.log('1️⃣ CHECKING EXISTING SETTINGS...');
    console.log('-'.repeat(40));
    
    const existingSettings = await client.fetch('*[_type == "abstractSubmissionSettings"]');
    console.log(`📊 Found ${existingSettings.length} existing settings`);
    
    if (existingSettings.length > 0) {
      console.log('⚠️  Abstract submission settings already exist');
      console.log('💡 Skipping creation to avoid duplicates');
      console.log('');
      console.log('✅ You can configure these settings in Sanity Studio:');
      console.log('   https://nursing-conference-final-cms.sanity.studio/');
      return;
    }

    // Step 2: Create fresh abstract submission settings
    console.log('\n2️⃣ CREATING FRESH ABSTRACT SUBMISSION SETTINGS...');
    console.log('-'.repeat(40));
    
    const abstractSettings = {
      _type: 'abstractSubmissionSettings',
      title: 'Abstract Submission Configuration',
      isOpen: true,
      deadline: '2025-12-31T23:59:59.000Z', // Set deadline to end of 2025
      guidelines: [
        'Abstract should be between 250-300 words',
        'Include clear objectives and methodology',
        'Provide relevant keywords (3-5 keywords)',
        'Ensure proper formatting and grammar',
        'Submit only original, unpublished work',
        'Include author information and affiliations'
      ],
      submissionInstructions: 'Please fill out all required fields and upload your abstract document. You will receive a confirmation email upon successful submission.',
      confirmationEmailTemplate: 'Thank you for submitting your abstract to our nursing conference. We have received your submission and will review it shortly. You will be notified of the decision by email.',
      maxFileSize: 5, // 5MB
      allowedFileTypes: ['pdf', 'doc', 'docx'],
      requiresApproval: true,
      notificationEmails: ['admin@nursingconference.org'],
      categories: [
        'Clinical Nursing Practice',
        'Nursing Education',
        'Healthcare Innovation',
        'Patient Safety',
        'Mental Health Nursing',
        'Pediatric Nursing',
        'Geriatric Nursing',
        'Community Health',
        'Nursing Research',
        'Healthcare Technology'
      ]
    };

    const result = await client.create(abstractSettings);
    console.log('✅ Abstract submission settings created successfully');
    console.log(`   Document ID: ${result._id}`);
    console.log(`   Status: ${result.isOpen ? 'Open' : 'Closed'}`);
    console.log(`   Deadline: ${new Date(result.deadline).toLocaleDateString()}`);
    console.log(`   Categories: ${result.categories.length} available`);

    // Step 3: Verify creation
    console.log('\n3️⃣ VERIFYING SETTINGS...');
    console.log('-'.repeat(40));
    
    const verifySettings = await client.fetch('*[_type == "abstractSubmissionSettings"][0]');
    
    if (verifySettings) {
      console.log('✅ Settings verified successfully');
      console.log(`   Title: ${verifySettings.title}`);
      console.log(`   Submission Status: ${verifySettings.isOpen ? 'OPEN' : 'CLOSED'}`);
      console.log(`   Guidelines: ${verifySettings.guidelines.length} items`);
      console.log(`   Categories: ${verifySettings.categories.length} available`);
    }

    console.log('\n4️⃣ FINAL STATUS');
    console.log('=' .repeat(40));
    console.log('✅ Fresh abstract submission system ready');
    console.log('✅ Settings configured with sensible defaults');
    console.log('✅ Submission form ready to accept abstracts');
    console.log('');
    console.log('📋 Current Configuration:');
    console.log('   • Submissions: OPEN');
    console.log('   • Deadline: December 31, 2025');
    console.log('   • File Types: PDF, DOC, DOCX');
    console.log('   • Max File Size: 5MB');
    console.log('   • Categories: 10 available');
    console.log('   • Approval Required: Yes');
    console.log('');
    console.log('🔧 Customize Settings:');
    console.log('   1. Go to Sanity Studio');
    console.log('   2. Navigate to Abstract Submission Settings');
    console.log('   3. Modify deadline, guidelines, categories as needed');
    console.log('');
    console.log('🌐 Access Points:');
    console.log('   Studio: https://nursing-conference-final-cms.sanity.studio/');
    console.log('   Frontend: http://localhost:3000/abstract-submission');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n🔧 TROUBLESHOOTING:');
    console.error('1. Check your API token has write permissions');
    console.error('2. Verify the abstractSubmissionSettings schema exists');
    console.error('3. Ensure internet connection is stable');
  }
}

setupFreshAbstractSettings();
