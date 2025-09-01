require('dotenv').config();
const { createClient } = require('@sanity/client');

/**
 * Comprehensive diagnostic script for Sanity CMS registration data issues
 */

async function diagnoseSanityDataIssues() {
  try {
    console.log('🔍 DIAGNOSING SANITY CMS REGISTRATION DATA ISSUES...\n');
    
    // Test Sanity client configuration
    console.log('📋 Environment Configuration:');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho'}`);
    console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`);
    console.log(`   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'}`);
    console.log(`   API Token: ${process.env.SANITY_API_TOKEN ? 'Present' : 'Missing'}\n`);
    
    // Create Sanity client
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN
    });
    
    console.log('🔗 Testing Sanity Connection...');
    
    // Test 1: Basic connection and schema validation
    try {
      const schemaTypes = await client.fetch('*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...1] { _id }');
      console.log('✅ Sanity connection successful');
    } catch (connectionError) {
      console.log('❌ Sanity connection failed:', connectionError.message);
      return;
    }
    
    // Test 2: Check if conferenceRegistration schema exists
    console.log('\n📋 Checking Conference Registration Schema...');
    try {
      const registrationCount = await client.fetch('count(*[_type == "conferenceRegistration"])');
      console.log(`✅ Conference Registration schema exists`);
      console.log(`📊 Total registrations in database: ${registrationCount}`);
    } catch (schemaError) {
      console.log('❌ Conference Registration schema issue:', schemaError.message);
    }
    
    // Test 3: Fetch recent registrations
    console.log('\n📋 Fetching Recent Registration Data...');
    try {
      const recentRegistrations = await client.fetch(`
        *[_type == "conferenceRegistration"] | order(_createdAt desc) [0...5] {
          _id,
          _createdAt,
          registrationId,
          registrationType,
          personalDetails {
            firstName,
            lastName,
            email,
            phoneNumber
          },
          pricing {
            totalPrice,
            currency
          },
          paymentStatus,
          paypalTransactionId,
          registrationDate
        }
      `);
      
      if (recentRegistrations.length > 0) {
        console.log(`✅ Found ${recentRegistrations.length} recent registration(s)`);
        console.log('\n📋 Sample Registration Data:');
        recentRegistrations.forEach((reg, index) => {
          console.log(`   ${index + 1}. ID: ${reg._id}`);
          console.log(`      Registration ID: ${reg.registrationId || 'N/A'}`);
          console.log(`      Name: ${reg.personalDetails?.firstName || 'N/A'} ${reg.personalDetails?.lastName || 'N/A'}`);
          console.log(`      Email: ${reg.personalDetails?.email || 'N/A'}`);
          console.log(`      Status: ${reg.paymentStatus || 'N/A'}`);
          console.log(`      Created: ${reg._createdAt || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('⚠️  No registration records found in database');
      }
    } catch (fetchError) {
      console.log('❌ Failed to fetch registration data:', fetchError.message);
    }
    
    // Test 4: Check RegistrationTableView query
    console.log('📋 Testing RegistrationTableView Query...');
    try {
      const tableViewQuery = `*[_type == "conferenceRegistration"] | order(registrationDate desc) {
        _id,
        registrationId,
        registrationType,
        personalDetails {
          title,
          firstName,
          lastName,
          email,
          phoneNumber,
          country,
          fullPostalAddress
        },
        sponsorType,
        numberOfParticipants,
        pricing {
          registrationFee,
          accommodationFee,
          totalPrice,
          currency,
          pricingPeriod
        },
        paymentStatus,
        paypalTransactionId,
        paypalOrderId,
        paymentMethod,
        paymentDate,
        registrationDate,
        pdfReceipt {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        registrationTable {
          paypalTransactionId,
          registrationType,
          participantName,
          phoneNumber,
          emailAddress,
          paymentAmount,
          currency,
          paymentStatus,
          registrationDate,
          pdfReceiptFile {
            asset-> {
              _id,
              url,
              originalFilename
            }
          }
        }
      }`;
      
      const tableData = await client.fetch(tableViewQuery);
      console.log(`✅ RegistrationTableView query successful`);
      console.log(`📊 Records returned: ${tableData.length}`);
      
    } catch (queryError) {
      console.log('❌ RegistrationTableView query failed:', queryError.message);
    }
    
    // Test 5: Check API endpoints (if they exist)
    console.log('\n📋 Checking Registration API Endpoints...');
    const fs = require('fs');
    const path = require('path');
    
    const apiPaths = [
      'nextjs-frontend/src/app/api/register/route.js',
      'nextjs-frontend/src/app/api/register/route.ts',
      'nextjs-frontend/src/app/api/registration/route.js',
      'nextjs-frontend/src/app/api/registration/route.ts'
    ];
    
    let apiEndpointFound = false;
    for (const apiPath of apiPaths) {
      if (fs.existsSync(path.join(__dirname, apiPath))) {
        console.log(`✅ Found API endpoint: ${apiPath}`);
        apiEndpointFound = true;
      }
    }
    
    if (!apiEndpointFound) {
      console.log('⚠️  No registration API endpoints found');
    }
    
    // Test 6: Check frontend registration form
    console.log('\n📋 Checking Frontend Registration Components...');
    const frontendPaths = [
      'nextjs-frontend/src/app/register/page.js',
      'nextjs-frontend/src/app/register/page.tsx',
      'nextjs-frontend/src/components/RegistrationForm.js',
      'nextjs-frontend/src/components/RegistrationForm.tsx'
    ];
    
    let frontendFound = false;
    for (const frontendPath of frontendPaths) {
      if (fs.existsSync(path.join(__dirname, frontendPath))) {
        console.log(`✅ Found frontend component: ${frontendPath}`);
        frontendFound = true;
      }
    }
    
    if (!frontendFound) {
      console.log('⚠️  No frontend registration components found');
    }
    
    console.log('\n📊 DIAGNOSTIC SUMMARY:');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('💥 Diagnostic failed:', error.message);
    console.log('\n🔧 Possible Issues:');
    console.log('   - Sanity client configuration problems');
    console.log('   - Network connectivity issues');
    console.log('   - Missing environment variables');
    console.log('   - Schema deployment issues');
  }
}

// Run diagnostics
diagnoseSanityDataIssues();
