/**
 * UNIFIED POST-PAYMENT PROCESSING API
 * Handles complete post-payment processing for both PayPal and Razorpay
 * with PDF generation, email delivery, and Sanity backend integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { processPaymentCompletion } from '../../../utils/unifiedReceiptSystem.js';

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * POST /api/payment/process-completion
 * Unified endpoint for processing payment completion
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Unified post-payment processing API called');
    
    const body = await request.json();
    const { 
      registrationId, 
      paymentData, 
      paymentMethod, 
      customerEmail 
    } = body;
    
    // Validate required parameters
    if (!registrationId || !paymentData || !paymentMethod || !customerEmail) {
      console.error('❌ Missing required parameters');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters',
          required: ['registrationId', 'paymentData', 'paymentMethod', 'customerEmail']
        },
        { status: 400 }
      );
    }
    
    // Validate payment method
    const validPaymentMethods = ['paypal', 'razorpay'];
    if (!validPaymentMethods.includes(paymentMethod.toLowerCase())) {
      console.error('❌ Invalid payment method:', paymentMethod);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment method',
          validMethods: validPaymentMethods
        },
        { status: 400 }
      );
    }
    
    console.log(`📋 Processing ${paymentMethod} payment completion for registration: ${registrationId}`);
    
    // Fetch registration data from Sanity
    const registrationQuery = `*[_type == "conferenceRegistration" && registrationId == $registrationId][0] {
      _id,
      registrationId,
      personalDetails,
      registrationType,
      accommodationType,
      pricing,
      paymentStatus,
      paymentMethod,
      paymentId,
      paymentOrderId,
      paymentAmount,
      paymentCurrency,
      paymentDate,
      paypalTransactionId,
      paypalOrderId,
      razorpayPaymentData,
      receiptEmailSent,
      pdfReceiptGenerated,
      pdfReceiptStoredInSanity
    }`;
    
    const registrationData = await sanityClient.fetch(registrationQuery, { registrationId });
    
    if (!registrationData) {
      console.error('❌ Registration not found:', registrationId);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Registration not found',
          registrationId 
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Registration data fetched successfully');
    
    // Check if receipt has already been processed
    if (registrationData.receiptEmailSent && registrationData.pdfReceiptGenerated) {
      console.log('⚠️ Receipt already processed for this registration');
      return NextResponse.json({
        success: true,
        message: 'Receipt already processed',
        alreadyProcessed: true,
        registrationId,
        paymentMethod
      });
    }
    
    // Process payment completion using unified system
    const processingResult = await processPaymentCompletion(
      paymentData,
      registrationData,
      paymentMethod,
      customerEmail
    );
    
    if (!processingResult.success) {
      console.error('❌ Payment completion processing failed:', processingResult.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Payment completion processing failed',
          details: processingResult.error,
          registrationId,
          paymentMethod
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Payment completion processed successfully');
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment completion processed successfully',
      data: {
        registrationId,
        paymentMethod,
        transactionId: processingResult.transactionId,
        emailSent: true,
        messageId: processingResult.messageId,
        pdfGenerated: processingResult.pdfGenerated,
        pdfUploaded: processingResult.pdfUploaded,
        pdfAssetId: processingResult.pdfAssetId,
        processedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Unified post-payment processing API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/process-completion
 * Check processing status for a registration
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');
    
    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: 'Registration ID required' },
        { status: 400 }
      );
    }
    
    // Fetch processing status from Sanity
    const statusQuery = `*[_type == "conferenceRegistration" && registrationId == $registrationId][0] {
      registrationId,
      paymentStatus,
      paymentMethod,
      receiptEmailSent,
      receiptEmailSentAt,
      receiptEmailRecipient,
      pdfReceiptGenerated,
      pdfReceiptStoredInSanity,
      webhookProcessed,
      lastUpdated
    }`;
    
    const statusData = await sanityClient.fetch(statusQuery, { registrationId });
    
    if (!statusData) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      registrationId,
      status: {
        paymentCompleted: statusData.paymentStatus === 'completed',
        emailSent: statusData.receiptEmailSent || false,
        emailSentAt: statusData.receiptEmailSentAt,
        emailRecipient: statusData.receiptEmailRecipient,
        pdfGenerated: statusData.pdfReceiptGenerated || false,
        pdfStored: statusData.pdfReceiptStoredInSanity || false,
        webhookProcessed: statusData.webhookProcessed || false,
        paymentMethod: statusData.paymentMethod,
        lastUpdated: statusData.lastUpdated
      }
    });
    
  } catch (error) {
    console.error('❌ Status check error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/payment/process-completion
 * Retry processing for failed attempts
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, forceRetry = false } = body;
    
    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: 'Registration ID required' },
        { status: 400 }
      );
    }
    
    console.log(`🔄 Retrying post-payment processing for: ${registrationId}`);
    
    // Fetch registration data
    const registrationQuery = `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]`;
    const registrationData = await sanityClient.fetch(registrationQuery, { registrationId });
    
    if (!registrationData) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    // Check if retry is needed
    if (!forceRetry && registrationData.receiptEmailSent && registrationData.pdfReceiptGenerated) {
      return NextResponse.json({
        success: true,
        message: 'Processing already completed, use forceRetry=true to retry anyway',
        alreadyCompleted: true
      });
    }
    
    // Reconstruct payment data from registration
    const paymentData = {
      transactionId: registrationData.paypalTransactionId || registrationData.paymentId,
      orderId: registrationData.paypalOrderId || registrationData.paymentOrderId,
      amount: registrationData.paymentAmount || registrationData.pricing?.totalPrice,
      currency: registrationData.paymentCurrency || registrationData.pricing?.currency,
      capturedAt: registrationData.paymentDate || registrationData.paymentCapturedAt
    };
    
    const paymentMethod = registrationData.paymentMethod || 'paypal';
    const customerEmail = registrationData.personalDetails?.email;
    
    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Customer email not found in registration' },
        { status: 400 }
      );
    }
    
    // Retry processing
    const processingResult = await processPaymentCompletion(
      paymentData,
      registrationData,
      paymentMethod,
      customerEmail
    );
    
    return NextResponse.json({
      success: processingResult.success,
      message: processingResult.success ? 'Retry successful' : 'Retry failed',
      error: processingResult.error,
      data: processingResult.success ? {
        registrationId,
        paymentMethod,
        transactionId: processingResult.transactionId,
        emailSent: true,
        pdfGenerated: processingResult.pdfGenerated,
        pdfUploaded: processingResult.pdfUploaded,
        retriedAt: new Date().toISOString()
      } : null
    });
    
  } catch (error) {
    console.error('❌ Retry processing error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Retry failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
