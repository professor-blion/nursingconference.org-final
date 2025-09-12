import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal Create Order API Route - Production Version
 * Creates a PayPal order for live payments using production credentials
 */

interface CreateOrderRequest {
  amount: string;
  currency: string;
  registrationId: string;
  registrationData: any;
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
      console.error('❌ Missing PayPal production credentials:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        clientIdSource: process.env.PAYPAL_CLIENT_ID ? 'PAYPAL_CLIENT_ID' : 'NEXT_PUBLIC_PAYPAL_CLIENT_ID'
      });
      return null;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('🔐 Requesting PayPal production access token...');
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

    console.log('✅ PayPal production access token obtained successfully');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal production access token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Creating PayPal production order...');

    const body: CreateOrderRequest = await request.json();
    const { amount, currency = 'USD', registrationId, registrationData } = body;

    // Validate request data
    if (!amount || !currency || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, registrationId' },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error('❌ Invalid payment amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    // Validate currency support for PayPal (PayPal does not support INR)
    const supportedCurrencies = ['USD', 'EUR', 'GBP'];
    if (!supportedCurrencies.includes(currency.toUpperCase())) {
      console.error(`❌ Unsupported currency for PayPal: ${currency}`);
      return NextResponse.json(
        {
          error: `Currency ${currency} is not supported by PayPal. Supported currencies: ${supportedCurrencies.join(', ')}`,
          note: currency.toUpperCase() === 'INR' ? 'For INR payments, please use Razorpay payment option.' : undefined
        },
        { status: 400 }
      );
    }

    // CRITICAL FIX: PREVENT ORPHANED ORDERS - Validate registration exists
    console.log('🔍 Validating registration exists before creating PayPal order...');

    try {
      // Import Sanity client for registration validation
      const { client } = require('@/app/sanity/client');

      const existingRegistration = await client.fetch(
        `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
          _id,
          registrationId,
          paymentStatus
        }`,
        { registrationId }
      );

      if (!existingRegistration) {
        console.error('❌ Registration validation failed - no registration found:', registrationId);
        return NextResponse.json(
          {
            error: 'Registration not found',
            message: 'Please complete the registration form before proceeding to payment',
            registrationId,
            action: 'Please go back and complete the registration form first'
          },
          { status: 404 }
        );
      }

      console.log('✅ Registration validation passed:', {
        registrationId: existingRegistration.registrationId,
        paymentStatus: existingRegistration.paymentStatus
      });

    } catch (validationError) {
      console.error('❌ Registration validation error:', validationError);
      // Continue with order creation as fallback, but log the issue
      console.warn('⚠️ Continuing with PayPal order creation despite validation error');
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal' },
        { status: 500 }
      );
    }

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: registrationId,
          amount: {
            currency_code: currency,
            value: amount,
          },
          description: `Conference Registration - ID: ${registrationId}`,
          custom_id: registrationId,
        },
      ],
      application_context: {
        brand_name: 'Nursing Conferences',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/registration/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/registration`,
      },
    };

    console.log('📦 Creating PayPal order with data:', {
      amount,
      currency,
      registrationId,
      intent: 'CAPTURE'
    });

    const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `${registrationId}-${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal order creation failed:', result);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: result },
        { status: response.status }
      );
    }

    const paypalOrderId = result.id;
    console.log('✅ PayPal production order created successfully:', {
      orderId: paypalOrderId,
      status: result.status,
      originalRegistrationId: registrationId
    });

    // Update registration with PayPal order ID if it's a temporary ID
    if (registrationId.startsWith('TEMP-')) {
      try {
        console.log('🔄 Updating registration with PayPal order ID...');
        const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/registration/update-paypal-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tempRegistrationId: registrationId,
            paypalOrderId: paypalOrderId,
            paymentStatus: 'pending'
          }),
        });

        if (updateResponse.ok) {
          console.log('✅ Registration updated with PayPal order ID');
        } else {
          console.error('⚠️ Failed to update registration with PayPal order ID, but continuing...');
        }
      } catch (error) {
        console.error('⚠️ Error updating registration with PayPal order ID:', error);
        // Continue anyway - the payment can still proceed
      }
    }

    return NextResponse.json({
      success: true,
      orderId: paypalOrderId,
      status: result.status,
      registrationId: paypalOrderId, // Return PayPal order ID as the new registration ID
      originalRegistrationId: registrationId, // Keep track of original temp ID
      links: result.links,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in create-order API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


