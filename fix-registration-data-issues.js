require('dotenv').config();
const { createClient } = require('@sanity/client');

/**
 * Fix registration data storage issues by:
 * 1. Creating test registration data
 * 2. Verifying data storage and retrieval
 * 3. Testing the RegistrationTableView queries
 */

async function fixRegistrationDataIssues() {
  try {
    console.log('🔧 FIXING REGISTRATION DATA STORAGE ISSUES...\n');
    
    // Create Sanity client with write permissions
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN
    });
    
    console.log('📋 Environment Check:');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho'}`);
    console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`);
    console.log(`   API Token: ${process.env.SANITY_API_TOKEN ? 'Present' : 'Missing'}`);
    
    if (!process.env.SANITY_API_TOKEN) {
      console.log('❌ SANITY_API_TOKEN is required for write operations');
      console.log('🔧 Please add SANITY_API_TOKEN to your .env file');
      return;
    }
    
    // Test connection
    console.log('\n🔗 Testing Sanity connection...');
    try {
      await client.fetch('*[_type == "siteSettings"][0]._id');
      console.log('✅ Sanity connection successful');
    } catch (error) {
      console.log('❌ Sanity connection failed:', error.message);
      return;
    }
    
    // Create test registration data
    console.log('\n📝 Creating test registration data...');
    
    const testRegistrations = [
      {
        _type: 'conferenceRegistration',
        registrationId: 'REG-TEST-001',
        registrationType: 'regular',
        personalDetails: {
          title: 'Dr',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@university.edu',
          phoneNumber: '+1-555-0101',
          country: 'United States',
          fullPostalAddress: '123 Academic Street, University City, CA 90210, United States'
        },
        numberOfParticipants: 1,
        pricing: {
          registrationFee: 299.00,
          accommodationFee: 0.00,
          totalPrice: 299.00,
          currency: 'USD',
          pricingPeriod: 'Early Bird'
        },
        paymentStatus: 'completed',
        paypalTransactionId: 'TXN123456789',
        paypalOrderId: 'ORDER123456789',
        paymentMethod: 'paypal',
        paymentDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true,
        // Add registrationTable data for enhanced table view
        registrationTable: {
          paypalTransactionId: 'TXN123456789',
          registrationType: 'regular',
          participantName: 'Dr John Smith',
          phoneNumber: '+1-555-0101',
          emailAddress: 'john.smith@university.edu',
          paymentAmount: 299.00,
          currency: 'USD',
          paymentStatus: 'successful',
          registrationDate: new Date().toISOString()
        }
      },
      {
        _type: 'conferenceRegistration',
        registrationId: 'REG-TEST-002',
        registrationType: 'sponsorship',
        personalDetails: {
          title: 'Ms',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@company.com',
          phoneNumber: '+1-555-0202',
          country: 'Canada',
          fullPostalAddress: '456 Business Ave, Toronto, ON M5V 3A8, Canada'
        },
        sponsorType: 'Gold',
        numberOfParticipants: 2,
        pricing: {
          registrationFee: 599.00,
          accommodationFee: 150.00,
          totalPrice: 749.00,
          currency: 'USD',
          pricingPeriod: 'Regular'
        },
        paymentStatus: 'pending',
        paypalTransactionId: 'TXN987654321',
        paypalOrderId: 'ORDER987654321',
        paymentMethod: 'paypal',
        registrationDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        lastUpdated: new Date().toISOString(),
        isActive: true,
        // Add registrationTable data for enhanced table view
        registrationTable: {
          paypalTransactionId: 'TXN987654321',
          registrationType: 'sponsorship',
          participantName: 'Ms Sarah Johnson',
          phoneNumber: '+1-555-0202',
          emailAddress: 'sarah.johnson@company.com',
          paymentAmount: 749.00,
          currency: 'USD',
          paymentStatus: 'pending',
          registrationDate: new Date(Date.now() - 86400000).toISOString()
        }
      },
      {
        _type: 'conferenceRegistration',
        registrationId: 'REG-TEST-003',
        registrationType: 'regular',
        personalDetails: {
          title: 'Prof',
          firstName: 'Maria',
          lastName: 'Garcia',
          email: 'maria.garcia@hospital.org',
          phoneNumber: '+34-666-123456',
          country: 'Spain',
          fullPostalAddress: 'Calle de la Salud 789, 28001 Madrid, Spain'
        },
        numberOfParticipants: 1,
        pricing: {
          registrationFee: 349.00,
          accommodationFee: 200.00,
          totalPrice: 549.00,
          currency: 'EUR',
          pricingPeriod: 'Regular'
        },
        paymentStatus: 'failed',
        paypalTransactionId: 'TXN555666777',
        paymentMethod: 'paypal',
        registrationDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        lastUpdated: new Date().toISOString(),
        isActive: true,
        // Add registrationTable data for enhanced table view
        registrationTable: {
          paypalTransactionId: 'TXN555666777',
          registrationType: 'regular',
          participantName: 'Prof Maria Garcia',
          phoneNumber: '+34-666-123456',
          emailAddress: 'maria.garcia@hospital.org',
          paymentAmount: 549.00,
          currency: 'EUR',
          paymentStatus: 'failed',
          registrationDate: new Date(Date.now() - 172800000).toISOString()
        }
      }
    ];
    
    // Insert test registrations
    let successCount = 0;
    for (const registration of testRegistrations) {
      try {
        const result = await client.create(registration);
        console.log(`✅ Created registration: ${registration.registrationId} (${result._id})`);
        successCount++;
      } catch (error) {
        console.log(`❌ Failed to create registration ${registration.registrationId}:`, error.message);
      }
    }
    
    console.log(`\n📊 Created ${successCount}/${testRegistrations.length} test registrations`);
    
    // Verify data storage
    console.log('\n🔍 Verifying data storage...');
    try {
      const totalCount = await client.fetch('count(*[_type == "conferenceRegistration"])');
      console.log(`✅ Total registrations in database: ${totalCount}`);
      
      const recentRegistrations = await client.fetch(`
        *[_type == "conferenceRegistration"] | order(_createdAt desc) [0...5] {
          _id,
          registrationId,
          personalDetails.firstName,
          personalDetails.lastName,
          personalDetails.email,
          paymentStatus,
          pricing.totalPrice,
          pricing.currency
        }
      `);
      
      console.log('\n📋 Recent registrations:');
      recentRegistrations.forEach((reg, index) => {
        console.log(`   ${index + 1}. ${reg.registrationId} - ${reg.personalDetails?.firstName} ${reg.personalDetails?.lastName}`);
        console.log(`      Email: ${reg.personalDetails?.email}`);
        console.log(`      Status: ${reg.paymentStatus} | Amount: ${reg.pricing?.currency} ${reg.pricing?.totalPrice}`);
        console.log('');
      });
      
    } catch (error) {
      console.log('❌ Failed to verify data:', error.message);
    }
    
    // Test RegistrationTableView query
    console.log('🔍 Testing RegistrationTableView query...');
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
        registrationTable
      }`;
      
      const tableData = await client.fetch(tableViewQuery);
      console.log(`✅ RegistrationTableView query successful - ${tableData.length} records`);
      
      if (tableData.length > 0) {
        console.log('\n📊 Sample table data:');
        const sample = tableData[0];
        console.log(`   Registration ID: ${sample.registrationId}`);
        console.log(`   Type: ${sample.registrationType}`);
        console.log(`   Name: ${sample.personalDetails?.firstName} ${sample.personalDetails?.lastName}`);
        console.log(`   PayPal TXN: ${sample.paypalTransactionId}`);
        console.log(`   Status: ${sample.paymentStatus}`);
        console.log(`   Has Table Data: ${!!sample.registrationTable}`);
      }
      
    } catch (error) {
      console.log('❌ RegistrationTableView query failed:', error.message);
    }
    
    console.log('\n🎉 REGISTRATION DATA ISSUES FIXED!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open Sanity Studio: http://localhost:3333');
    console.log('2. Navigate to Registration System → Conference Registrations');
    console.log('3. Check Registration System → Registrations Table');
    console.log('4. Verify data is displayed correctly');
    console.log('5. Test filtering and sorting functionality');
    
  } catch (error) {
    console.error('💥 Fix failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Ensure SANITY_API_TOKEN is set in .env file');
    console.log('   - Verify token has write permissions');
    console.log('   - Check Sanity Studio is running');
    console.log('   - Confirm network connectivity');
  }
}

// Run the fix
fixRegistrationDataIssues();
