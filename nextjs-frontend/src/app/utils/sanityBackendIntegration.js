/**
 * ENHANCED SANITY BACKEND INTEGRATION
 * Comprehensive PDF storage, transaction data management, and document linking
 * for both PayPal and Razorpay payment methods with enhanced tables structure
 */

import { createClient } from '@sanity/client';

// Sanity client configuration with write permissions
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * ENHANCED PDF STORAGE SYSTEM
 * Uploads PDFs to Sanity with proper metadata and linking
 */
async function uploadPDFWithMetadata(pdfBuffer, registrationData, paymentData, paymentMethod) {
  try {
    console.log('📤 Uploading PDF with enhanced metadata...');
    
    if (!process.env.SANITY_API_TOKEN) {
      console.warn('⚠️ SANITY_API_TOKEN not found, cannot upload PDF');
      return { success: false, error: 'Missing Sanity API token' };
    }
    
    // Generate comprehensive filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `receipt_${registrationData.registrationId}_${paymentMethod}_${paymentData.transactionId}_${timestamp}.pdf`;
    
    // Upload PDF as asset with metadata
    const asset = await sanityClient.assets.upload('file', pdfBuffer, {
      filename: filename,
      contentType: 'application/pdf',
      metadata: {
        registrationId: registrationData.registrationId,
        paymentMethod: paymentMethod,
        transactionId: paymentData.transactionId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        generatedAt: new Date().toISOString()
      }
    });
    
    console.log(`✅ PDF uploaded successfully: ${asset._id}`);
    
    return {
      success: true,
      asset: asset,
      filename: filename,
      assetId: asset._id,
      url: asset.url
    };
    
  } catch (error) {
    console.error('❌ PDF upload failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * COMPREHENSIVE REGISTRATION UPDATE
 * Updates registration with complete payment and receipt information
 */
async function updateRegistrationComprehensive(registrationId, updateData) {
  try {
    console.log(`🔄 Updating registration ${registrationId} with comprehensive data...`);
    
    const updateResult = await sanityClient
      .patch(registrationId)
      .set({
        // Payment completion data
        paymentStatus: 'completed',
        paymentMethod: updateData.paymentMethod,
        paymentAmount: updateData.paymentAmount,
        paymentCurrency: updateData.paymentCurrency,
        paymentDate: updateData.paymentDate || new Date().toISOString(),
        paymentCapturedAt: updateData.paymentCapturedAt || new Date().toISOString(),
        
        // Payment method specific data
        ...(updateData.paymentMethod === 'paypal' ? {
          paypalTransactionId: updateData.transactionId,
          paypalOrderId: updateData.orderId
        } : {}),
        
        ...(updateData.paymentMethod === 'razorpay' ? {
          paymentId: updateData.transactionId,
          paymentOrderId: updateData.orderId,
          paymentSignature: updateData.signature,
          razorpayPaymentData: {
            orderId: updateData.orderId,
            paymentId: updateData.transactionId,
            signature: updateData.signature,
            amount: updateData.paymentAmount,
            currency: updateData.paymentCurrency,
            verifiedAt: new Date().toISOString()
          }
        } : {}),
        
        // Receipt and email data
        receiptEmailSent: updateData.receiptEmailSent || false,
        receiptEmailSentAt: updateData.receiptEmailSentAt,
        receiptEmailRecipient: updateData.receiptEmailRecipient,
        pdfReceiptGenerated: updateData.pdfReceiptGenerated || false,
        pdfReceiptStoredInSanity: updateData.pdfReceiptStoredInSanity || false,
        
        // PDF asset linking
        ...(updateData.pdfAsset ? {
          pdfReceipt: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: updateData.pdfAsset._id
            }
          }
        } : {}),
        
        // Enhanced table data for admin interface
        'registrationTable.paymentStatus': 'completed',
        'registrationTable.paymentMethod': updateData.paymentMethod,
        'registrationTable.transactionId': updateData.transactionId,
        'registrationTable.paymentAmount': updateData.paymentAmount,
        'registrationTable.paymentCurrency': updateData.paymentCurrency,
        'registrationTable.receiptEmailSent': updateData.receiptEmailSent || false,
        'registrationTable.pdfReceiptGenerated': updateData.pdfReceiptGenerated || false,
        
        // Enhanced table PDF linking
        ...(updateData.pdfAsset ? {
          'registrationTable.pdfReceiptFile': {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: updateData.pdfAsset._id
            }
          }
        } : {}),
        
        // Processing metadata
        webhookProcessed: true,
        lastUpdated: new Date().toISOString(),
        processingCompletedAt: new Date().toISOString()
      })
      .commit();
    
    console.log(`✅ Registration updated comprehensively: ${updateResult._id}`);
    
    return {
      success: true,
      registrationId: updateResult._id,
      updatedFields: Object.keys(updateData).length
    };
    
  } catch (error) {
    console.error('❌ Comprehensive registration update failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * CREATE PAYMENT RECORD
 * Creates a separate payment record for enhanced tracking
 */
async function createPaymentRecord(registrationData, paymentData, paymentMethod) {
  try {
    console.log('📝 Creating enhanced payment record...');
    
    const paymentRecord = {
      _type: 'paymentRecord',
      registrationId: registrationData.registrationId,
      registrationRef: {
        _type: 'reference',
        _ref: registrationData._id
      },
      paymentId: paymentData.transactionId,
      paymentMethod: paymentMethod,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'completed',
      transactionDate: paymentData.capturedAt || new Date().toISOString(),
      
      // Payment method specific data
      paymentGatewayData: {
        transactionId: paymentData.transactionId,
        orderId: paymentData.orderId,
        ...(paymentMethod === 'razorpay' ? {
          signature: paymentData.signature,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_signature: paymentData.razorpay_signature
        } : {}),
        ...(paymentMethod === 'paypal' ? {
          paypalTransactionId: paymentData.paypalTransactionId,
          paypalOrderId: paymentData.paypalOrderId
        } : {})
      },
      
      // Processing metadata
      processedAt: new Date().toISOString(),
      receiptGenerated: false,
      emailSent: false
    };
    
    const createdRecord = await sanityClient.create(paymentRecord);
    
    console.log(`✅ Payment record created: ${createdRecord._id}`);
    
    return {
      success: true,
      recordId: createdRecord._id,
      record: createdRecord
    };
    
  } catch (error) {
    console.error('❌ Payment record creation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * UPDATE PAYMENT RECORD WITH RECEIPT DATA
 * Updates payment record after successful receipt generation
 */
async function updatePaymentRecordWithReceipt(recordId, receiptData) {
  try {
    console.log(`🔄 Updating payment record ${recordId} with receipt data...`);
    
    const updateResult = await sanityClient
      .patch(recordId)
      .set({
        receiptGenerated: receiptData.pdfGenerated || false,
        emailSent: receiptData.emailSent || false,
        receiptEmailSentAt: receiptData.emailSentAt,
        receiptEmailRecipient: receiptData.emailRecipient,
        pdfAssetId: receiptData.pdfAssetId,
        receiptProcessedAt: new Date().toISOString()
      })
      .commit();
    
    console.log(`✅ Payment record updated with receipt data: ${updateResult._id}`);
    
    return {
      success: true,
      recordId: updateResult._id
    };
    
  } catch (error) {
    console.error('❌ Payment record receipt update failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * FETCH REGISTRATION WITH COMPLETE DATA
 * Retrieves registration with all related payment and receipt data
 */
async function fetchRegistrationComplete(registrationId) {
  try {
    console.log(`🔍 Fetching complete registration data for: ${registrationId}`);
    
    const query = `*[_type == "conferenceRegistration" && registrationId == $registrationId][0] {
      _id,
      registrationId,
      personalDetails,
      registrationType,
      accommodationType,
      pricing,
      paymentStatus,
      paymentMethod,
      paymentAmount,
      paymentCurrency,
      paymentDate,
      paymentCapturedAt,
      paypalTransactionId,
      paypalOrderId,
      paymentId,
      paymentOrderId,
      paymentSignature,
      razorpayPaymentData,
      receiptEmailSent,
      receiptEmailSentAt,
      receiptEmailRecipient,
      pdfReceiptGenerated,
      pdfReceiptStoredInSanity,
      pdfReceipt {
        asset -> {
          _id,
          url,
          originalFilename,
          size
        }
      },
      registrationTable,
      webhookProcessed,
      lastUpdated,
      processingCompletedAt,
      "paymentRecords": *[_type == "paymentRecord" && registrationId == ^.registrationId] {
        _id,
        paymentId,
        paymentMethod,
        amount,
        currency,
        status,
        transactionDate,
        receiptGenerated,
        emailSent
      }
    }`;
    
    const registration = await sanityClient.fetch(query, { registrationId });
    
    if (!registration) {
      console.warn(`⚠️ Registration not found: ${registrationId}`);
      return {
        success: false,
        error: 'Registration not found'
      };
    }
    
    console.log(`✅ Complete registration data fetched: ${registration._id}`);
    
    return {
      success: true,
      registration: registration
    };
    
  } catch (error) {
    console.error('❌ Failed to fetch complete registration:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * COMPREHENSIVE BACKEND INTEGRATION
 * Main function that handles complete Sanity backend integration
 */
async function integrateWithSanityBackend(registrationData, paymentData, paymentMethod, receiptData) {
  try {
    console.log('🚀 Starting comprehensive Sanity backend integration...');
    
    const results = {
      pdfUpload: null,
      registrationUpdate: null,
      paymentRecord: null,
      paymentRecordUpdate: null
    };
    
    // Step 1: Upload PDF if available
    if (receiptData.pdfBuffer) {
      results.pdfUpload = await uploadPDFWithMetadata(
        receiptData.pdfBuffer,
        registrationData,
        paymentData,
        paymentMethod
      );
    }
    
    // Step 2: Update registration comprehensively
    const updateData = {
      paymentMethod: paymentMethod,
      paymentAmount: paymentData.amount,
      paymentCurrency: paymentData.currency,
      paymentDate: paymentData.capturedAt,
      paymentCapturedAt: paymentData.capturedAt,
      transactionId: paymentData.transactionId,
      orderId: paymentData.orderId,
      signature: paymentData.signature,
      receiptEmailSent: receiptData.emailSent,
      receiptEmailSentAt: receiptData.emailSentAt,
      receiptEmailRecipient: receiptData.emailRecipient,
      pdfReceiptGenerated: receiptData.pdfGenerated,
      pdfReceiptStoredInSanity: results.pdfUpload?.success || false,
      pdfAsset: results.pdfUpload?.asset
    };
    
    results.registrationUpdate = await updateRegistrationComprehensive(
      registrationData._id,
      updateData
    );
    
    // Step 3: Create payment record
    results.paymentRecord = await createPaymentRecord(
      registrationData,
      paymentData,
      paymentMethod
    );
    
    // Step 4: Update payment record with receipt data
    if (results.paymentRecord.success) {
      results.paymentRecordUpdate = await updatePaymentRecordWithReceipt(
        results.paymentRecord.recordId,
        {
          pdfGenerated: receiptData.pdfGenerated,
          emailSent: receiptData.emailSent,
          emailSentAt: receiptData.emailSentAt,
          emailRecipient: receiptData.emailRecipient,
          pdfAssetId: results.pdfUpload?.assetId
        }
      );
    }
    
    console.log('✅ Comprehensive Sanity backend integration completed');
    
    return {
      success: true,
      results: results,
      pdfAssetId: results.pdfUpload?.assetId,
      paymentRecordId: results.paymentRecord?.recordId
    };
    
  } catch (error) {
    console.error('❌ Comprehensive Sanity backend integration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export {
  uploadPDFWithMetadata,
  updateRegistrationComprehensive,
  createPaymentRecord,
  updatePaymentRecordWithReceipt,
  fetchRegistrationComplete,
  integrateWithSanityBackend
};
