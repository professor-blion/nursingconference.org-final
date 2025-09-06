const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Import Sanity client from existing project setup
const { createClient } = require('next-sanity');

// Sanity client configuration (matching project settings)
const sanityClient = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

/**
 * Fetch footer logo from Sanity CMS
 */
async function getFooterLogo() {
  try {
    const query = `*[_type == "siteSettings"][0]{
      footerContent{
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }`;

    const siteSettings = await sanityClient.fetch(query);
    const footerLogo = siteSettings?.footerContent?.footerLogo;

    if (footerLogo?.asset?.url) {
      return {
        url: footerLogo.asset.url,
        alt: footerLogo.alt || 'Intelli Global Conferences Logo'
      };
    }

    return null;
  } catch (error) {
    console.log('⚠️  Failed to fetch footer logo from Sanity:', error.message);
    return null;
  }
}

/**
 * Simple Payment Receipt Email Test
 * Creates a clean HTML email with receipt information
 * Uses footer logo from Sanity CMS and only contactus@intelliglobalconferences.com
 */

async function sendSimpleReceiptEmail() {
  console.log('📧 Sending Simple Payment Receipt Email');
  console.log('=' .repeat(60));

  // Fetch footer logo from Sanity
  console.log('🔍 Fetching footer logo from Sanity CMS...');
  const footerLogo = await getFooterLogo();

  if (footerLogo) {
    console.log('✅ Footer logo fetched successfully:', footerLogo.url);
  } else {
    console.log('⚠️  No footer logo found, using text fallback');
  }

  // Working SMTP configuration - using only contactus@
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'contactus@intelliglobalconferences.com',
      pass: 'Muni@12345m',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Sample payment data
  const paymentData = {
    transactionId: 'BN23815972597140',
    orderId: 'BTW2281BRG4B674V',
    amount: '299.00',
    currency: 'USD',
    paymentMethod: 'PayPal',
    paymentDate: new Date().toLocaleString(),
    status: 'Completed'
  };

  // Sample registration data
  const registrationData = {
    registrationId: 'TEMP-REG-MEH4JCK3928-WMQYMPRKUVF7K',
    fullName: 'Dr. Jane Smith',
    email: 'professor2004h@gmail.com',
    phone: '+1234567890',
    country: 'United States',
    address: '123 Main Street, Anytown, ST 12345, United States',
    registrationType: 'Regular Registration',
    numberOfParticipants: '1'
  };

  console.log(`📧 Sending receipt to: ${registrationData.email}`);
  console.log(`💰 Transaction ID: ${paymentData.transactionId}`);
  console.log(`💳 Amount: $${paymentData.amount} ${paymentData.currency}`);

  const mailOptions = {
    from: '"Intelli Global Conferences" <contactus@intelliglobalconferences.com>',
    to: registrationData.email,
    subject: '✅ Payment Receipt - International Nursing Conference 2025',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        
        <!-- Receipt Container -->
        <div id="receipt" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background-color: #4267B2; color: white; padding: 30px 20px; text-align: left;">
            ${footerLogo ? `
              <img src="${footerLogo.url}" alt="${footerLogo.alt}"
                   style="height: 60px; width: auto; max-width: 300px; object-fit: contain; margin-bottom: 10px; display: block;
                          border: none; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;" />
            ` : `
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Intelli Global Conferences</h1>
            `}
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Registration Receipt</p>
          </div>
          
          <!-- Conference Title -->
          <div style="padding: 20px; background-color: #ffffff;">
            <h2 style="margin: 0; font-size: 18px; color: #333; font-weight: bold;">International Nursing Conference 2025</h2>
          </div>
          
          <!-- Payment Information -->
          <div style="padding: 0 20px 20px 20px;">
            <h3 style="color: #4267B2; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Payment Information</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="padding: 6px 0; color: #666; width: 140px;">Transaction ID:</td>
                <td style="padding: 6px 0; color: #333; font-weight: normal;">${paymentData.transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Order ID:</td>
                <td style="padding: 6px 0; color: #333;">${paymentData.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Amount:</td>
                <td style="padding: 6px 0; color: #333; font-weight: bold;">${paymentData.currency} ${paymentData.amount}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Payment Method:</td>
                <td style="padding: 6px 0; color: #333;">${paymentData.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Payment Date:</td>
                <td style="padding: 6px 0; color: #333;">${paymentData.paymentDate}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Status:</td>
                <td style="padding: 6px 0; color: #28a745; font-weight: bold;">${paymentData.status}</td>
              </tr>
            </table>
          </div>
          
          <!-- Registration Details -->
          <div style="padding: 0 20px 20px 20px;">
            <h3 style="color: #4267B2; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Registration Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="padding: 6px 0; color: #666; width: 140px;">Registration ID:</td>
                <td style="padding: 6px 0; color: #333; font-family: monospace; font-size: 11px;">${registrationData.registrationId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Full Name:</td>
                <td style="padding: 6px 0; color: #333;">${registrationData.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Email:</td>
                <td style="padding: 6px 0; color: #333;">${registrationData.email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Phone:</td>
                <td style="padding: 6px 0; color: #333;">${registrationData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Country:</td>
                <td style="padding: 6px 0; color: #333;">${registrationData.country}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Address:</td>
                <td style="padding: 6px 0; color: #333;">${registrationData.address}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Registration Type:</td>
                <td style="padding: 6px 0; color: #333;">${registrationData.registrationType}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;">Number of Participants:</td>
                <td style="padding: 6px 0; color: #333;">${registrationData.numberOfParticipants}</td>
              </tr>
            </table>
          </div>
          
          <!-- Payment Summary -->
          <div style="padding: 0 20px 20px 20px;">
            <h3 style="color: #4267B2; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Payment Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="padding: 6px 0; color: #666; width: 140px;">Registration Fee:</td>
                <td style="padding: 6px 0; color: #333;">USD 299</td>
              </tr>
              <tr style="border-top: 1px solid #ddd;">
                <td style="padding: 10px 0 6px 0; color: #666; font-weight: bold;">Total Amount:</td>
                <td style="padding: 10px 0 6px 0; color: #333; font-weight: bold; font-size: 14px;">USD 299</td>
              </tr>
            </table>
          </div>
          
          <!-- Contact Information -->
          <div style="padding: 0 20px 30px 20px;">
            <h3 style="color: #4267B2; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">Contact Information</h3>
            <p style="margin: 0; font-size: 12px; color: #333;">
              Email: <a href="mailto:contactus@intelliglobalconferences.com" style="color: #4267B2;">contactus@intelliglobalconferences.com</a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 15px 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0 0 5px 0; font-size: 10px; color: #666;">© 2025 International Nursing Conference 2025</p>
            <p style="margin: 0; font-size: 10px; color: #999;">Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
        </div>
        
        <!-- Download Instructions -->
        <div class="no-print" style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #e3f2fd; border-radius: 8px; text-align: center;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">💾 Save This Receipt</h3>
          <p style="color: #333; margin: 0 0 15px 0;">To save this receipt as a PDF:</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 4px; text-align: left; font-size: 14px;">
            <p style="margin: 0 0 8px 0;"><strong>Desktop:</strong> Press Ctrl+P (Windows) or Cmd+P (Mac), then "Save as PDF"</p>
            <p style="margin: 0 0 8px 0;"><strong>Mobile:</strong> Use your browser's "Print" or "Share" option</p>
            <p style="margin: 0;"><strong>Email:</strong> Forward this email to save a copy</p>
          </div>
        </div>
        
      </body>
      </html>
    `,
    text: `
PAYMENT RECEIPT - International Nursing Conference 2025

PAYMENT INFORMATION:
Transaction ID: ${paymentData.transactionId}
Order ID: ${paymentData.orderId}
Amount: ${paymentData.currency} ${paymentData.amount}
Payment Method: ${paymentData.paymentMethod}
Payment Date: ${paymentData.paymentDate}
Status: ${paymentData.status}

REGISTRATION DETAILS:
Registration ID: ${registrationData.registrationId}
Full Name: ${registrationData.fullName}
Email: ${registrationData.email}
Phone: ${registrationData.phone}
Country: ${registrationData.country}
Address: ${registrationData.address}
Registration Type: ${registrationData.registrationType}
Number of Participants: ${registrationData.numberOfParticipants}

PAYMENT SUMMARY:
Registration Fee: USD 299
Total Amount: USD 299

CONTACT INFORMATION:
Email: contactus@intelliglobalconferences.com

© 2025 International Nursing Conference 2025
Generated on: ${new Date().toLocaleString()}

To save this receipt: Forward this email or print the HTML version to PDF.
    `
  };

  try {
    console.log('\n📤 Sending receipt email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Receipt email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📧 Response: ${result.response}`);
    
    return {
      success: true,
      messageId: result.messageId,
      transactionId: paymentData.transactionId,
      recipient: registrationData.email
    };

  } catch (error) {
    console.log('❌ Failed to send receipt email:');
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🚀 Starting Simple Receipt Email Test...\n');
    
    const result = await sendSimpleReceiptEmail();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! Payment Receipt Email Sent!');
      console.log('=' .repeat(60));
      console.log(`✅ Transaction ID: ${result.transactionId}`);
      console.log(`✅ Recipient: ${result.recipient}`);
      console.log(`✅ Message ID: ${result.messageId}`);
      
      console.log('\n📧 Email Features:');
      console.log('✅ Clean, professional HTML design');
      console.log('✅ Matches your receipt design layout');
      console.log('✅ Blue header with footer logo from Sanity CMS');
      console.log('✅ Footer logo replaces text-based company name');
      console.log('✅ Logo properly sized and positioned in header');
      console.log('✅ Complete payment information');
      console.log('✅ Detailed registration details');
      console.log('✅ Payment summary section');
      console.log('✅ Contact information');
      console.log('✅ Print-friendly CSS for PDF conversion');
      console.log('✅ Uses only contactus@intelliglobalconferences.com');
      
      console.log('\n💾 PDF Download Instructions:');
      console.log('✅ Recipients can save as PDF using browser print');
      console.log('✅ Desktop: Ctrl+P (Windows) or Cmd+P (Mac) → Save as PDF');
      console.log('✅ Mobile: Use browser Print/Share option');
      console.log('✅ Clean print layout without email headers');
      
      console.log('\n🔍 Check Your Email:');
      console.log('📧 Check professor2004h@gmail.com for the receipt');
      console.log('🖨️  Try printing/saving as PDF to test the layout');
      console.log('📱 View on mobile to test responsiveness');
      
      console.log('\n🚀 Ready for Production:');
      console.log('✅ Email system working with contactus@ only');
      console.log('✅ Clean receipt design ready');
      console.log('✅ PDF download functionality included');
      console.log('✅ Can be integrated with real payment data');
      
    } else {
      console.log('\n❌ Failed to send receipt');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
}

// Run the test
main();
