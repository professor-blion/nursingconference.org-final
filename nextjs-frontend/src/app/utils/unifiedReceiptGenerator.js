const nodemailer = require('nodemailer');
const { createClient } = require('next-sanity');

// Import jsPDF for PDF generation
let jsPDF;
try {
  jsPDF = require('jspdf').jsPDF;
} catch (error) {
  console.warn('jsPDF not available for PDF generation:', error.message);
}

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * UNIFIED BLUE HEADER PDF GENERATION
 * This is the ONLY PDF template that should be used for client receipts
 */
async function generateBlueHeaderReceiptPDF(paymentData, registrationData, receiptSettings = null) {
  if (!jsPDF) {
    throw new Error('jsPDF not available for PDF generation');
  }

  // Fetch receipt settings if not provided
  if (!receiptSettings) {
    receiptSettings = await getReceiptSettings();
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Layout constants for single-page design
  const LAYOUT = {
    margins: { left: 20, right: 20, top: 15, bottom: 20 },
    spacing: { sectionGap: 12, lineHeight: 8, headerGap: 10, fieldGap: 6 },
    header: { height: 35, titleY: 25, subtitleY: 40 } // Reduced height from 50 to 35
  };

  // Blue header colors (matching the correct template)
  const headerColor = receiptSettings.receiptTemplate?.headerColor?.hex || '#4267B2';
  const headerRGB = hexToRgb(headerColor);

  const colors = {
    headerBg: headerRGB,
    headerText: [255, 255, 255],
    sectionHeader: headerRGB,
    labelText: [102, 102, 102],
    valueText: [51, 51, 51],
    footerText: [102, 102, 102]
  };

  // BLUE GRADIENT HEADER SECTION - Matching reference design
  // Create blue gradient background (dark blue to lighter blue)
  const gradientSteps = 50;
  const darkBlue = [15, 23, 42];   // #0f172a - Dark navy
  const lightBlue = [30, 58, 138]; // #1e3a8a - Lighter navy

  for (let i = 0; i < LAYOUT.header.height; i += 1) {
    const ratio = i / LAYOUT.header.height;
    const r = Math.round(darkBlue[0] + (lightBlue[0] - darkBlue[0]) * ratio);
    const g = Math.round(darkBlue[1] + (lightBlue[1] - darkBlue[1]) * ratio);
    const b = Math.round(darkBlue[2] + (lightBlue[2] - darkBlue[2]) * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(0, i, pageWidth, 1, 'F');
  }

  // Fetch and add company logo - CRITICAL FIX
  try {
    console.log('🖼️ Attempting to fetch and embed company logo...');
    const footerLogo = await getFooterLogo();

    if (footerLogo?.url) {
      console.log(`📥 Logo found: ${footerLogo.url}`);

      // Optimize logo URL for high quality PDF embedding
      let optimizedLogoUrl = footerLogo.url;
      if (footerLogo.url.includes('cdn.sanity.io')) {
        optimizedLogoUrl = `${footerLogo.url}?w=800&h=300&q=100&fit=max&fm=png`;
      }

      // Load and embed the logo with proper error handling
      const logoResponse = await fetch(optimizedLogoUrl);
      if (!logoResponse.ok) {
        throw new Error(`Logo fetch failed: ${logoResponse.status}`);
      }

      const logoArrayBuffer = await logoResponse.arrayBuffer();
      const logoBase64 = Buffer.from(logoArrayBuffer).toString('base64');

      // Determine image format based on URL
      let imageFormat = 'PNG';
      const url = footerLogo.url.toLowerCase();
      if (url.includes('.jpg') || url.includes('.jpeg')) {
        imageFormat = 'JPEG';
      } else if (url.includes('.png')) {
        imageFormat = 'PNG';
      } else if (url.includes('.gif')) {
        imageFormat = 'GIF';
      }

      // Position logo in CENTER-MIDDLE of reduced blue header
      const logoWidth = receiptSettings.receiptTemplate?.logoSize?.width || 100;
      const logoHeight = receiptSettings.receiptTemplate?.logoSize?.height || 30;
      const logoX = LAYOUT.margins.left;
      const logoY = (LAYOUT.header.height - logoHeight) / 2; // Center-middle of blue header

      // Create data URL and embed logo
      const logoDataUrl = `data:image/${imageFormat.toLowerCase()};base64,${logoBase64}`;
      doc.addImage(logoDataUrl, imageFormat, logoX, logoY, logoWidth, logoHeight);

      console.log(`✅ Company logo embedded successfully in PDF header`);
      console.log(`   📐 Dimensions: ${logoWidth}x${logoHeight}px`);
      console.log(`   📍 Position: (${logoX}, ${logoY})`);
      console.log(`   🎨 Format: ${imageFormat}`);

    } else {
      console.log('⚠️ No logo found in Sanity, using company name fallback');
      // Fallback: Company name in header if no logo
      doc.setTextColor(...colors.headerText);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(receiptSettings.companyName || 'Intelli Global Conferences', LAYOUT.margins.left, LAYOUT.header.height / 2 + 5);
    }
  } catch (logoError) {
    console.error('❌ Logo embedding failed:', logoError.message);
    console.log('🔄 Using company name text fallback in header');

    // Fallback: Company name in header
    doc.setTextColor(...colors.headerText);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(receiptSettings.companyName || 'Intelli Global Conferences', LAYOUT.margins.left, LAYOUT.header.height / 2 + 5);
  }

  // REMOVED: "Registration Receipt" subtitle as requested - header shows only logo

  let yPos = LAYOUT.header.height + LAYOUT.spacing.headerGap + 10;

  // Conference Title - DYNAMIC from Sanity
  doc.setTextColor(...colors.valueText);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const dynamicConferenceTitle = receiptSettings.conferenceTitle || 'International Nursing Conference 2025';
  doc.text(dynamicConferenceTitle, LAYOUT.margins.left, yPos);
  yPos += LAYOUT.spacing.sectionGap + 5;

  // Payment Information Section
  yPos = addSection(doc, 'Payment Information', yPos, colors, LAYOUT);
  
  const paymentInfo = [
    ['Transaction ID:', paymentData.transactionId || 'N/A'],
    ['Order ID:', paymentData.orderId || 'N/A'],
    ['Amount:', `${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}`],
    ['Payment Method:', paymentData.paymentMethod || 'PayPal'],
    ['Payment Date:', formatDate(paymentData.paymentDate)],
    ['Status:', paymentData.status || 'Completed']
  ];

  yPos = addInfoFields(doc, paymentInfo, yPos, colors, LAYOUT);

  // Registration Details Section
  yPos = addSection(doc, 'Registration Details', yPos, colors, LAYOUT);
  
  const registrationInfo = [
    ['Registration ID:', registrationData.registrationId || registrationData._id || 'N/A'],
    ['Full Name:', getFullName(registrationData)],
    ['Email:', getEmail(registrationData)],
    ['Phone:', getPhone(registrationData)],
    ['Country:', getCountry(registrationData)],
    ['Address:', getAddress(registrationData)],
    ['Registration Type:', registrationData.registrationType || registrationData.selectedType?.name || 'N/A'],
    ['Number of Participants:', String(registrationData.numberOfParticipants || '1')]
  ];

  yPos = addInfoFields(doc, registrationInfo, yPos, colors, LAYOUT);

  // Payment Summary Section
  yPos = addSection(doc, 'Payment Summary', yPos, colors, LAYOUT);
  
  const summaryInfo = [
    ['Registration Fee:', `${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}`],
    ['Total Amount:', `${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}`]
  ];

  yPos = addInfoFields(doc, summaryInfo, yPos, colors, LAYOUT);

  // Contact Information Section
  yPos = addSection(doc, 'Contact Information', yPos, colors, LAYOUT);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.valueText);
  doc.text(`Email: ${receiptSettings.contactInformation?.supportEmail || 'contactus@intelliglobalconferences.com'}`, LAYOUT.margins.left, yPos);

  // Move to next line after email
  yPos += LAYOUT.spacing.lineHeight + 10;

  // Copyright and Generated Date - positioned below contact email (NOT in footer)
  doc.setFontSize(8);
  doc.setTextColor(...colors.footerText);
  doc.text(`© 2025 ${receiptSettings.conferenceTitle || 'International Nursing Conference 2025'}`, LAYOUT.margins.left, yPos);
  yPos += LAYOUT.spacing.lineHeight;
  doc.text(`Generated on: ${formatDate(paymentData.paymentDate || paymentData.capturedAt)}`, LAYOUT.margins.left, yPos);

  return Buffer.from(doc.output('arraybuffer'));
}

// Helper functions
function addSection(doc, title, yPos, colors, layout) {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.sectionHeader);
  doc.text(title, layout.margins.left, yPos);
  return yPos + layout.spacing.sectionGap;
}

function addInfoFields(doc, fields, yPos, colors, layout) {
  doc.setFontSize(9);
  
  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.labelText);
    doc.text(label, layout.margins.left, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.valueText);
    doc.text(value, layout.margins.left + 60, yPos);
    
    yPos += layout.spacing.lineHeight;
  });
  
  return yPos + layout.spacing.fieldGap;
}

function getFullName(registrationData) {
  if (registrationData.fullName) return registrationData.fullName;
  if (registrationData.personalDetails) {
    const { title, firstName, lastName } = registrationData.personalDetails;
    return `${title || ''} ${firstName || ''} ${lastName || ''}`.trim();
  }
  return 'N/A';
}

function getAddress(registrationData) {
  if (registrationData.address) return registrationData.address;
  if (registrationData.personalDetails?.address) return registrationData.personalDetails.address;
  if (registrationData.personalDetails?.fullPostalAddress) return registrationData.personalDetails.fullPostalAddress;
  return 'N/A';
}

function getPhone(registrationData) {
  if (registrationData.phone) return registrationData.phone;
  if (registrationData.phoneNumber) return registrationData.phoneNumber;
  if (registrationData.personalDetails?.phone) return registrationData.personalDetails.phone;
  if (registrationData.personalDetails?.phoneNumber) return registrationData.personalDetails.phoneNumber;
  return 'N/A';
}

function getCountry(registrationData) {
  if (registrationData.country) return registrationData.country;
  if (registrationData.personalDetails?.country) return registrationData.personalDetails.country;
  return 'N/A';
}

function getEmail(registrationData) {
  if (registrationData.email) return registrationData.email;
  if (registrationData.personalDetails?.email) return registrationData.personalDetails.email;
  return 'N/A';
}

function formatDate(dateString) {
  if (!dateString) return new Date().toLocaleString();
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [66, 103, 178]; // Default blue
}

/**
 * Get receipt settings from Sanity
 */
async function getReceiptSettings() {
  try {
    const query = `*[_type == "receiptSettings" && isActive == true][0]`;
    const settings = await sanityClient.fetch(query);
    
    if (!settings) {
      console.log('⚠️ No receipt settings found, using defaults');
      return getDefaultReceiptSettings();
    }
    
    return settings;
  } catch (error) {
    console.error('❌ Error fetching receipt settings:', error);
    return getDefaultReceiptSettings();
  }
}

/**
 * Get FOOTER logo from Sanity - SPECIFICALLY for PDF receipts
 */
async function getFooterLogo() {
  try {
    console.log('🔍 Searching for FOOTER logo in Sanity CMS...');

    // Query specifically for footer logo FIRST (as requested)
    const query = `*[_type == "siteSettings"][0]{
      footerContent{
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      logo{
        asset->{
          _id,
          url
        },
        alt
      }
    }`;

    const siteSettings = await sanityClient.fetch(query);
    console.log('📋 Site settings fetched:', !!siteSettings);

    // PRIORITY: Use footer logo FIRST (as specifically requested)
    if (siteSettings?.footerContent?.footerLogo?.asset?.url) {
      console.log('✅ Found FOOTER logo - using for PDF receipt');
      return {
        url: siteSettings.footerContent.footerLogo.asset.url,
        _id: siteSettings.footerContent.footerLogo.asset._id,
        alt: siteSettings.footerContent.footerLogo.alt || 'Intelli Global Conferences Logo'
      };
    }

    // FALLBACK: Use main website logo only if footer logo not available
    if (siteSettings?.logo?.asset?.url) {
      console.log('⚠️ Footer logo not found, using main website logo as fallback');
      return {
        url: siteSettings.logo.asset.url,
        _id: siteSettings.logo.asset._id,
        alt: siteSettings.logo.alt || 'Intelli Global Conferences Logo'
      };
    }

    console.log('⚠️ No footer logo OR main logo found in site settings');
    console.log('📋 Available fields:', Object.keys(siteSettings || {}));
    return null;
  } catch (error) {
    console.error('❌ Error fetching footer logo:', error);
    return null;
  }
}

function getDefaultReceiptSettings() {
  return {
    conferenceTitle: 'International Nursing Conference 2025',
    companyName: 'Intelli Global Conferences',
    receiptTemplate: {
      useBlueHeader: true,
      headerColor: { hex: '#4267B2' }
    },
    contactInformation: {
      supportEmail: 'contactus@intelliglobalconferences.com'
    }
  };
}

module.exports = {
  generateBlueHeaderReceiptPDF,
  getReceiptSettings,
  getFooterLogo
};
