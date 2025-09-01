/**
 * UNIFIED POST-PAYMENT PROCESSING SYSTEM
 * Comprehensive PDF receipt generation, email delivery, and Sanity backend integration
 * for both PayPal and Razorpay payment methods with complete feature parity
 */

import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * UNIFIED PAYMENT DATA STRUCTURE
 * Standardizes payment data from both PayPal and Razorpay
 */
function normalizePaymentData(paymentData, paymentMethod) {
  const normalized = {
    paymentMethod: paymentMethod.toLowerCase(),
    transactionId: null,
    orderId: null,
    amount: 0,
    currency: 'USD',
    capturedAt: new Date().toISOString(),
    status: 'completed',
    rawData: paymentData
  };

  if (paymentMethod.toLowerCase() === 'paypal') {
    normalized.transactionId = paymentData.paypalTransactionId || paymentData.transactionId;
    normalized.orderId = paymentData.paypalOrderId || paymentData.orderId;
    normalized.amount = parseFloat(paymentData.amount || paymentData.paymentAmount || 0);
    normalized.currency = paymentData.currency || paymentData.paymentCurrency || 'USD';
    normalized.capturedAt = paymentData.capturedAt || paymentData.paymentCapturedAt || new Date().toISOString();
  } else if (paymentMethod.toLowerCase() === 'razorpay') {
    normalized.transactionId = paymentData.paymentId || paymentData.razorpay_payment_id;
    normalized.orderId = paymentData.paymentOrderId || paymentData.razorpay_order_id;
    normalized.amount = parseFloat(paymentData.amount || paymentData.paymentAmount || 0);
    normalized.currency = paymentData.currency || paymentData.paymentCurrency || 'INR';
    normalized.capturedAt = paymentData.capturedAt || paymentData.paymentCapturedAt || new Date().toISOString();
  }

  return normalized;
}

/**
 * UNIFIED PDF RECEIPT GENERATION
 * Creates professional PDF receipts with consistent formatting for both payment methods
 */
async function generateUnifiedReceiptPDF(paymentData, registrationData, footerLogo) {
  try {
    console.log('🎨 Generating unified PDF receipt...');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Colors and styling
    const primaryColor = [0, 48, 135]; // Blue
    const secondaryColor = [51, 149, 255]; // Light blue
    const textColor = [33, 37, 41]; // Dark gray
    
    let yPosition = 20;
    
    // Header with logo
    if (footerLogo?.asset?.url) {
      try {
        const logoResponse = await fetch(footerLogo.asset.url);
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoBase64 = Buffer.from(logoBuffer).toString('base64');
        
        doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', 20, yPosition, 60, 25);
        yPosition += 35;
      } catch (logoError) {
        console.warn('⚠️ Logo loading failed, continuing without logo');
        yPosition += 10;
      }
    }
    
    // Conference title
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('International Nursing Conference 2025', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Receipt details box
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.rect(20, yPosition, pageWidth - 40, 60);
    
    // Payment information
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    
    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    let boxY = yPosition + 10;
    
    // Left column
    doc.text('Transaction ID:', leftCol, boxY);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentData.transactionId || 'N/A', leftCol, boxY + 8);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', leftCol, boxY + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentData.paymentMethod.toUpperCase(), leftCol, boxY + 28);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Registration ID:', leftCol, boxY + 40);
    doc.setFont('helvetica', 'normal');
    doc.text(registrationData.registrationId || 'N/A', leftCol, boxY + 48);
    
    // Right column
    doc.setFont('helvetica', 'bold');
    doc.text('Amount Paid:', rightCol, boxY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text(`${paymentData.currency} ${paymentData.amount.toFixed(2)}`, rightCol, boxY + 8);
    
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Date:', rightCol, boxY + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(paymentData.capturedAt).toLocaleDateString(), rightCol, boxY + 28);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', rightCol, boxY + 40);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 128, 0); // Green
    doc.text('COMPLETED', rightCol, boxY + 48);
    
    yPosition += 80;
    
    // Participant information
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PARTICIPANT INFORMATION', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const participantInfo = [
      ['Name:', `${registrationData.personalDetails?.firstName || ''} ${registrationData.personalDetails?.lastName || ''}`.trim()],
      ['Email:', registrationData.personalDetails?.email || 'N/A'],
      ['Phone:', registrationData.personalDetails?.phoneNumber || 'N/A'],
      ['Country:', registrationData.personalDetails?.country || 'N/A'],
      ['Registration Type:', registrationData.registrationType || 'N/A'],
      ['Accommodation:', registrationData.accommodationType || 'None']
    ];
    
    participantInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, yPosition);
      yPosition += 10;
    });
    
    // Footer
    yPosition = pageHeight - 40;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for registering with International Nursing Conference 2025!', pageWidth / 2, yPosition, { align: 'center' });
    doc.text('For questions, contact: contactus@intelliglobalconferences.com', pageWidth / 2, yPosition + 8, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition + 16, { align: 'center' });
    
    console.log('✅ Unified PDF receipt generated successfully');
    return doc.output('arraybuffer');
    
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
}

/**
 * UNIFIED EMAIL DELIVERY SYSTEM
 * Sends professional emails with PDF attachments using consistent templates
 */
async function sendUnifiedReceiptEmail(paymentData, registrationData, recipientEmail) {
  try {
    console.log('📧 Sending unified receipt email...');
    
    // SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        servername: process.env.SMTP_HOST || 'smtp.hostinger.com',
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });
    
    // Fetch footer logo
    const footerLogo = await getFooterLogo();
    
    // Generate PDF
    const pdfBuffer = await generateUnifiedReceiptPDF(paymentData, registrationData, footerLogo);
    
    // Email content
    const participantName = `${registrationData.personalDetails?.firstName || ''} ${registrationData.personalDetails?.lastName || ''}`.trim();
    
    const mailOptions = {
      from: {
        name: 'International Nursing Conference 2025',
        address: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com'
      },
      to: recipientEmail,
      subject: `Payment Confirmation - Registration ${registrationData.registrationId}`,
      html: generateEmailTemplate(paymentData, registrationData, participantName),
      attachments: [
        {
          filename: `Payment_Receipt_${paymentData.transactionId}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        }
      ]
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Unified receipt email sent successfully');
    return {
      success: true,
      messageId: result.messageId,
      pdfGenerated: true,
      pdfSize: pdfBuffer.byteLength
    };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return {
      success: false,
      error: error.message,
      pdfGenerated: false
    };
  }
}

/**
 * Helper function to get footer logo from Sanity
 */
async function getFooterLogo() {
  try {
    const query = `*[_type == "siteSettings"][0] {
      logo {
        asset -> {
          url
        }
      }
    }`;
    
    const result = await sanityClient.fetch(query);
    return result?.logo;
  } catch (error) {
    console.warn('⚠️ Failed to fetch footer logo:', error);
    return null;
  }
}

/**
 * Generate professional email template
 */
function generateEmailTemplate(paymentData, registrationData, participantName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #003087; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Confirmation</h1>
          <p>International Nursing Conference 2025</p>
        </div>
        
        <div class="content">
          <p>Dear ${participantName || 'Participant'},</p>
          
          <p>Thank you for your payment! Your registration for the International Nursing Conference 2025 has been confirmed.</p>
          
          <div class="highlight">
            <h3>Payment Details:</h3>
            <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
            <p><strong>Amount:</strong> ${paymentData.currency} ${paymentData.amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${paymentData.paymentMethod.toUpperCase()}</p>
            <p><strong>Registration ID:</strong> ${registrationData.registrationId}</p>
            <p><strong>Status:</strong> COMPLETED</p>
          </div>
          
          <p>Please find your payment receipt attached to this email. Keep this receipt for your records.</p>
          
          <p>We look forward to seeing you at the conference!</p>
          
          <p>Best regards,<br>
          International Nursing Conference 2025 Team</p>
        </div>
        
        <div class="footer">
          <p>© 2025 International Nursing Conference 2025</p>
          <p>For questions, contact: contactus@intelliglobalconferences.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * UNIFIED SANITY BACKEND INTEGRATION
 * Handles PDF storage and registration updates for both payment methods
 */
async function uploadPDFToSanity(pdfBuffer, filename) {
  try {
    console.log(`📤 Uploading PDF to Sanity: ${filename}`);

    if (!process.env.SANITY_API_TOKEN) {
      console.warn('⚠️ SANITY_API_TOKEN not found, cannot upload PDF');
      return null;
    }

    const asset = await sanityClient.assets.upload('file', pdfBuffer, {
      filename: filename,
      contentType: 'application/pdf'
    });

    console.log(`✅ PDF uploaded to Sanity successfully: ${asset._id}`);
    return asset;

  } catch (error) {
    console.error('❌ Failed to upload PDF to Sanity:', error.message);
    return null;
  }
}

async function updateRegistrationWithPDF(registrationId, pdfAsset) {
  try {
    console.log(`🔄 Updating registration ${registrationId} with PDF asset`);

    const updateResult = await sanityClient
      .patch(registrationId)
      .set({
        pdfReceipt: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: pdfAsset._id
          }
        },
        'registrationTable.pdfReceiptFile': {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: pdfAsset._id
          }
        }
      })
      .commit();

    console.log(`✅ Registration updated with PDF: ${updateResult._id}`);
    return true;

  } catch (error) {
    console.error('❌ Failed to update registration with PDF:', error);
    return false;
  }
}

/**
 * MAIN UNIFIED POST-PAYMENT PROCESSING FUNCTION
 * Handles complete post-payment flow for both PayPal and Razorpay
 */
async function processPaymentCompletion(paymentData, registrationData, paymentMethod, customerEmail) {
  try {
    console.log(`🚀 Starting unified post-payment processing for ${paymentMethod}...`);

    // Step 1: Normalize payment data
    const normalizedPayment = normalizePaymentData(paymentData, paymentMethod);
    console.log('✅ Payment data normalized');

    // Step 2: Send email with PDF receipt
    const emailResult = await sendUnifiedReceiptEmail(normalizedPayment, registrationData, customerEmail);

    if (!emailResult.success) {
      console.error('❌ Email sending failed:', emailResult.error);
      return {
        success: false,
        error: 'Email delivery failed',
        details: emailResult.error
      };
    }

    console.log('✅ Email sent successfully');

    // Step 3: Upload PDF to Sanity (if email was successful)
    let pdfUploaded = false;
    let pdfAssetId = null;

    if (emailResult.pdfGenerated && registrationData._id) {
      try {
        const footerLogo = await getFooterLogo();
        const pdfBuffer = await generateUnifiedReceiptPDF(normalizedPayment, registrationData, footerLogo);

        const filename = `receipt_${registrationData.registrationId || registrationData._id}_${Date.now()}.pdf`;
        const pdfAsset = await uploadPDFToSanity(Buffer.from(pdfBuffer), filename);

        if (pdfAsset) {
          const updateSuccess = await updateRegistrationWithPDF(registrationData._id, pdfAsset);
          pdfUploaded = updateSuccess;
          pdfAssetId = pdfAsset._id;

          if (updateSuccess) {
            console.log(`✅ PDF receipt stored in Sanity for registration: ${registrationData._id}`);
          }
        }
      } catch (pdfError) {
        console.error('❌ PDF upload failed:', pdfError);
      }
    }

    // Step 4: Update registration with completion status
    if (registrationData._id) {
      try {
        await sanityClient
          .patch(registrationData._id)
          .set({
            paymentStatus: 'completed', // CRITICAL: Ensure payment status remains completed
            receiptEmailSent: true,
            receiptEmailSentAt: new Date().toISOString(),
            receiptEmailRecipient: customerEmail,
            pdfReceiptGenerated: emailResult.pdfGenerated,
            pdfReceiptStoredInSanity: pdfUploaded,
            webhookProcessed: true,
            lastUpdated: new Date().toISOString(),
            // CRITICAL: Use same field names as email template and PDF receipt
            paymentCurrency: paymentData.currency,    // Same as paymentData.currency
            paymentAmount: paymentData.amount,        // Same as paymentData.amount
            transactionId: paymentData.transactionId, // Same as paymentData.transactionId
            status: 'completed',                      // Same as paymentData.status
            // Also update pricing for backward compatibility
            'pricing.currency': paymentData.currency,
            'pricing.totalPrice': paymentData.amount
          })
          .commit();

        console.log('✅ Registration updated with completion status');
      } catch (updateError) {
        console.error('❌ Failed to update registration status:', updateError);
      }
    }

    return {
      success: true,
      messageId: emailResult.messageId,
      pdfGenerated: emailResult.pdfGenerated,
      pdfUploaded: pdfUploaded,
      pdfAssetId: pdfAssetId,
      transactionId: normalizedPayment.transactionId,
      paymentMethod: paymentMethod
    };

  } catch (error) {
    console.error('❌ Unified post-payment processing failed:', error);
    return {
      success: false,
      error: error.message,
      paymentMethod: paymentMethod
    };
  }
}

export {
  normalizePaymentData,
  generateUnifiedReceiptPDF,
  sendUnifiedReceiptEmail,
  uploadPDFToSanity,
  updateRegistrationWithPDF,
  processPaymentCompletion
};
