/**
 * COMPREHENSIVE DATA FLOW ANALYSIS
 * Analyzes the complete customer data flow from registration to PDF/email generation
 */

console.log('🔍 COMPREHENSIVE DATA FLOW ANALYSIS');
console.log('=' .repeat(80));

// Test with the known registration data
const TEST_REGISTRATION_ID = 'TEMP-REG-MFH46V9N66901-UI3CH16KDSVHWP';
const TEST_PAYPAL_ORDER_ID = '6TH64068YS9153249';

async function analyzeDataFlow() {
  try {
    console.log('\n🎯 PHASE 1: REGISTRATION DATA RETRIEVAL ANALYSIS');
    console.log('-' .repeat(60));
    
    // Test registration API endpoint
    console.log('📋 Testing registration API endpoint...');
    const regResponse = await fetch(`http://localhost:3000/api/registration?registrationId=${TEST_REGISTRATION_ID}`);
    
    if (regResponse.ok) {
      const regData = await regResponse.json();
      console.log('✅ Registration API Response:');
      console.log('   Registration ID:', regData.registrationId);
      console.log('   Customer Name:', regData.personalDetails ? 
        `${regData.personalDetails.title || ''} ${regData.personalDetails.firstName || ''} ${regData.personalDetails.lastName || ''}`.trim() : 'N/A');
      console.log('   Email:', regData.personalDetails?.email || 'N/A');
      console.log('   Phone:', regData.personalDetails?.phoneNumber || 'N/A');
      console.log('   Country:', regData.personalDetails?.country || 'N/A');
      console.log('   Address:', regData.personalDetails?.fullPostalAddress || 'N/A');
      console.log('   Registration Type:', regData.selectedRegistrationName || 'N/A');
      console.log('   Payment Status:', regData.paymentStatus || 'N/A');
      
      console.log('\n📋 Raw Registration Data Structure:');
      console.log(JSON.stringify(regData, null, 2));
      
    } else {
      console.log('❌ Registration API failed:', regResponse.status);
      const errorData = await regResponse.json();
      console.log('   Error:', errorData);
    }
    
    console.log('\n🎯 PHASE 2: PDF GENERATION DATA FLOW ANALYSIS');
    console.log('-' .repeat(60));
    
    // Test PDF generation with registration data
    console.log('📄 Testing PDF generation with registration data...');
    const pdfResponse = await fetch('http://localhost:3000/api/pdf/receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationId: TEST_REGISTRATION_ID,
        transactionId: `TXN-${TEST_PAYPAL_ORDER_ID}`,
        orderId: TEST_PAYPAL_ORDER_ID,
        amount: '1.00',
        currency: 'USD',
        capturedAt: new Date().toISOString()
      }),
    });
    
    if (pdfResponse.ok) {
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfFilename = `data-flow-analysis-${Date.now()}.pdf`;
      require('fs').writeFileSync(pdfFilename, Buffer.from(pdfBuffer));
      
      console.log(`✅ PDF generated: ${pdfFilename} (${pdfBuffer.byteLength} bytes)`);
      console.log('📋 PDF should contain registration form data, not fallback data');
      
      // Open PDF for verification
      require('child_process').exec(`start ${pdfFilename}`, (error) => {
        if (error) {
          console.log('⚠️ Could not open PDF automatically');
        }
      });
      
    } else {
      const pdfError = await pdfResponse.json();
      console.log('❌ PDF generation failed:', pdfError);
    }
    
    console.log('\n🎯 PHASE 3: EMAIL CONFIGURATION ANALYSIS');
    console.log('-' .repeat(60));
    
    // Test email sending configuration
    console.log('📧 Testing email sending configuration...');
    const emailResponse = await fetch('http://localhost:3000/api/email/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationId: TEST_REGISTRATION_ID,
        testEmail: 'professor2004h@gmail.com',
        paymentData: {
          transactionId: `TXN-${TEST_PAYPAL_ORDER_ID}`,
          orderId: TEST_PAYPAL_ORDER_ID,
          amount: '1.00',
          currency: 'USD',
          capturedAt: new Date().toISOString(),
          paymentMethod: 'PayPal'
        }
      }),
    });
    
    if (emailResponse.ok) {
      const emailResult = await emailResponse.json();
      console.log('✅ Email API Response:');
      console.log('   Success:', emailResult.success);
      console.log('   Recipient:', emailResult.details?.recipient);
      console.log('   Customer Email:', emailResult.details?.customerEmail);
      console.log('   Registration ID:', emailResult.details?.registrationId);
      console.log('   PDF Generated:', emailResult.details?.pdfGenerated);
      console.log('   Message ID:', emailResult.details?.messageId);
      
      // Check if email is being sent from correct address
      console.log('\n📧 Email Configuration Check:');
      console.log('   Expected FROM: contactus@intelliglobalconferences.com');
      console.log('   Expected TO: professor2004h@gmail.com (registration form email)');
      console.log('   Expected Content: Registration form customer data');
      
    } else {
      const emailError = await emailResponse.json();
      console.log('❌ Email sending failed:', emailError);
    }
    
    console.log('\n🎯 PHASE 4: SUCCESS PAGE DATA ANALYSIS');
    console.log('-' .repeat(60));
    
    // Test success page data retrieval
    const successUrl = `http://localhost:3000/registration/success?` +
      `registration_id=${TEST_PAYPAL_ORDER_ID}&` +
      `transaction_id=TXN-${TEST_PAYPAL_ORDER_ID}&` +
      `order_id=${TEST_PAYPAL_ORDER_ID}&` +
      `amount=1&` +
      `currency=USD&` +
      `payment_method=paypal&` +
      `status=completed&` +
      `captured_at=${encodeURIComponent(new Date().toISOString())}`;
    
    console.log('🌐 Success Page URL:');
    console.log(`   ${successUrl}`);
    console.log('');
    console.log('📋 Success page should display:');
    console.log('   ✅ Registration form customer data');
    console.log('   ❌ NOT PayPal payer data');
    console.log('   ✅ Email from registration form');
    console.log('   ✅ Phone from registration form');
    console.log('   ✅ Address from registration form');
    
    console.log('\n🎯 PHASE 5: SANITY DATABASE DIRECT QUERY');
    console.log('-' .repeat(60));
    
    // Test direct Sanity query to verify data exists
    console.log('🗄️ Testing direct Sanity database query...');
    try {
      const sanityResponse = await fetch('http://localhost:3000/api/sanity-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `*[_type == "conferenceRegistration" && registrationId == "${TEST_REGISTRATION_ID}"][0]{
            _id,
            registrationId,
            personalDetails,
            selectedRegistrationName,
            sponsorType,
            accommodationType,
            numberOfParticipants,
            pricing,
            paymentStatus,
            registrationDate
          }`
        }),
      });
      
      if (sanityResponse.ok) {
        const sanityData = await sanityResponse.json();
        console.log('✅ Direct Sanity Query Result:');
        console.log(JSON.stringify(sanityData, null, 2));
      } else {
        console.log('❌ Direct Sanity query failed - API endpoint may not exist');
      }
    } catch (sanityError) {
      console.log('⚠️ Sanity test endpoint not available:', sanityError.message);
    }
    
    console.log('\n🎯 PHASE 6: CRITICAL ISSUES IDENTIFICATION');
    console.log('-' .repeat(60));
    
    console.log('🔍 POTENTIAL ISSUES TO CHECK:');
    console.log('');
    console.log('1. 📋 REGISTRATION DATA RETRIEVAL:');
    console.log('   - Is the registration API finding the correct record?');
    console.log('   - Is the registration data structure correct?');
    console.log('   - Are personalDetails populated correctly?');
    console.log('');
    console.log('2. 📄 PDF GENERATION:');
    console.log('   - Are the helper functions (getFullName, getEmail, etc.) working correctly?');
    console.log('   - Is the registration data being passed to PDF generation correctly?');
    console.log('   - Are fallback values being used instead of real data?');
    console.log('');
    console.log('3. 📧 EMAIL CONFIGURATION:');
    console.log('   - Is the sender email set to contactus@intelliglobalconferences.com?');
    console.log('   - Is the recipient email from registration form, not PayPal?');
    console.log('   - Is the email content using registration form data?');
    console.log('');
    console.log('4. 🌐 SUCCESS PAGE:');
    console.log('   - Is the success page fetching registration data correctly?');
    console.log('   - Are fallback values being used instead of real data?');
    console.log('   - Is the PayPal order ID being linked to registration correctly?');
    
    console.log('\n🎯 PHASE 7: RECOMMENDED FIXES');
    console.log('-' .repeat(60));
    
    console.log('🔧 IMMEDIATE ACTIONS NEEDED:');
    console.log('');
    console.log('1. ✅ VERIFY REGISTRATION DATA STRUCTURE:');
    console.log('   - Check if personalDetails.firstName, lastName, email exist');
    console.log('   - Ensure selectedRegistrationName is populated');
    console.log('   - Verify pricing information is correct');
    console.log('');
    console.log('2. ✅ FIX EMAIL SENDER CONFIGURATION:');
    console.log('   - Ensure FROM address is contactus@intelliglobalconferences.com');
    console.log('   - Verify SMTP configuration is correct');
    console.log('   - Check email template uses registration form data');
    console.log('');
    console.log('3. ✅ ENHANCE DATA RETRIEVAL:');
    console.log('   - Improve registration lookup by PayPal order ID');
    console.log('   - Add better error handling for missing data');
    console.log('   - Ensure fallback data is professional');
    console.log('');
    console.log('4. ✅ TEST WITH REAL SCENARIO:');
    console.log('   - Create new registration with different data than PayPal account');
    console.log('   - Verify PDF shows registration form data, not PayPal data');
    console.log('   - Confirm email goes to registration form email address');
    
    console.log('\n🎉 DATA FLOW ANALYSIS COMPLETE');
    console.log('=' .repeat(80));
    console.log('📋 Manual verification required for:');
    console.log('   - PDF content accuracy');
    console.log('   - Email recipient and sender addresses');
    console.log('   - Success page data display');
    console.log('   - Registration form data vs PayPal payer data usage');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ DATA FLOW ANALYSIS FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the analysis
analyzeDataFlow()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 COMPREHENSIVE DATA FLOW ANALYSIS COMPLETE!');
      console.log('📋 Review the output above to identify data mismatch issues!');
      process.exit(0);
    } else {
      console.log('\n❌ DATA FLOW ANALYSIS FAILED!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Analysis execution failed:', error);
    process.exit(1);
  });
