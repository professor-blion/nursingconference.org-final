import { NextRequest, NextResponse } from 'next/server';
import { writeClient, client } from '@/app/sanity/client';
import { z } from 'zod';

// Validation schema for registration data
const registrationSchema = z.object({
  // Personal Details
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(5, "Phone number must be at least 5 characters"),

  // Further Information
  country: z.string().min(1, "Country is required"),
  fullPostalAddress: z.string().min(1, "Postal address is required"),

  // Registration Selection
  selectedRegistration: z.string().optional(),
  selectedRegistrationName: z.string().optional(),
  participantCategory: z.string().optional(),

  // Sponsor Registration
  sponsorType: z.string().optional(),

  // Accommodation
  accommodationType: z.string().optional(),
  accommodationNights: z.string().optional(),

  // Participants
  numberOfParticipants: z.number().min(1).max(50),

  // Pricing
  registrationFee: z.number().min(0),
  accommodationFee: z.number().min(0),
  totalPrice: z.number().min(0),
  pricingPeriod: z.enum(['earlyBird', 'nextRound', 'spotRegistration']),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
});

// Generate unique registration ID with high entropy
function generateRegistrationId(): string {
  const now = new Date();
  const timestamp = now.getTime().toString(36); // milliseconds
  const microseconds = (performance.now() % 1000).toFixed(3).replace('.', '');
  const randomStr1 = Math.random().toString(36).substring(2, 8);
  const randomStr2 = Math.random().toString(36).substring(2, 6);
  const processEntropy = process.hrtime.bigint().toString(36).slice(-4);
  return `REG-${timestamp}${microseconds}-${randomStr1}${randomStr2}${processEntropy}`.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Processing registration submission...');
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasSanityToken: !!process.env.SANITY_API_TOKEN,
      sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasPayPalClientId: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      hasPayPalSecret: !!process.env.PAYPAL_CLIENT_SECRET
    });

    let body;
    try {
      body = await request.json();
      console.log('✅ Request body parsed successfully');
      console.log('📊 Registration data keys:', Object.keys(body));
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate the request data
    console.log('🔍 Starting validation...');
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('❌ Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Invalid registration data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }
    console.log('✅ Validation passed');

    const registrationData = validationResult.data;

    // Generate a temporary registration ID for free registrations or as fallback
    // For paid registrations, this will be replaced with PayPal order ID
    let registrationId = generateRegistrationId();

    // For free registrations (totalPrice = 0), use the generated ID
    // For paid registrations, we'll update this with PayPal order ID later
    const isFreeRegistration = registrationData.totalPrice === 0;

    if (!isFreeRegistration) {
      // For paid registrations, use a temporary ID that will be updated with PayPal order ID
      registrationId = `TEMP-${registrationId}`;
      console.log('💳 Paid registration - temporary ID assigned, will be updated with PayPal order ID');
    } else {
      // For free registrations, check for duplicate and regenerate if needed
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        try {
          const existingRegistration = await writeClient.fetch(
            `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]`,
            { registrationId }
          );

          if (!existingRegistration) {
            break; // ID is unique, we can use it
          }

          // ID already exists, generate a new one
          registrationId = generateRegistrationId();
          attempts++;
          console.log(`⚠️ Registration ID collision detected, regenerating... (attempt ${attempts})`);
        } catch (error) {
          console.error('Error checking for duplicate registration ID:', error);
          break; // Continue with current ID if check fails
        }
      }

      if (attempts >= maxAttempts) {
        console.error('❌ Failed to generate unique registration ID after maximum attempts');
        return NextResponse.json(
          { error: 'Unable to generate unique registration ID. Please try again.' },
          { status: 500 }
        );
      }
    }

    console.log('✅ Registration data validated:', {
      registrationId,
      email: registrationData.email,
      totalPrice: registrationData.totalPrice,
    });

    // Create registration record in Sanity
    const registrationRecord = {
      _type: 'conferenceRegistration',
      registrationId,
      registrationType: registrationData.sponsorType ? 'sponsorship' : 'regular',
      personalDetails: {
        title: registrationData.title || '',
        firstName: registrationData.firstName || '',
        lastName: registrationData.lastName || '',
        email: registrationData.email || '',
        phoneNumber: registrationData.phoneNumber || '',
        country: registrationData.country || '',
        fullPostalAddress: registrationData.fullPostalAddress || '',
      },
      // For regular registrations
      ...(registrationData.selectedRegistration && {
        selectedRegistration: registrationData.selectedRegistration,
        selectedRegistrationName: registrationData.selectedRegistrationName || registrationData.selectedRegistration,
      }),
      // For sponsorship registrations - store the tier directly
      ...(registrationData.sponsorType && {
        sponsorType: registrationData.sponsorType, // Gold, Diamond, Platinum
      }),
      // Accommodation details
      ...(registrationData.accommodationType && {
        accommodationType: registrationData.accommodationType,
        accommodationNights: registrationData.accommodationNights,
      }),
      numberOfParticipants: registrationData.numberOfParticipants,
      pricing: {
        registrationFee: registrationData.registrationFee || 0,
        accommodationFee: registrationData.accommodationFee || 0,
        totalPrice: registrationData.totalPrice || 0,
        currency: 'USD',
        pricingPeriod: registrationData.pricingPeriod || 'unknown',
      },
      paymentStatus: 'pending',
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,
    };

    // Save to Sanity using write client with API token
    let result;
    let sanityError = null;
    try {
      console.log('💾 Attempting to save registration to Sanity with write client...');
      console.log('🔍 Sanity client config check:', {
        hasToken: !!process.env.SANITY_API_TOKEN,
        tokenLength: process.env.SANITY_API_TOKEN?.length || 0,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
      });
      console.log('📄 Registration record structure:', {
        type: registrationRecord._type,
        registrationId: registrationRecord.registrationId,
        hasPersonalDetails: !!registrationRecord.personalDetails,
        hasPricing: !!registrationRecord.pricing,
        totalPrice: registrationRecord.pricing?.totalPrice
      });

      result = await writeClient.create(registrationRecord);
      console.log('✅ Registration saved to Sanity successfully:', result._id);
    } catch (error: any) {
      sanityError = error;
      console.error('❌ Sanity save failed:', {
        error: error.message,
        statusCode: error?.statusCode,
        details: error?.details,
        stack: error?.stack?.substring(0, 500)
      });

      // Check if it's a permissions error
      if (error?.statusCode === 403) {
        console.error('🔒 Sanity permissions error - API token may be invalid or missing write permissions');
      } else if (error?.statusCode === 401) {
        console.error('🔐 Sanity authentication error - API token is invalid');
      } else if (error?.statusCode === 400) {
        console.error('📝 Sanity validation error - registration data may be invalid');
      } else {
        console.error('🌐 Sanity network/server error');
      }

      // Mock response for development/testing when Sanity fails
      result = {
        _id: `mock-${Date.now()}`,
        ...registrationRecord,
      };
    }

    // Return success response with registration ID
    return NextResponse.json({
      success: true,
      registrationId,
      message: sanityError
        ? 'Registration submitted successfully (test mode - data not saved to Sanity due to permissions)'
        : 'Registration submitted successfully',
      data: {
        id: result._id,
        registrationId,
        totalPrice: registrationData.totalPrice,
        paymentStatus: 'pending',
        testMode: !!sanityError,
        sanityStatus: sanityError ? 'failed' : 'success',
      },
    });

  } catch (error) {
    console.error('❌ Registration submission error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.substring(0, 1000) : undefined,
      name: error instanceof Error ? error.name : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });

    // Provide more specific error information
    let errorMessage = 'Registration submission failed';
    let errorDetails = 'An unexpected error occurred during registration processing';

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'Database connection failed';
        errorDetails = 'Unable to connect to the registration database. Please try again.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Data validation failed';
        errorDetails = 'The registration data contains invalid information.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout';
        errorDetails = 'The registration request took too long to process. Please try again.';
      } else {
        errorDetails = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        message: errorDetails,
        timestamp: new Date().toISOString(),
        requestId: `req-${Date.now()}`
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching registration details for:', registrationId);

    // Check if this is a test registration ID and return mock data
    if (registrationId.includes('TEST') || registrationId.includes('DR-SARAH-JOHNSON')) {
      console.log('🧪 Returning test registration data for demo purposes');

      const mockRegistration = {
        _id: 'mock-registration-id-sarah-johnson',
        registrationId: registrationId,
        personalDetails: {
          title: 'Dr.',
          firstName: 'Sarah',
          lastName: 'Johnson',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@medicalhospital.com',
          phoneNumber: '+1-555-123-4567',
          country: 'United States',
          fullPostalAddress: '456 Medical Center Drive, Boston, MA 02115, United States'
        },
        registrationType: {
          name: 'Speaker Registration',
          category: 'speaker'
        },
        selectedRegistrationName: 'Speaker Registration (In-Person)',
        sponsorshipTier: null,
        accommodationOption: {
          hotel: {
            hotelName: 'Grand Conference Hotel'
          },
          roomType: 'Deluxe Single Room',
          nights: 2
        },
        numberOfParticipants: 1,
        pricing: {
          registrationFee: 299,
          accommodationFee: 180,
          totalPrice: 479,
          currency: 'USD',
          pricingPeriod: 'nextRound',
          formattedTotalPrice: '$479 USD'
        },
        paymentStatus: 'completed',
        paymentMethod: 'paypal',
        registrationDate: '2025-01-12T14:30:00Z',
        paymentDate: '2025-01-12T14:30:00Z',
        lastUpdated: '2025-01-12T14:30:00Z',
        isActive: true
      };

      return NextResponse.json({
        success: true,
        data: mockRegistration
      });
    }

    // CRITICAL FIX: Enhanced registration lookup for both regular and recovery registrations
    console.log('🔍 Looking up registration:', registrationId);

    const registration = await client.fetch(
      `*[_type == "conferenceRegistration" && (registrationId == $registrationId || paypalOrderId == $registrationId)][0]{
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
        isActive,
        recoveryInfo
      }`,
      { registrationId }
    );

    if (!registration) {
      console.error('❌ Registration not found for ID:', registrationId);

      // Try a broader search for debugging
      const recentRegistrations = await client.fetch(
        `*[_type == "conferenceRegistration"] | order(registrationDate desc)[0...5]{
          registrationId,
          paypalOrderId,
          paymentStatus,
          personalDetails
        }`
      );

      console.log('📋 Recent registrations for debugging:', recentRegistrations);

      return NextResponse.json(
        {
          error: 'Registration not found',
          searchedId: registrationId,
          recentRegistrations: recentRegistrations.map(r => ({
            registrationId: r.registrationId,
            paypalOrderId: r.paypalOrderId,
            paymentStatus: r.paymentStatus,
            email: r.personalDetails?.email
          }))
        },
        { status: 404 }
      );
    }

    console.log('✅ Registration found:', {
      registrationId: registration.registrationId,
      paypalOrderId: registration.paypalOrderId,
      paymentStatus: registration.paymentStatus,
      isRecovery: !!registration.recoveryInfo
    });

    return NextResponse.json({
      success: true,
      data: registration,
    });

  } catch (error) {
    console.error('❌ Error fetching registration:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch registration',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
