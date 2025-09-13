/**
 * DIAGNOSE PRODUCTION EMAIL ISSUE
 * Tests the email and PDF storage system to identify why it's not working in production
 */

console.log('🔍 DIAGNOSING PRODUCTION EMAIL AND PDF STORAGE ISSUE');
console.log('=' .repeat(80));

const TEST_REGISTRATION_ID = 'TEMP-REG-MFH46V9N66901-UI3CH16KDSVHWP';
const TEST_PAYPAL_ORDER_ID = '6TH64068YS9153249';

async function diagnoseProductionEmailIssue() {
  try {
    console.log('\n🎯 PHASE 1: CHECK ENVIRONMENT VARIABLES');
    console.log('-' .repeat(60));
    
    console.log('🔍 Environment Variables Check:');
    console.log(`   VERCEL_URL: ${process.env.VERCEL_URL || 'NOT SET'}`);
    console.log(`   NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'}`);
    console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || 'NOT SET'}`);
    console.log(`   SMTP_USER: ${process.env.SMTP_USER || 'NOT SET'}`);
    console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? 'SET' : 'NOT SET'}`);
    console.log(`   SANITY_API_TOKEN: ${process.env.SANITY_API_TOKEN ? 'SET' : 'NOT SET'}`);
    
    // Determine the base URL that would be used
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';
    
    console.log(`\n🌐 Base URL Resolution: ${baseUrl}`);
    
    console.log('\n🎯 PHASE 2: TEST EMAIL API DIRECTLY');
    console.log('-' .repeat(60));
    
    // Test the email API directly to see if it works
    console.log('📧 Testing email API directly...');
    const emailResponse = await fetch(`${baseUrl}/api/email/send-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationId: TEST_REGISTRATION_ID,
        transactionId: `TXN-${TEST_PAYPAL_ORDER_ID}-DIAGNOSTIC`,
        orderId: `${TEST_PAYPAL_ORDER_ID}-DIAGNOSTIC`,
        amount: '1.00',
        currency: 'USD',
        capturedAt: new Date().toISOString(),
        testEmail: 'professor2004h@gmail.com'
      }),
    });
    
    if (emailResponse.ok) {
      const emailResult = await emailResponse.json();
      console.log('✅ Email API Response:');
      console.log(`   Success: ${emailResult.success}`);
      console.log(`   Recipient: ${emailResult.details?.recipient}`);
      console.log(`   PDF Generated: ${emailResult.details?.pdfGenerated}`);
      console.log(`   PDF Size: ${emailResult.details?.pdfSize} bytes`);
      console.log(`   PDF Uploaded: ${emailResult.details?.pdfUploaded}`);
      console.log(`   PDF Asset ID: ${emailResult.details?.pdfAssetId}`);
      console.log(`   Message ID: ${emailResult.details?.messageId}`);
      
      if (emailResult.success) {
        console.log('\n🎉 EMAIL API IS WORKING!');
        console.log('   The issue is likely in the PayPal capture workflow integration');
      } else {
        console.log('\n❌ EMAIL API HAS ISSUES');
        console.log('   Need to fix the email API first');
      }
      
    } else {
      const emailError = await emailResponse.text();
      console.log('❌ Email API failed:', emailError);
    }
    
    console.log('\n🎯 PHASE 3: CHECK REGISTRATION RECORD');
    console.log('-' .repeat(60));
    
    // Check the registration record
    console.log('🗄️ Checking registration record...');
    const regResponse = await fetch(`${baseUrl}/api/registration?registrationId=${TEST_REGISTRATION_ID}`);
    
    if (regResponse.ok) {
      const regData = await regResponse.json();
      const registration = regData.success ? regData.data : regData;
      
      console.log('✅ Registration Record:');
      console.log(`   Registration ID: ${registration.registrationId}`);
      console.log(`   Payment Status: ${registration.paymentStatus}`);
      console.log(`   Customer Email: ${registration.personalDetails?.email}`);
      console.log(`   PayPal Order ID: ${registration.paypalOrderId || 'NOT SET'}`);
      console.log(`   PayPal Transaction ID: ${registration.paypalTransactionId || 'NOT SET'}`);
      console.log(`   PDF Receipt: ${registration.pdfReceipt ? 'EXISTS' : 'MISSING'}`);
      console.log(`   Registration Table PDF: ${registration.registrationTable?.pdfReceiptFile ? 'EXISTS' : 'MISSING'}`);
      
      if (registration.personalDetails?.email) {
        console.log('\n✅ CUSTOMER EMAIL AVAILABLE');
        console.log(`   Email: ${registration.personalDetails.email}`);
      } else {
        console.log('\n❌ CUSTOMER EMAIL MISSING');
        console.log('   Cannot send email without customer email address');
      }
      
    } else {
      console.log('❌ Failed to fetch registration record');
    }
    
    console.log('\n🎯 PHASE 4: IDENTIFY ROOT CAUSE');
    console.log('-' .repeat(60));
    
    console.log('🔍 POTENTIAL ISSUES:');
    console.log('');
    console.log('1. 🌐 BASE URL RESOLUTION:');
    console.log(`   Current base URL: ${baseUrl}`);
    console.log('   - In production, this should be the actual domain');
    console.log('   - If using localhost, the async fetch will fail');
    console.log('');
    console.log('2. ⏱️ ASYNC EXECUTION:');
    console.log('   - setImmediate() might not work properly in serverless environment');
    console.log('   - Vercel functions have execution time limits');
    console.log('   - Async operations might be terminated early');
    console.log('');
    console.log('3. 📧 EMAIL CONFIGURATION:');
    console.log('   - SMTP credentials might not be set in production');
    console.log('   - Email service might be blocked or rate limited');
    console.log('   - DNS or network issues in production environment');
    console.log('');
    console.log('4. 🗄️ SANITY INTEGRATION:');
    console.log('   - SANITY_API_TOKEN might not be set in production');
    console.log('   - Sanity write permissions might be restricted');
    console.log('   - Network connectivity to Sanity might be blocked');
    
    console.log('\n🎯 PHASE 5: RECOMMENDED FIXES');
    console.log('-' .repeat(60));
    
    console.log('🔧 IMMEDIATE FIXES NEEDED:');
    console.log('');
    console.log('1. ✅ FIX BASE URL RESOLUTION:');
    console.log('   - Set NEXT_PUBLIC_BASE_URL to actual production domain');
    console.log('   - Use absolute URL for production environment');
    console.log('   - Test with actual production domain');
    console.log('');
    console.log('2. ✅ REPLACE setImmediate() WITH DIRECT CALL:');
    console.log('   - Remove async setImmediate() wrapper');
    console.log('   - Call email API directly in PayPal capture route');
    console.log('   - Handle errors properly without affecting payment success');
    console.log('');
    console.log('3. ✅ VERIFY ENVIRONMENT VARIABLES:');
    console.log('   - Ensure all SMTP credentials are set in production');
    console.log('   - Verify SANITY_API_TOKEN is configured');
    console.log('   - Check Vercel environment variable settings');
    console.log('');
    console.log('4. ✅ ADD BETTER ERROR HANDLING:');
    console.log('   - Log detailed error messages');
    console.log('   - Add fallback mechanisms');
    console.log('   - Implement retry logic for failed operations');
    
    console.log('\n🎯 PHASE 6: PRODUCTION TESTING PLAN');
    console.log('-' .repeat(60));
    
    console.log('📋 TESTING STEPS:');
    console.log('');
    console.log('1. 🔧 APPLY FIXES:');
    console.log('   - Fix base URL resolution in PayPal capture');
    console.log('   - Replace setImmediate() with direct email API call');
    console.log('   - Add proper error handling and logging');
    console.log('');
    console.log('2. 🌐 DEPLOY TO PRODUCTION:');
    console.log('   - Push changes to main branch');
    console.log('   - Verify Vercel deployment completes successfully');
    console.log('   - Check environment variables are set correctly');
    console.log('');
    console.log('3. 🧪 TEST COMPLETE FLOW:');
    console.log('   - Create new registration on production site');
    console.log('   - Complete PayPal payment');
    console.log('   - Check Sanity CMS for PDF storage');
    console.log('   - Verify email delivery to customer');
    console.log('');
    console.log('4. 📋 VERIFY RESULTS:');
    console.log('   - Registration status updates to "completed"');
    console.log('   - PDF appears in Sanity registrations table');
    console.log('   - Customer receives confirmation email');
    console.log('   - PDF download works from Sanity CMS');
    
    console.log('\n🎉 DIAGNOSTIC COMPLETE');
    console.log('=' .repeat(80));
    console.log('📋 NEXT STEPS:');
    console.log('   1. Apply the recommended fixes');
    console.log('   2. Test in production environment');
    console.log('   3. Monitor logs for any remaining issues');
    console.log('   4. Verify complete customer journey works');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ DIAGNOSTIC FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the diagnostic
diagnoseProductionEmailIssue()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 DIAGNOSTIC COMPLETE!');
      console.log('📋 Review the findings and apply the recommended fixes!');
      process.exit(0);
    } else {
      console.log('\n❌ DIAGNOSTIC FAILED!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Diagnostic execution failed:', error);
    process.exit(1);
  });
