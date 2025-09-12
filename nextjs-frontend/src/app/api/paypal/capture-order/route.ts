import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReceiptEmail } from '@/app/services/emailService';
import { writeClient, client } from '@/app/sanity/client';

/**
 * ORPHANED PAYPAL ORDER RECOVERY SYSTEM
 * Creates fallback registrations for valid PayPal payments without corresponding registrations
 */
async function createFallbackRegistration(paypalOrderId: string, amount: string, currency: string, captureDetails: any) {
  try {
    console.log('🔧 Creating fallback registration for orphaned PayPal order:', {
      paypalOrderId,
      amount,
      currency,
      captureDetails: captureDetails ? 'Present' : 'Missing'
    });

    // Generate a recovery registration ID
    const recoveryRegistrationId = `RECOVERY-${paypalOrderId}`;

    // Extract payer information from PayPal capture details if available
    const payerInfo = captureDetails?.payer || {};
    const payerName = payerInfo.name || {};
    const payerEmail = payerInfo.email_address || 'recovery@example.com';

    // Create fallback registration document
    const fallbackRegistration = {
      _type: 'conferenceRegistration',
      registrationId: recoveryRegistrationId,
      paypalOrderId: paypalOrderId,
      personalDetails: {
        title: 'Dr.',
        firstName: payerName.given_name || 'Recovered',
        lastName: payerName.surname || 'Customer',
        email: payerEmail,
        phoneNumber: 'N/A - Recovered Order',
        country: 'Unknown',
        fullPostalAddress: 'N/A - Recovered from PayPal Order'
      },
      selectedRegistrationName: 'Conference Registration (Recovered)',
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
        recoveryReason: 'Orphaned PayPal order - registration not found'
      }
    };

    console.log('💾 Saving fallback registration to Sanity...');
    const result = await writeClient.create(fallbackRegistration);

    if (result) {
      console.log('✅ Fallback registration created successfully:', {
        _id: result._id,
        registrationId: recoveryRegistrationId,
        paypalOrderId: paypalOrderId,
        email: payerEmail
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

        // CRITICAL FIX: ORPHANED PAYPAL ORDER RECOVERY
        console.log('🚨 ORPHANED PAYPAL ORDER DETECTED - Attempting recovery...');

        // Create a fallback registration for this valid PayPal payment
        const fallbackRegistration = await createFallbackRegistration(orderId, amount, currency, captureDetails);

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

    // Trigger complete payment workflow (non-blocking) with FIXED base URL
    setImmediate(async () => {
      try {
        console.log('🚀 Triggering complete payment workflow for registration:', actualRegistrationId);

        // CRITICAL FIX: Use proper base URL for production
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_BASE_URL
          ? process.env.NEXT_PUBLIC_BASE_URL
          : 'http://localhost:3000';

        console.log('🌐 Using base URL for workflow:', baseUrl);

        const workflowResponse = await fetch(`${baseUrl}/api/payment/complete-workflow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationId: actualRegistrationId, // Use the actual registration ID
            paymentData: {
              transactionId: transactionId || capture?.id || 'N/A',
              orderId: orderId || result.id || 'N/A',
              amount: amount || capture?.amount?.value || '0',
              currency: currency || capture?.amount?.currency_code || 'USD',
              capturedAt: new Date().toISOString(),
              paymentMethod: 'PayPal'
            },
            customerEmail: registrationRecord?.personalDetails?.email,
            autoSendEmail: true
          }),
        });

        if (workflowResponse.ok) {
          const workflowResult = await workflowResponse.json();
          console.log('✅ Complete payment workflow executed successfully:', workflowResult.details);
        } else {
          const workflowError = await workflowResponse.json();
          console.error('❌ Payment workflow failed:', workflowError);
        }

      } catch (workflowError) {
        console.error('❌ Error triggering payment workflow:', workflowError);
        // Workflow failure doesn't affect payment success
      }
    });

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
