const { createClient } = require('@sanity/client');

console.log('🔍 TESTING SANITY WRITE PERMISSIONS');
console.log('===================================\n');

// Use hardcoded values from .env.local
const projectId = 'fl5uetho';
const dataset = 'production';
const apiVersion = '2023-05-03';
const token = 'skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n';

console.log('📋 Configuration:');
console.log(`  Project ID: ${projectId}`);
console.log(`  Dataset: ${dataset}`);
console.log(`  API Version: ${apiVersion}`);
console.log(`  Token: ${token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'NOT FOUND'}`);
console.log(`  Token Length: ${token ? token.length : 0}`);

if (!token) {
  console.log('\n❌ SANITY_API_TOKEN not found in environment variables');
  console.log('Please check your .env.local file');
  process.exit(1);
}

// Create write client
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function testWritePermissions() {
  try {
    console.log('\n🧪 Testing write permissions...');
    
    // Test 1: Try to create a test document
    console.log('\n1. Testing document creation...');
    const testDoc = {
      _type: 'conferenceRegistration',
      registrationId: `TEST-${Date.now()}`,
      personalDetails: {
        title: 'Dr',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Dr Test User',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        country: 'Test Country',
        abstractCategory: 'Test',
        fullPostalAddress: 'Test Address'
      },
      selectedRegistration: 'Test Registration',
      numberOfParticipants: 1,
      pricing: {
        registrationFee: 100,
        accommodationFee: 0,
        totalPrice: 100,
        currency: 'USD',
        pricingPeriod: 'test',
        formattedTotalPrice: '$100 USD'
      },
      paymentStatus: 'completed',
      paymentId: `TEST_PAY_${Date.now()}`,
      paymentMethod: 'test_payment',
      isTestPayment: true,
      registrationDate: new Date().toISOString(),
      registrationSummary: {
        registrationType: 'Test Registration',
        selectedOption: 'Test Registration',
        participantCount: 1,
        hasAccommodation: false,
        paymentStatusDisplay: 'COMPLETED (TEST)'
      }
    };

    const result = await writeClient.create(testDoc);
    console.log('✅ Document created successfully:', result._id);

    // Test 2: Try to update the document
    console.log('\n2. Testing document update...');
    const updateResult = await writeClient
      .patch(result._id)
      .set({ 
        lastUpdated: new Date().toISOString(),
        testUpdate: 'Updated successfully'
      })
      .commit();
    
    console.log('✅ Document updated successfully:', updateResult._id);

    // Test 3: Try to create a payment record
    console.log('\n3. Testing payment record creation...');
    const paymentRecord = {
      _type: 'paymentRecord',
      registrationId: testDoc.registrationId,
      registrationRef: {
        _type: 'reference',
        _ref: result._id,
      },
      paymentId: testDoc.paymentId,
      orderId: `TEST_ORDER_${Date.now()}`,
      amount: 100,
      currency: 'USD',
      paymentMethod: 'test_payment',
      paymentStatus: 'completed',
      paymentDate: new Date().toISOString(),
      isTestPayment: true,
      customerName: 'Dr Test User',
      customerEmail: 'test@example.com',
      formattedAmount: '$100 USD',
      paymentStatusDisplay: 'COMPLETED (TEST)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const paymentResult = await writeClient.create(paymentRecord);
    console.log('✅ Payment record created successfully:', paymentResult._id);

    // Test 4: Clean up test documents
    console.log('\n4. Cleaning up test documents...');
    await writeClient.delete(result._id);
    await writeClient.delete(paymentResult._id);
    console.log('✅ Test documents cleaned up successfully');

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Sanity write permissions are working correctly');
    console.log('✅ Registration documents can be created and updated');
    console.log('✅ Payment records can be created');
    console.log('✅ The test payment system should now work properly');

  } catch (error) {
    console.error('\n❌ WRITE PERMISSION TEST FAILED:', error);
    
    if (error.statusCode === 403) {
      console.error('\n🔒 PERMISSION ERROR DETAILS:');
      console.error('- The API token does not have write permissions');
      console.error('- The token may be read-only or invalid');
      console.error('- Check if the token has "Editor" or "Admin" permissions');
    } else if (error.statusCode === 401) {
      console.error('\n🔑 AUTHENTICATION ERROR:');
      console.error('- The API token is invalid or expired');
      console.error('- Generate a new token from Sanity dashboard');
    } else {
      console.error('\n🔧 OTHER ERROR:');
      console.error('- Check network connectivity');
      console.error('- Verify project ID and dataset');
      console.error('- Check Sanity service status');
    }

    console.error('\n📋 TROUBLESHOOTING STEPS:');
    console.error('1. Go to https://sanity.io/manage');
    console.error(`2. Select project: ${projectId}`);
    console.error('3. Go to API tab');
    console.error('4. Create new token with "Editor" permissions');
    console.error('5. Update SANITY_API_TOKEN in .env.local');
    console.error('6. Restart the development server');
  }
}

testWritePermissions();
