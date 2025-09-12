/**
 * ENHANCED ADMIN REGISTRATIONS API
 * Provides comprehensive registration data with payment status, PDF receipts, and email delivery status
 */

import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching enhanced registrations data for admin panel...');
    
    // Fetch all registrations with comprehensive details
    const registrations = await client.fetch(`
      *[_type == "conferenceRegistration"] | order(registrationDate desc) {
        _id,
        registrationId,
        registrationType,
        
        // Personal Details
        personalDetails {
          title,
          firstName,
          lastName,
          email,
          phoneNumber,
          country,
          fullPostalAddress
        },
        
        // Registration Details
        selectedRegistrationName,
        sponsorType,
        accommodationType,
        accommodationNights,
        numberOfParticipants,
        
        // Pricing Information
        pricing {
          registrationFee,
          accommodationFee,
          totalPrice,
          currency,
          pricingPeriod
        },
        
        // Payment Information
        paymentStatus,
        paymentMethod,
        paypalTransactionId,
        paypalOrderId,
        paidAmount,
        paidCurrency,
        paymentCapturedAt,
        paymentCompletedAt,
        
        // Email and PDF Status
        receiptEmailSent,
        receiptEmailSentAt,
        receiptEmailRecipient,
        receiptEmailError,
        pdfReceiptGenerated,
        pdfReceiptSize,
        
        // Workflow Status
        workflowStatus,
        workflowCompletedAt,
        webhookProcessed,
        
        // Timestamps
        registrationDate,
        lastUpdated,
        isActive
      }
    `);
    
    console.log(`✅ Fetched ${registrations.length} registrations`);
    
    // Process and enhance the data
    const enhancedRegistrations = registrations.map(reg => {
      const personalDetails = reg.personalDetails || {};
      const pricing = reg.pricing || {};
      
      return {
        // Basic Information
        id: reg._id,
        registrationId: reg.registrationId,
        registrationType: reg.registrationType || 'regular',
        
        // Client Information
        clientName: `${personalDetails.title || ''} ${personalDetails.firstName || ''} ${personalDetails.lastName || ''}`.trim() || 'N/A',
        email: personalDetails.email || 'N/A',
        phone: personalDetails.phoneNumber || 'N/A',
        country: personalDetails.country || 'N/A',
        address: personalDetails.fullPostalAddress || 'N/A',
        
        // Registration Details
        registrationName: reg.selectedRegistrationName || reg.sponsorType || 'N/A',
        accommodation: reg.accommodationType ? 
          `${reg.accommodationType} (${reg.accommodationNights || 0} nights)` : 'None',
        participants: reg.numberOfParticipants || 1,
        
        // Financial Information
        registrationFee: pricing.registrationFee || 0,
        accommodationFee: pricing.accommodationFee || 0,
        totalAmount: pricing.totalPrice || 0,
        currency: pricing.currency || 'USD',
        pricingPeriod: pricing.pricingPeriod || 'unknown',
        
        // Payment Status
        paymentStatus: reg.paymentStatus || 'pending',
        paymentMethod: reg.paymentMethod || 'N/A',
        transactionId: reg.paypalTransactionId || 'N/A',
        orderId: reg.paypalOrderId || 'N/A',
        paidAmount: reg.paidAmount || 0,
        paidCurrency: reg.paidCurrency || 'USD',
        paymentDate: reg.paymentCompletedAt || reg.paymentCapturedAt || 'N/A',
        
        // Email and PDF Status
        emailStatus: reg.receiptEmailSent ? 'Sent' : (reg.receiptEmailError ? 'Failed' : 'Pending'),
        emailSentAt: reg.receiptEmailSentAt || 'N/A',
        emailRecipient: reg.receiptEmailRecipient || personalDetails.email || 'N/A',
        emailError: reg.receiptEmailError || null,
        
        pdfStatus: reg.pdfReceiptGenerated ? 'Generated' : 'Pending',
        pdfSize: reg.pdfReceiptSize || 0,
        
        // Workflow Status
        workflowStatus: reg.workflowStatus || 'pending',
        workflowCompleted: reg.workflowCompletedAt || 'N/A',
        webhookProcessed: reg.webhookProcessed || false,
        
        // Timestamps
        registrationDate: reg.registrationDate || 'N/A',
        lastUpdated: reg.lastUpdated || 'N/A',
        isActive: reg.isActive !== false,
        
        // Status Summary
        overallStatus: getOverallStatus(reg),
        statusColor: getStatusColor(reg)
      };
    });
    
    // Generate summary statistics
    const summary = {
      total: enhancedRegistrations.length,
      completed: enhancedRegistrations.filter(r => r.paymentStatus === 'completed').length,
      pending: enhancedRegistrations.filter(r => r.paymentStatus === 'pending').length,
      failed: enhancedRegistrations.filter(r => r.paymentStatus === 'failed').length,
      emailsSent: enhancedRegistrations.filter(r => r.emailStatus === 'Sent').length,
      emailsFailed: enhancedRegistrations.filter(r => r.emailStatus === 'Failed').length,
      pdfsGenerated: enhancedRegistrations.filter(r => r.pdfStatus === 'Generated').length,
      totalRevenue: enhancedRegistrations
        .filter(r => r.paymentStatus === 'completed')
        .reduce((sum, r) => sum + (r.paidAmount || r.totalAmount), 0),
      averageAmount: enhancedRegistrations.length > 0 ? 
        enhancedRegistrations.reduce((sum, r) => sum + (r.totalAmount || 0), 0) / enhancedRegistrations.length : 0
    };
    
    console.log('📊 Registration summary:', summary);
    
    return NextResponse.json({
      success: true,
      data: enhancedRegistrations,
      summary,
      timestamp: new Date().toISOString(),
      count: enhancedRegistrations.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching enhanced registrations:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch registrations',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Determine overall status based on payment, email, and PDF status
 */
function getOverallStatus(registration: any): string {
  if (registration.paymentStatus === 'completed' && 
      registration.receiptEmailSent && 
      registration.pdfReceiptGenerated &&
      registration.workflowStatus === 'completed') {
    return 'Complete';
  } else if (registration.paymentStatus === 'completed') {
    return 'Payment Complete';
  } else if (registration.paymentStatus === 'pending') {
    return 'Payment Pending';
  } else if (registration.paymentStatus === 'failed') {
    return 'Payment Failed';
  } else {
    return 'Unknown';
  }
}

/**
 * Get status color for UI display
 */
function getStatusColor(registration: any): string {
  const status = getOverallStatus(registration);
  
  switch (status) {
    case 'Complete':
      return 'green';
    case 'Payment Complete':
      return 'blue';
    case 'Payment Pending':
      return 'yellow';
    case 'Payment Failed':
      return 'red';
    default:
      return 'gray';
  }
}
