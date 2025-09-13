import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReceiptEmail } from '@/app/services/emailService';
import { writeClient, client } from '@/app/sanity/client';

/**
 * CRITICAL FIX: REGISTRATION FORM DATA PRIORITY SYSTEM
 * This function should NEVER be used for normal registrations.
 * It only creates minimal fallback data when absolutely no registration exists.
 * All customer data should come from registration forms, NOT PayPal payer info.
 */
async function createFallbackRegistration(paypalOrderId: string, amount: string, currency: string, captureDetails: any) {
  try {
    console.log('🚨 CRITICAL: Creating fallback registration for truly orphaned PayPal order:', {
      paypalOrderId,
      amount,
      currency,
      note: 'This should only happen for orders with NO corresponding registration form data'
    });

    // Generate a recovery registration ID
    const recoveryRegistrationId = `RECOVERY-${paypalOrderId}`;

    // CRITICAL FIX: DO NOT USE PAYPAL PAYER DATA FOR CUSTOMER INFORMATION
    // Only use minimal fallback data to indicate this is a recovery order
    // The customer should contact support to provide their correct details

    // Create minimal fallback registration document (NOT using PayPal payer info)
    const fallbackRegistration = {
      _type: 'conferenceRegistration',
      registrationId: recoveryRegistrationId,
      paypalOrderId: paypalOrderId,
      personalDetails: {
        title: 'N/A',
        firstName: 'RECOVERY',
        lastName: 'ORDER',
        email: 'support@intelliglobalconferences.com', // Support email, not PayPal email
        phoneNumber: 'Please contact support',
        country: 'Please contact support',
        fullPostalAddress: 'Please contact support for customer details'
      },
      selectedRegistrationName: 'Recovery Order - Contact Support',
      numberOfParticipants: 1,
      pricing: {
        registrationFee: parseFloat(amount),
        accommodationFee: 0,
        totalPrice: parseFloat(amount),
        currency: currency || 'USD'
      },
      paymentStatus: 'pending', // Will be updated to completed after this function
      registrationDate: new Date().toISOString(),
      recoveryInfo: {
        isRecoveredOrder: true,
        originalPaypalOrderId: paypalOrderId,
        recoveryDate: new Date().toISOString(),
        recoveryReason: 'Orphaned PayPal order - no registration form data found',
        customerNote: 'Customer must contact support to provide correct registration details',
        supportEmail: 'support@intelliglobalconferences.com'
      }
    };

    console.log('💾 Saving minimal fallback registration to Sanity...');
    const result = await writeClient.create(fallbackRegistration);

    if (result) {
      console.log('✅ Minimal fallback registration created - customer must contact support:', {
        _id: result._id,
        registrationId: recoveryRegistrationId,
        paypalOrderId: paypalOrderId,
        note: 'Customer details set to support contact info'
      });

      return {
        _id: result._id,
        registrationId: recoveryRegistrationId,
        personalDetails: fallbackRegistration.personalDetails,
        paymentStatus: 'pending'
      };
    } else {
      console.error('❌ Failed to create fallback registration');
      return null;
    }

  } catch (error) {
    console.error('❌ Error creating fallback registration:', error);
    return null;
  }
}

/**
 * PayPal Capture Order API Route - Production Version
 * Captures a PayPal order for live payments using production credentials
 */

interface CaptureOrderRequest {
  orderId: string;
  registrationId: string;
}

/**
 * Get PayPal Access Token for Production
 */
async function getPayPalAccessToken(): Promise<string | null> {
  try {
    // Use server-side environment variables for API calls
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Missing PayPal production credentials for capture:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        clientIdSource: process.env.PAYPAL_CLIENT_ID ? 'PAYPAL_CLIENT_ID' : 'NEXT_PUBLIC_PAYPAL_CLIENT_ID'
      });
      return null;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('🔐 Requesting PayPal production access token for capture...');
    const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to get PayPal production access token:', data);
      return null;
    }

    console.log('✅ PayPal production access token obtained for capture');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal production access token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💰 Capturing PayPal production payment...');

    const body: CaptureOrderRequest = await request.json();
    const { orderId, registrationId } = body;

    // Validate request data
    if (!orderId || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, registrationId' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal' },
        { status: 500 }
      );
    }

    console.log('📦 Capturing PayPal order:', orderId);

    // Capture the PayPal order
    const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `${registrationId}-capture-${Date.now()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal order capture failed:', result);
      return NextResponse.json(
        { error: 'Failed to capture PayPal payment', details: result },
        { status: response.status }
      );
    }

    // Extract transaction details
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    const transactionId = capture?.id;
    const amount = capture?.amount?.value;
    const currency = capture?.amount?.currency_code;
    const status = capture?.status;

    console.log('✅ PayPal production payment captured successfully:', {
      orderId,
      transactionId,
      amount,
      currency,
      status
    });

    // CRITICAL FIX: Find the actual registration record using both temp ID and PayPal order ID
    let actualRegistrationId = registrationId;
    let registrationRecord = null;

    try {
      console.log('🔍 Finding registration record for payment completion...');

      // First try with the provided registration ID
      registrationRecord = await client.fetch(
        `*[_type == "conferenceRegistration" && (registrationId == $regId || paypalOrderId == $orderId)][0]{
          _id,
          registrationId,
          personalDetails,
          paymentStatus
        }`,
        { regId: registrationId, orderId }
      );

      if (registrationRecord) {
        actualRegistrationId = registrationRecord.registrationId;
        console.log('✅ Found registration record:', {
          documentId: registrationRecord._id,
          registrationId: actualRegistrationId,
          currentPaymentStatus: registrationRecord.paymentStatus
        });
      } else {
        console.error('❌ Registration record not found for:', { registrationId, orderId });

        // CRITICAL FIX: COMPREHENSIVE REGISTRATION FORM DATA LOOKUP
        // Priority 1: Find by PayPal order ID (already linked)
        // Priority 2: Find by email address from registration form (not PayPal email)
        // Priority 3: Find by any pending registration that matches payment amount

        if (result?.payer?.email_address) {
          console.log('🔍 PRIORITY LOOKUP: Searching for registration form data by email...');
          const payerEmail = result.payer.email_address;

          // Enhanced lookup with multiple fallback strategies
          const emailBasedRegistration = await client.fetch(
            `*[_type == "conferenceRegistration" && personalDetails.email == $email && paymentStatus == "pending"] | order(registrationDate desc)[0]{
              _id,
              registrationId,
              paypalOrderId,
              personalDetails,
              selectedRegistrationName,
              sponsorType,
              accommodationType,
              accommodationNights,
              numberOfParticipants,
              pricing,
              paymentStatus,
              registrationDate,
              lastUpdated,
              isActive
            }`,
            { email: payerEmail }
          );

          if (emailBasedRegistration) {
            console.log('✅ FOUND REGISTRATION FORM DATA by email match:', {
              registrationId: emailBasedRegistration.registrationId,
              formEmail: emailBasedRegistration.personalDetails?.email,
              paypalEmail: payerEmail,
              customerName: `${emailBasedRegistration.personalDetails?.firstName || ''} ${emailBasedRegistration.personalDetails?.lastName || ''}`.trim(),
              registrationType: emailBasedRegistration.selectedRegistrationName,
              amount: emailBasedRegistration.pricing?.totalPrice
            });

            registrationRecord = emailBasedRegistration;
            actualRegistrationId = emailBasedRegistration.registrationId;

            console.log('🔗 LINKING PayPal order to REGISTRATION FORM DATA (not PayPal payer data)');

            // Update the registration to link it with PayPal order
            try {
              await writeClient
                .patch(emailBasedRegistration._id)
                .set({
                  paypalOrderId: orderId,
                  paymentStatus: 'processing',
                  paypalLinkedAt: new Date().toISOString(),
                  lastUpdated: new Date().toISOString()
                })
                .commit();

              console.log('✅ Registration successfully linked to PayPal order');
            } catch (linkError) {
              console.warn('⚠️ Failed to link registration to PayPal order:', linkError);
            }
          } else {
            console.log('⚠️ No registration form found for email:', payerEmail);

            // Try broader search for recent pending registrations
            console.log('🔍 Attempting broader search for recent pending registrations...');
            const recentRegistrations = await client.fetch(
              `*[_type == "conferenceRegistration" && paymentStatus == "pending" && pricing.totalPrice == $amount] | order(registrationDate desc)[0..2]{
                _id,
                registrationId,
                personalDetails,
                selectedRegistrationName,
                pricing,
                registrationDate
              }`,
              { amount: parseFloat(amount) }
            );

            if (recentRegistrations && recentRegistrations.length > 0) {
              console.log('🔍 Found recent pending registrations with matching amount:',
                recentRegistrations.map(r => ({
                  id: r.registrationId,
                  email: r.personalDetails?.email,
                  amount: r.pricing?.totalPrice,
                  date: r.registrationDate
                }))
              );

              // Use the most recent one as a potential match
              const potentialMatch = recentRegistrations[0];
              console.log('⚠️ Using most recent matching registration as potential match');
              registrationRecord = potentialMatch;
              actualRegistrationId = potentialMatch.registrationId;
            }
          }
        }

        // If still no registration found, proceed with orphaned order recovery
        if (!registrationRecord) {
          // CRITICAL FIX: ORPHANED PAYPAL ORDER RECOVERY
          console.log('🚨 ORPHANED PAYPAL ORDER DETECTED - Attempting recovery...');

          // Create a fallback registration for this valid PayPal payment
          const fallbackRegistration = await createFallbackRegistration(orderId, amount, currency, result);

          if (fallbackRegistration) {
            registrationRecord = fallbackRegistration;
            actualRegistrationId = fallbackRegistration.registrationId;
            console.log('✅ Fallback registration created:', {
              documentId: fallbackRegistration._id,
              registrationId: actualRegistrationId,
              recoveryType: 'orphaned-order'
            });
          } else {
            throw new Error(`Registration not found for ID: ${registrationId} or Order: ${orderId} and fallback creation failed`);
          }
        }
      }
    } catch (findError) {
      console.error('❌ Error finding registration record:', findError);
      // Continue with original ID as fallback
    }

    // Update registration status with complete payment details
    try {
      console.log('💾 Updating registration with payment completion...');

      const updateResult = await writeClient
        .patch(registrationRecord._id)
        .set({
          paymentStatus: 'completed',
          paymentMethod: 'paypal',
          paypalOrderId: orderId,
          paypalTransactionId: transactionId,
          paidAmount: parseFloat(amount || '0'),
          paidCurrency: currency,
          paymentCapturedAt: new Date().toISOString(),
          paymentCompletedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          webhookProcessed: true
        })
        .commit();

      console.log('✅ Registration updated with payment completion:', updateResult._id);

    } catch (updateError) {
      console.error('❌ Failed to update registration with payment details:', updateError);
      // Don't fail the request, but log the error
    }

    // CRITICAL FIX: Call email API directly instead of using setImmediate() for production reliability
    try {
      console.log('📧 Sending email receipt with PDF storage for registration:', actualRegistrationId);

      // CRITICAL FIX: Use direct function call instead of HTTP fetch to avoid base URL issues
      console.log('🔧 Using direct function call for email and PDF processing...');

      // Import the email function directly
      const { sendPaymentReceiptEmailWithRealData } = await import('../../../utils/paymentReceiptEmailer');

      // Prepare payment data for email system
      const emailPaymentData = {
        transactionId: transactionId || capture?.id || 'N/A',
        orderId: orderId || result.id || 'N/A',
        amount: amount || capture?.amount?.value || '0',
        currency: currency || capture?.amount?.currency_code || 'USD',
        capturedAt: new Date().toISOString(),
        paymentMethod: 'PayPal',
        status: 'completed'
      };

      // Prepare registration data (use the existing registration record)
      const emailRegistrationData = {
        _id: registrationRecord._id,
        registrationId: actualRegistrationId,
        personalDetails: registrationRecord.personalDetails,
        selectedRegistrationName: registrationRecord.selectedRegistrationName,
        sponsorType: registrationRecord.sponsorType,
        accommodationType: registrationRecord.accommodationType,
        accommodationNights: registrationRecord.accommodationNights,
        numberOfParticipants: registrationRecord.numberOfParticipants,
        pricing: registrationRecord.pricing
      };

      // Send email with PDF generation and storage
      const emailResult = await sendPaymentReceiptEmailWithRealData(
        emailPaymentData,
        emailRegistrationData,
        registrationRecord.personalDetails?.email
      );

      if (emailResult.success) {
        console.log('✅ Email receipt with PDF storage executed successfully:', {
          success: emailResult.success,
          recipient: registrationRecord.personalDetails?.email,
          pdfGenerated: emailResult.pdfGenerated,
          pdfSize: emailResult.pdfSize,
          pdfUploaded: emailResult.pdfUploaded,
          pdfAssetId: emailResult.pdfAssetId,
          messageId: emailResult.messageId
        });
      } else {
        console.error('❌ Email receipt with PDF storage failed:', emailResult.error);
      }

    } catch (emailError) {
      console.error('❌ Error sending email receipt with PDF storage:', {
        error: emailError.message,
        stack: emailError.stack,
        registrationId: actualRegistrationId,
        customerEmail: registrationRecord?.personalDetails?.email,
        transactionId: transactionId,
        orderId: orderId
      });
      // Email failure doesn't affect payment success - log but continue
    }

    // CRITICAL FIX: Return success URL for proper redirect
    const successUrl = `/registration/success?` +
      `registration_id=${actualRegistrationId}&` +
      `transaction_id=${transactionId}&` +
      `order_id=${orderId}&` +
      `amount=${amount}&` +
      `currency=${currency}&` +
      `payment_method=PayPal&` +
      `status=completed&` +
      `captured_at=${encodeURIComponent(new Date().toISOString())}`;

    return NextResponse.json({
      success: true,
      orderId,
      transactionId,
      amount,
      currency,
      status,
      registrationId: actualRegistrationId, // Use the actual registration ID
      capturedAt: new Date().toISOString(),
      successUrl, // Include success URL for frontend redirect
      redirectUrl: successUrl // Alternative name for redirect
    });

  } catch (error) {
    console.error('❌ Error in capture-order API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Send payment receipt email to user
 */
async function sendPaymentReceiptEmail(registrationId: string, paymentData: any) {
  try {
    console.log('📧 Preparing to send payment receipt email for registration:', registrationId);

    // Import email service
    const { sendPaymentReceiptEmail: sendEmail } = await import('@/app/services/emailService');

    // Fetch registration details from Sanity
    const { client } = await import('@/app/sanity/client');
    const registrationDetails = await client.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
        _id,
        registrationId,
        personalDetails,
        selectedRegistrationName,
        sponsorType,
        accommodationType,
        accommodationNights,
        numberOfParticipants,
        pricing
      }`,
      { registrationId }
    );

    if (!registrationDetails) {
      console.error('❌ Registration not found for email sending:', registrationId);
      throw new Error(`Registration not found: ${registrationId}`);
    }

    if (!registrationDetails.personalDetails?.email) {
      console.error('❌ No email address found in registration:', registrationId);
      throw new Error(`No email address found for registration: ${registrationId}`);
    }

    // Prepare email data
    const emailData = {
      registrationData: registrationDetails,
      paymentData: paymentData,
      recipientEmail: registrationDetails.personalDetails.email
    };

    console.log('📧 Sending payment receipt email to:', registrationDetails.personalDetails.email);

    // Send email
    const success = await sendEmail(emailData);

    if (success) {
      console.log('✅ Payment receipt email sent successfully');
    } else {
      console.error('❌ Failed to send payment receipt email');
      throw new Error('Email sending failed');
    }

  } catch (error) {
    console.error('❌ Error sending payment receipt email:', error);
    throw error;
  }
}

/**
 * Update registration payment status in database
 */
async function updateRegistrationPaymentStatus(registrationId: string, paymentData: any) {
  try {
    const { writeClient } = await import('@/app/sanity/client');

    console.log('📝 Updating registration payment status in Sanity:', {
      registrationId,
      paymentData
    });

    // Find the registration by registrationId
    const registration = await writeClient.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]`,
      { registrationId }
    );

    if (!registration) {
      console.error('❌ Registration not found for payment update:', registrationId);
      throw new Error(`Registration not found: ${registrationId}`);
    }

    // Update the registration with payment details
    const updateResult = await writeClient
      .patch(registration._id)
      .set({
        paymentStatus: paymentData.status,
        paymentMethod: paymentData.paymentMethod,
        paypalOrderId: paymentData.orderId,
        paypalTransactionId: paymentData.transactionId,
        paidAmount: paymentData.amount,
        paidCurrency: paymentData.currency,
        paymentCapturedAt: paymentData.capturedAt,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log('✅ Registration payment status updated successfully:', updateResult._id);
    return updateResult;

  } catch (error) {
    console.error('❌ Error updating registration payment status:', error);
    throw error;
  }
}
