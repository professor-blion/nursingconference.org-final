import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

/**
 * UNIFIED Registration Receipt PDF Generation
 * Uses the same PDF generation function as email receipts for consistency
 * Ensures identical layout, formatting, and content across all methods
 */

interface ReceiptData {
  registrationId: string;
  transactionId?: string;
  orderId?: string;
  amount?: string;
  currency?: string;
  capturedAt?: string;
  registrationDetails?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReceiptData = await request.json();
    const { registrationId, transactionId, orderId, amount, currency, capturedAt } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Check if this is a test registration ID and return mock data
    let registrationDetails;

    if (registrationId.includes('TEST') || registrationId.includes('DR-SARAH-JOHNSON')) {
      console.log('🧪 Using test registration data for PDF generation');

      registrationDetails = {
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
        selectedRegistrationName: 'Speaker Registration (In-Person)',
        sponsorType: null,
        accommodationType: 'Deluxe Single Room',
        accommodationNights: '2',
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
        registrationDate: '2025-01-12T14:30:00Z'
      };
    } else {
      // Fetch registration details from Sanity for real registrations
      registrationDetails = await client.fetch(
        `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
          _id,
          registrationId,
          personalDetails,
          selectedRegistrationName,
          sponsorType,
          accommodationType,
          accommodationNights,
          numberOfParticipants,
          pricing,
          paymentStatus,
          registrationDate
        }`,
        { registrationId }
      );

      if (!registrationDetails) {
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }
    }

    // Use the UNIFIED PDF generation system for consistency
    const { generateUnifiedReceiptPDF } = require('@/app/utils/paymentReceiptEmailer');

    // Prepare payment data
    const paymentData = {
      transactionId: transactionId || 'N/A',
      orderId: orderId || 'N/A',
      amount: amount || registrationDetails.pricing?.totalPrice || '0.00',
      currency: currency || registrationDetails.pricing?.currency || 'USD',
      paymentDate: capturedAt || registrationDetails.registrationDate || new Date().toISOString(),
      status: 'Completed',
      paymentMethod: 'PayPal'
    };

    // Prepare registration data in the format expected by the unified system
    const unifiedRegistrationData = {
      registrationId: registrationDetails.registrationId,
      _id: registrationDetails._id,
      fullName: registrationDetails.personalDetails?.firstName && registrationDetails.personalDetails?.lastName
        ? `${registrationDetails.personalDetails.firstName} ${registrationDetails.personalDetails.lastName}`
        : 'N/A',
      email: registrationDetails.personalDetails?.email || 'N/A',
      phoneNumber: registrationDetails.personalDetails?.phoneNumber || 'N/A',
      country: registrationDetails.personalDetails?.country || 'N/A',
      address: registrationDetails.personalDetails?.fullPostalAddress || 'N/A',
      registrationType: registrationDetails.selectedRegistrationName || 'Regular Registration',
      sponsorType: registrationDetails.sponsorType,
      accommodationType: registrationDetails.accommodationType,
      accommodationNights: registrationDetails.accommodationNights,
      numberOfParticipants: registrationDetails.numberOfParticipants || 1,
      pricing: registrationDetails.pricing
    };

    // Generate PDF using the UNIFIED system (same as email receipts)
    const pdfBuffer = await generateUnifiedReceiptPDF(paymentData, unifiedRegistrationData);

    // Return the unified PDF directly - no additional processing needed
    // This ensures 100% consistency with email receipts

    // Return the unified PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Registration_Receipt_${registrationId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error generating registration receipt PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate receipt PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
