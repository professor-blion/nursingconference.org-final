import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

/**
 * ALTERNATIVE PDF Receipt Generation API
 * Simplified endpoint for production compatibility
 * Fallback when primary PDF API fails
 */

interface ReceiptData {
  registrationId: string;
  transactionId?: string;
  orderId?: string;
  amount?: string;
  currency?: string;
  capturedAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Alternative PDF API called');
    const body: ReceiptData = await request.json();
    const { registrationId, transactionId, orderId, amount, currency, capturedAt } = body;

    console.log('📋 Alternative PDF Request:', {
      registrationId,
      transactionId,
      orderId,
      amount,
      currency,
      capturedAt
    });

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Try to fetch registration details from Sanity
    let registrationDetails;
    
    try {
      console.log('🔍 Fetching registration from Sanity...');
      registrationDetails = await client.fetch(
        `*[_type == "conferenceRegistration" && (registrationId == $registrationId || paypalOrderId == $registrationId)][0]{
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
          registrationDate,
          paypalOrderId,
          paypalTransactionId
        }`,
        { registrationId }
      );

      if (!registrationDetails) {
        console.warn('⚠️ Registration not found in Sanity, using fallback data');
        
        // Create fallback registration data from URL parameters
        registrationDetails = {
          _id: 'fallback-registration',
          registrationId: registrationId,
          personalDetails: {
            title: 'Dr.',
            firstName: 'Valued',
            lastName: 'Customer',
            email: 'customer@example.com',
            phoneNumber: 'N/A',
            country: 'N/A',
            fullPostalAddress: 'N/A'
          },
          selectedRegistrationName: 'Conference Registration',
          numberOfParticipants: 1,
          pricing: {
            registrationFee: parseFloat(amount || '0'),
            accommodationFee: 0,
            totalPrice: parseFloat(amount || '0'),
            currency: currency || 'USD'
          },
          paymentStatus: 'completed',
          registrationDate: capturedAt || new Date().toISOString()
        };
      }

      console.log('✅ Registration data prepared for PDF');

    } catch (sanityError) {
      console.error('❌ Sanity fetch failed, using fallback data:', sanityError);
      
      // Create fallback registration data
      registrationDetails = {
        _id: 'fallback-registration',
        registrationId: registrationId,
        personalDetails: {
          title: 'Dr.',
          firstName: 'Valued',
          lastName: 'Customer',
          email: 'customer@example.com',
          phoneNumber: 'N/A',
          country: 'N/A',
          fullPostalAddress: 'N/A'
        },
        selectedRegistrationName: 'Conference Registration',
        numberOfParticipants: 1,
        pricing: {
          registrationFee: parseFloat(amount || '0'),
          accommodationFee: 0,
          totalPrice: parseFloat(amount || '0'),
          currency: currency || 'USD'
        },
        paymentStatus: 'completed',
        registrationDate: capturedAt || new Date().toISOString()
      };
    }

    // Try to use the unified PDF generation system
    try {
      console.log('📄 Attempting PDF generation...');
      const { generateUnifiedReceiptPDF } = require('@/app/utils/paymentReceiptEmailer');

      // Prepare payment data
      const paymentData = {
        transactionId: transactionId || 'N/A',
        orderId: orderId || registrationId,
        amount: amount || registrationDetails.pricing?.totalPrice?.toString() || '0.00',
        currency: currency || registrationDetails.pricing?.currency || 'USD',
        paymentDate: capturedAt || registrationDetails.registrationDate || new Date().toISOString(),
        status: 'Completed',
        paymentMethod: 'PayPal'
      };

      // Prepare registration data
      const unifiedRegistrationData = {
        registrationId: registrationDetails.registrationId,
        _id: registrationDetails._id,
        fullName: registrationDetails.personalDetails?.firstName && registrationDetails.personalDetails?.lastName
          ? `${registrationDetails.personalDetails.firstName} ${registrationDetails.personalDetails.lastName}`
          : 'Valued Customer',
        email: registrationDetails.personalDetails?.email || 'customer@example.com',
        phoneNumber: registrationDetails.personalDetails?.phoneNumber || 'N/A',
        country: registrationDetails.personalDetails?.country || 'N/A',
        address: registrationDetails.personalDetails?.fullPostalAddress || 'N/A',
        registrationType: registrationDetails.selectedRegistrationName || 'Conference Registration',
        sponsorType: registrationDetails.sponsorType,
        accommodationType: registrationDetails.accommodationType,
        accommodationNights: registrationDetails.accommodationNights,
        numberOfParticipants: registrationDetails.numberOfParticipants || 1,
        registrationFee: registrationDetails.pricing?.registrationFee || parseFloat(amount || '0'),
        accommodationFee: registrationDetails.pricing?.accommodationFee || 0,
        totalAmount: registrationDetails.pricing?.totalPrice || parseFloat(amount || '0'),
        currency: registrationDetails.pricing?.currency || currency || 'USD',
        registrationDate: registrationDetails.registrationDate || new Date().toISOString()
      };

      console.log('🔧 Generating PDF with unified system...');
      const pdfBuffer = await generateUnifiedReceiptPDF(unifiedRegistrationData, paymentData);

      if (!pdfBuffer) {
        throw new Error('PDF generation returned null/undefined');
      }

      console.log('✅ Alternative PDF generated successfully:', {
        size: pdfBuffer.length,
        registrationId: registrationDetails.registrationId
      });

      // Return the PDF
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Receipt_${registrationId}.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });

    } catch (pdfError) {
      console.error('❌ PDF generation failed:', pdfError);
      
      return NextResponse.json(
        { 
          error: 'PDF generation failed',
          details: pdfError.message,
          registrationId,
          fallbackMessage: 'Please contact support for your receipt'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Alternative PDF API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Alternative PDF API failed',
        details: error.message,
        message: 'Please contact support at intelliglobalconferences@gmail.com'
      },
      { status: 500 }
    );
  }
}
