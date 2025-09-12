/**
 * COMPLETE END-TO-END PAYMENT WORKFLOW API
 * Handles the complete payment confirmation workflow after successful payment
 * Includes: Status update, PDF generation, email delivery, and Sanity storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeClient, client } from '@/app/sanity/client';
import { generateUnifiedReceiptPDF } from '../../../utils/paymentReceiptEmailer.js';

interface PaymentWorkflowRequest {
  registrationId: string;
  paymentData: {
    transactionId: string;
    orderId: string;
    amount: string;
    currency: string;
    capturedAt: string;
    paymentMethod: string;
  };
  customerEmail?: string;
  autoSendEmail?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Complete Payment Workflow API called');
    
    const body: PaymentWorkflowRequest = await request.json();
    const { registrationId, paymentData, customerEmail, autoSendEmail = true } = body;
    
    // Validate required parameters
    if (!registrationId || !paymentData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters',
          required: ['registrationId', 'paymentData']
        },
        { status: 400 }
      );
    }
    
    console.log('📋 Processing payment workflow for:', {
      registrationId,
      transactionId: paymentData.transactionId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      autoSendEmail
    });
    
    // Step 1: Fetch registration details from Sanity
    console.log('🔍 Step 1: Fetching registration details...');
    const registration = await client.fetch(
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
    
    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Registration found:', registration._id);
    
    // Step 2: Update registration with payment details
    console.log('💾 Step 2: Updating registration with payment details...');
    const updatedRegistration = await writeClient
      .patch(registration._id)
      .set({
        paymentStatus: 'completed',
        paymentMethod: paymentData.paymentMethod,
        paypalTransactionId: paymentData.transactionId,
        paypalOrderId: paymentData.orderId,
        paidAmount: parseFloat(paymentData.amount),
        paidCurrency: paymentData.currency,
        paymentCapturedAt: paymentData.capturedAt,
        paymentCompletedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        webhookProcessed: true
      })
      .commit();
    
    console.log('✅ Registration updated with payment details');
    
    // Step 3: Generate PDF receipt
    console.log('📄 Step 3: Generating PDF receipt...');
    let pdfBuffer = null;
    let pdfGenerated = false;
    let pdfSize = 0;
    
    try {
      pdfBuffer = await generateUnifiedReceiptPDF(
        paymentData,
        registration,
        paymentData.paymentMethod,
        customerEmail || registration.personalDetails?.email
      );
      
      if (pdfBuffer) {
        pdfGenerated = true;
        pdfSize = pdfBuffer.length;
        console.log(`✅ PDF generated successfully: ${pdfSize} bytes`);
      }
    } catch (pdfError) {
      console.error('❌ PDF generation failed:', pdfError);
    }
    
    // Step 4: Send email with PDF attachment (if enabled)
    let emailSent = false;
    let emailError = null;
    let messageId = null;
    
    if (autoSendEmail && pdfBuffer) {
      console.log('📧 Step 4: Sending email with PDF receipt...');
      
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email/send-receipt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationId,
            transactionId: paymentData.transactionId,
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            capturedAt: paymentData.capturedAt,
            testEmail: customerEmail // Use customer email if provided
          }),
        });
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          if (emailResult.success) {
            emailSent = true;
            messageId = emailResult.details?.messageId;
            console.log('✅ Email sent successfully:', messageId);
          } else {
            emailError = emailResult.error;
            console.error('❌ Email sending failed:', emailError);
          }
        } else {
          emailError = 'Email API request failed';
          console.error('❌ Email API request failed');
        }
      } catch (error) {
        emailError = error instanceof Error ? error.message : 'Unknown email error';
        console.error('❌ Email sending error:', error);
      }
    }
    
    // Step 5: Update registration with email and PDF status
    console.log('📊 Step 5: Updating registration with workflow results...');
    await writeClient
      .patch(registration._id)
      .set({
        receiptEmailSent: emailSent,
        receiptEmailSentAt: emailSent ? new Date().toISOString() : null,
        receiptEmailRecipient: customerEmail || registration.personalDetails?.email,
        receiptEmailError: emailError,
        pdfReceiptGenerated: pdfGenerated,
        pdfReceiptSize: pdfSize,
        workflowCompletedAt: new Date().toISOString(),
        workflowStatus: 'completed'
      })
      .commit();
    
    console.log('✅ Registration updated with workflow results');
    
    // Step 6: Prepare success response
    const workflowResult = {
      success: true,
      message: 'Payment workflow completed successfully',
      details: {
        registrationId,
        paymentStatus: 'completed',
        transactionId: paymentData.transactionId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        pdfGenerated,
        pdfSize,
        emailSent,
        emailRecipient: customerEmail || registration.personalDetails?.email,
        messageId,
        workflowCompletedAt: new Date().toISOString(),
        registrationUpdated: true,
        sanityRecordId: registration._id
      }
    };
    
    console.log('🎉 Payment workflow completed successfully:', workflowResult.details);
    
    return NextResponse.json(workflowResult);
    
  } catch (error) {
    console.error('❌ Payment workflow error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Payment workflow failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
