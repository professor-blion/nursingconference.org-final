import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { generateInvoiceNumber } from '../../../getSponsorshipData';
import { sendInvoiceEmail, sendPaymentConfirmationEmail, sendSponsorshipNotification, type SponsorshipNotificationData } from '../../../lib/emailService';

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

// Razorpay test credentials
const _RAZORPAY_KEY_ID = 'rzp_test_tuQ7OPOieO2QPl';
const _RAZORPAY_KEY_SECRET = 'ilWNxeVD5Iqm8AVchC8yWbba';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, paymentId, amount, paymentMethod, gatewayResponse } = body;

    if (!registrationId || !paymentId || !amount) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Fetch the registration
    const registrationQuery = `*[_type == "sponsorRegistration" && registrationId == $registrationId][0] {
      _id,
      registrationId,
      conference -> {
        _id,
        title,
        date,
        location
      },
      sponsorshipTier -> {
        _id,
        name,
        price
      },
      customAmount,
      companyDetails,
      contactPerson,
      billingAddress,
      status
    }`;

    const registration = await client.fetch(registrationQuery, { registrationId });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Create payment transaction record
    const transactionData = {
      _type: 'paymentTransaction',
      transactionId: `TXN-${Date.now()}`,
      sponsorRegistration: {
        _type: 'reference',
        _ref: registration._id,
      },
      paymentGateway: 'razorpay', // All payments go through Razorpay for testing
      gatewayTransactionId: paymentId,
      amount: Number(amount),
      currency: 'USD',
      status: 'completed',
      paymentMethod: paymentMethod || 'credit_card',
      gatewayResponse: {
        rawResponse: JSON.stringify(gatewayResponse || {}),
      },
      initiatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      invoiceGenerated: true,
      invoiceNumber,
      emailSent: false,
    };

    // Update registration with payment details
    const paymentDetails = {
      paymentId,
      paymentMethod: 'razorpay',
      amount: Number(amount),
      currency: 'USD',
      paymentDate: new Date().toISOString(),
      invoiceNumber,
    };

    // Execute both operations
    const [transactionResult] = await Promise.all([
      client.create(transactionData),
      client
        .patch(registration._id)
        .set({
          status: 'confirmed',
          paymentDetails,
        })
        .commit(),
    ]);

    // Fetch site settings for email configuration
    const siteSettingsQuery = `*[_type == "siteSettings"][0] {
      logo {
        asset -> {
          url
        }
      },
      contactInfo,
      adminSettings
    }`;

    const siteSettings = await client.fetch(siteSettingsQuery);

    // Generate and send invoice
    const invoiceData = await generateInvoice(registration, paymentDetails);

    // Prepare sponsorship notification data
    const sponsorshipNotificationData: SponsorshipNotificationData = {
      registrationId: registration.registrationId,
      companyName: registration.companyDetails?.companyName || 'Unknown Company',
      contactPerson: registration.contactPerson?.name || 'Unknown Contact',
      email: registration.contactPerson?.email || 'unknown@example.com',
      phone: registration.contactPerson?.phone,
      website: registration.companyDetails?.website,
      companyAddress: registration.billingAddress ?
        `${registration.billingAddress.street}, ${registration.billingAddress.city}, ${registration.billingAddress.state || ''} ${registration.billingAddress.postalCode || ''}, ${registration.billingAddress.country}`.trim() :
        undefined,
      conferenceName: registration.conference?.title || 'Unknown Conference',
      tierName: registration.sponsorshipTier?.name || 'Custom Sponsorship',
      amount: Number(amount),
      paymentId: paymentId,
      paymentStatus: 'completed',
      specialRequests: registration.companyDetails?.specialRequests,
      marketingMaterials: registration.companyDetails?.marketingMaterials || false,
      logoPlacement: registration.companyDetails?.logoPlacement || false,
      speakingOpportunity: registration.companyDetails?.speakingOpportunity || false,
      submittedAt: new Date().toISOString(),
    };

    // Get admin email from site settings
    const adminEmail = siteSettings?.contactInfo?.email || 'intelliglobalconferences@gmail.com';

    // Send emails
    const [invoiceEmailSent, confirmationEmailSent, adminNotificationSent] = await Promise.all([
      sendInvoiceEmail(invoiceData, siteSettings),
      sendPaymentConfirmationEmail(registration, paymentDetails, siteSettings),
      sendSponsorshipNotification(sponsorshipNotificationData, adminEmail),
    ]);

    const emailSent = invoiceEmailSent && confirmationEmailSent;

    // Update transaction to mark email as sent
    if (emailSent) {
      await client
        .patch(transactionResult._id)
        .set({ emailSent: true })
        .commit();
    }

    return NextResponse.json({
      success: true,
      transactionId: transactionResult._id,
      invoiceNumber,
      emailSent,
      invoiceEmailSent,
      confirmationEmailSent,
      adminNotificationSent,
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Generate invoice data
async function generateInvoice(registration: any, paymentDetails: any) {
  const invoiceData = {
    invoiceNumber: paymentDetails.invoiceNumber,
    date: new Date().toISOString(),
    company: registration.companyDetails.companyName,
    contact: `${registration.contactPerson.firstName} ${registration.contactPerson.lastName}`,
    email: registration.contactPerson.email,
    conference: registration.conference.title,
    sponsorshipTier: registration.sponsorshipTier.name,
    amount: paymentDetails.amount,
    currency: paymentDetails.currency,
    paymentId: paymentDetails.paymentId,
    billingAddress: registration.billingAddress,
  };

  console.log('Generated invoice:', invoiceData);
  return invoiceData;
}

// Create Razorpay order (for future use)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD', registrationId } = body;

    // In a real implementation, you would create a Razorpay order here
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({
    //   key_id: RAZORPAY_KEY_ID,
    //   key_secret: RAZORPAY_KEY_SECRET,
    // });

    // const order = await razorpay.orders.create({
    //   amount: amount * 100, // Convert to paise
    //   currency,
    //   receipt: registrationId,
    // });

    // For now, return a mock order
    const mockOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency,
      receipt: registrationId,
      status: 'created',
    };

    return NextResponse.json({
      success: true,
      order: mockOrder,
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
