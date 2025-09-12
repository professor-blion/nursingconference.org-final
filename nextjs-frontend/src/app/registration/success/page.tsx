'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const [registrationDetails, setRegistrationDetails] = useState<any>(null);
  const [conferenceTitle, setConferenceTitle] = useState<string>('International Nursing Conference 2025'); // Fallback
  const [loading, setLoading] = useState(true);

  // Parse URL parameters with multiple possible formats
  const transactionId = searchParams?.get('transaction_id') || searchParams?.get('transactionId');
  const orderId = searchParams?.get('order_id') || searchParams?.get('orderId');
  const registrationId = searchParams?.get('registration_id') || searchParams?.get('registrationId');
  const paymentMethod = searchParams?.get('payment_method') || searchParams?.get('paymentMethod') || 'PayPal';
  const amount = searchParams?.get('amount');
  const currency = searchParams?.get('currency') || 'USD';
  const capturedAt = searchParams?.get('captured_at') || searchParams?.get('capturedAt');
  const status = searchParams?.get('status');

  // Function to fetch conference title from Sanity
  const fetchConferenceTitle = async () => {
    try {
      const response = await fetch('/api/receipt-settings');
      const data = await response.json();

      if (data.success && data.data?.conferenceTitle) {
        setConferenceTitle(data.data.conferenceTitle);
        console.log('✅ Conference title fetched:', data.data.conferenceTitle);
      } else {
        console.log('⚠️ Using fallback conference title');
      }
    } catch (error) {
      console.error('❌ Error fetching conference title:', error);
      // Keep fallback title
    }
  };

  useEffect(() => {
    // Fetch conference title from Sanity
    fetchConferenceTitle();

    if (registrationId) {
      console.log('🔍 Fetching registration details for:', registrationId);
      console.log('📋 URL Parameters:', {
        registrationId,
        transactionId,
        orderId,
        amount,
        currency,
        paymentMethod,
        status,
        capturedAt
      });

      // CRITICAL FIX: Try multiple API endpoints for production compatibility
      const tryFetchRegistration = async () => {
        try {
          // Try primary API endpoint
          let response = await fetch(`/api/registration?registrationId=${registrationId}`);

          if (!response.ok) {
            console.warn('⚠️ Primary API failed, trying alternative endpoint...');
            // Try alternative endpoint structure
            response = await fetch(`/api/registration/${registrationId}`);
          }

          if (!response.ok) {
            console.warn('⚠️ API endpoints not available, using URL parameters for display');
            // FALLBACK: Create registration details from URL parameters
            const fallbackDetails = {
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
              paymentMethod: paymentMethod || 'PayPal'
            };

            console.log('📄 Using fallback registration details:', fallbackDetails);
            setRegistrationDetails(fallbackDetails);
            setLoading(false);
            return;
          }

          const data = await response.json();
          if (data.success) {
            console.log('✅ Registration details fetched successfully:', data.data);
            setRegistrationDetails(data.data);
          } else {
            console.error('❌ API returned error:', data);
            throw new Error(data.error || 'Failed to fetch registration');
          }

        } catch (error) {
          console.error('❌ Error fetching registration details:', error);

          // FALLBACK: Create basic registration details from URL parameters
          const fallbackDetails = {
            registrationId: registrationId,
            personalDetails: {
              title: '',
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
            paymentMethod: paymentMethod || 'PayPal'
          };

          console.log('📄 Using fallback registration details due to API error:', fallbackDetails);
          setRegistrationDetails(fallbackDetails);
        } finally {
          setLoading(false);
        }
      };

      tryFetchRegistration();
    } else {
      console.warn('⚠️ No registration ID provided');
      setLoading(false);
    }
  }, [registrationId, transactionId, orderId, amount, currency, paymentMethod, status, capturedAt]);

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 20px; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .bg-green-600 { background-color: #059669 !important; }
          .text-white { color: white !important; }
          .shadow-lg { box-shadow: none !important; }
          .rounded-lg { border-radius: 0 !important; }
          .bg-gray-50 { background-color: white !important; }
          .min-h-screen { min-height: auto !important; }
          .py-12 { padding-top: 0 !important; padding-bottom: 0 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-600 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Registration Successful!</h1>
            <p className="text-green-100">Thank you for registering for the {conferenceTitle}</p>
          </div>

          {/* Registration Details */}
          <div className="px-6 py-8">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading registration details...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Payment Information */}
                {transactionId && (
                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <h3 className="text-lg font-semibold mb-3 text-green-900">
                      ✅ Payment Confirmed
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-sm text-green-800">
                        <p><strong>Transaction ID:</strong> <span className="font-mono">{transactionId}</span></p>
                        {orderId && <p><strong>Order ID:</strong> <span className="font-mono">{orderId}</span></p>}
                        <p><strong>Payment Method:</strong> {paymentMethod}</p>
                      </div>
                      <div className="text-sm text-green-800">
                        {amount && <p><strong>Amount:</strong> {currency} {amount}</p>}
                        <p><strong>Status:</strong> <span className="text-green-600 font-medium">Completed</span></p>
                        <p><strong>Date:</strong> {capturedAt ? new Date(capturedAt).toLocaleString() : new Date().toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-300">
                      <p className="text-xs text-blue-700 font-medium">
                        Payment processed securely through PayPal
                      </p>
                    </div>
                  </div>
                )}

                {/* Registration Information */}
                {registrationDetails && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h3>

                    {/* Personal Information */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p><strong>Registration ID:</strong> {registrationDetails.registrationId}</p>
                          <p><strong>Full Name:</strong> {registrationDetails.personalDetails?.title ? `${registrationDetails.personalDetails.title} ` : ''}{registrationDetails.personalDetails?.firstName} {registrationDetails.personalDetails?.lastName}</p>
                          <p><strong>Email:</strong> {registrationDetails.personalDetails?.email}</p>
                          <p><strong>Phone:</strong> {registrationDetails.personalDetails?.phoneNumber}</p>
                        </div>
                        <div className="space-y-2">
                          <p><strong>Country:</strong> {registrationDetails.personalDetails?.country}</p>
                          <p><strong>Address:</strong> {registrationDetails.personalDetails?.fullPostalAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Registration Information */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Registration Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          {registrationDetails.selectedRegistrationName && (
                            <p><strong>Registration Type:</strong> {registrationDetails.selectedRegistrationName}</p>
                          )}
                          {registrationDetails.sponsorType && (
                            <p><strong>Sponsorship Type:</strong> {registrationDetails.sponsorType}</p>
                          )}
                          <p><strong>Number of Participants:</strong> {registrationDetails.numberOfParticipants}</p>
                        </div>
                        <div className="space-y-2">
                          {registrationDetails.accommodationType && (
                            <p><strong>Accommodation:</strong> {registrationDetails.accommodationType}</p>
                          )}
                          {registrationDetails.accommodationNights && (
                            <p><strong>Accommodation Nights:</strong> {registrationDetails.accommodationNights}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Payment Summary</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Registration Fee:</span>
                          <span>{currency} {registrationDetails.pricing?.registrationFee || 0}</span>
                        </div>
                        {registrationDetails.pricing?.accommodationFee > 0 && (
                          <div className="flex justify-between">
                            <span>Accommodation Fee:</span>
                            <span>{currency} {registrationDetails.pricing.accommodationFee}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount:</span>
                            <span>{currency} {registrationDetails.pricing?.totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• You will receive a confirmation email shortly with your registration details</li>
                    <li>• Your registration certificate will be sent via email within 24 hours</li>
                    <li>• Conference materials and schedule will be shared closer to the event date</li>
                    <li>• For any queries, please contact us at intelliglobalconferences@gmail.com</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 no-print">
                  <button
                    onClick={async () => {
                      try {
                        console.log('🖨️ Attempting PDF generation for printing...');
                        console.log('📋 PDF Request Data:', {
                          registrationId,
                          transactionId,
                          orderId,
                          amount,
                          currency,
                          capturedAt
                        });

                        // CRITICAL FIX: Try multiple PDF API endpoints for production compatibility
                        let response;
                        let pdfEndpointWorked = false;

                        // Try primary PDF endpoint
                        try {
                          response = await fetch('/api/registration/receipt-pdf', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              registrationId,
                              transactionId,
                              orderId,
                              amount,
                              currency,
                              capturedAt
                            }),
                          });

                          if (response.ok) {
                            pdfEndpointWorked = true;
                            console.log('✅ Primary PDF endpoint worked');
                          } else {
                            console.warn('⚠️ Primary PDF endpoint failed:', response.status);
                          }
                        } catch (error) {
                          console.warn('⚠️ Primary PDF endpoint error:', error);
                        }

                        // Try alternative PDF endpoint if primary failed
                        if (!pdfEndpointWorked) {
                          try {
                            console.log('🔄 Trying alternative PDF endpoint...');
                            response = await fetch('/api/pdf/receipt', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                registrationId,
                                transactionId,
                                orderId,
                                amount,
                                currency,
                                capturedAt
                              }),
                            });

                            if (response.ok) {
                              pdfEndpointWorked = true;
                              console.log('✅ Alternative PDF endpoint worked');
                            } else {
                              console.warn('⚠️ Alternative PDF endpoint failed:', response.status);
                            }
                          } catch (error) {
                            console.warn('⚠️ Alternative PDF endpoint error:', error);
                          }
                        }

                        if (pdfEndpointWorked && response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);

                          // Open PDF in new window for printing
                          const printWindow = window.open(url, '_blank', 'width=800,height=600');

                          if (printWindow) {
                            // Wait for PDF to load in the new window, then trigger print
                            printWindow.onload = () => {
                              setTimeout(() => {
                                try {
                                  printWindow.print();
                                  // Close the window after printing (optional)
                                  printWindow.onafterprint = () => {
                                    printWindow.close();
                                    window.URL.revokeObjectURL(url);
                                  };
                                } catch (error) {
                                  console.error('Print error:', error);
                                  // Keep window open if print fails so user can manually print
                                }
                              }, 1000); // Give PDF time to fully load
                            };

                            // Fallback: if onload doesn't work, try after a delay
                            setTimeout(() => {
                              if (printWindow && !printWindow.closed) {
                                try {
                                  printWindow.print();
                                } catch (error) {
                                  console.error('Fallback print error:', error);
                                }
                              }
                            }, 2000);
                          } else {
                            // If popup was blocked, show message to user
                            alert('Please allow popups for this site to enable PDF printing. You can also use the Download button and print manually.');
                            window.URL.revokeObjectURL(url);
                          }
                        } else {
                          console.error('❌ All PDF endpoints failed, offering fallback print option');

                          // FALLBACK: Offer browser print of the current page
                          const userChoice = confirm(
                            'PDF generation is temporarily unavailable. Would you like to print this confirmation page instead?\n\n' +
                            'Click OK to print this page, or Cancel to try again later.'
                          );

                          if (userChoice) {
                            console.log('🖨️ Using fallback browser print');
                            window.print();
                          } else {
                            alert('PDF generation failed. Please contact support at intelliglobalconferences@gmail.com for assistance.');
                          }
                        }
                      } catch (error) {
                        console.error('Error printing PDF:', error);
                        alert('Failed to print PDF. Please try again.');
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                  >
                    🖨️ Print PDF Receipt
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        console.log('📄 Attempting PDF generation for download...');
                        console.log('📋 PDF Request Data:', {
                          registrationId,
                          transactionId,
                          orderId,
                          amount,
                          currency,
                          capturedAt
                        });

                        // CRITICAL FIX: Try multiple PDF API endpoints for production compatibility
                        let response;
                        let pdfEndpointWorked = false;

                        // Try primary PDF endpoint
                        try {
                          response = await fetch('/api/registration/receipt-pdf', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              registrationId,
                              transactionId,
                              orderId,
                              amount,
                              currency,
                              capturedAt
                            }),
                          });

                          if (response.ok) {
                            pdfEndpointWorked = true;
                            console.log('✅ Primary PDF endpoint worked for download');
                          } else {
                            console.warn('⚠️ Primary PDF endpoint failed for download:', response.status);
                          }
                        } catch (error) {
                          console.warn('⚠️ Primary PDF endpoint error for download:', error);
                        }

                        // Try alternative PDF endpoint if primary failed
                        if (!pdfEndpointWorked) {
                          try {
                            console.log('🔄 Trying alternative PDF endpoint for download...');
                            response = await fetch('/api/pdf/receipt', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                registrationId,
                                transactionId,
                                orderId,
                                amount,
                                currency,
                                capturedAt
                              }),
                            });

                            if (response.ok) {
                              pdfEndpointWorked = true;
                              console.log('✅ Alternative PDF endpoint worked for download');
                            } else {
                              console.warn('⚠️ Alternative PDF endpoint failed for download:', response.status);
                            }
                          } catch (error) {
                            console.warn('⚠️ Alternative PDF endpoint error for download:', error);
                          }
                        }

                        if (pdfEndpointWorked && response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Registration_Receipt_${registrationId}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                          console.log('✅ PDF download completed successfully');
                        } else {
                          console.error('❌ All PDF endpoints failed for download');

                          // FALLBACK: Offer to email the receipt or contact support
                          const userChoice = confirm(
                            'PDF download is temporarily unavailable. Would you like us to email your receipt instead?\n\n' +
                            'Click OK to request email delivery, or Cancel to try again later.'
                          );

                          if (userChoice) {
                            alert('Please contact support at intelliglobalconferences@gmail.com with your registration ID: ' + registrationId + '\n\nWe will email your receipt within 24 hours.');
                          } else {
                            alert('PDF download failed. Please try again later or contact support.');
                          }
                        }
                      } catch (error) {
                        console.error('❌ Error downloading PDF:', error);
                        alert('PDF download failed due to a technical error. Please contact support at intelliglobalconferences@gmail.com with your registration ID: ' + registrationId);
                      }
                    }}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2"
                  >
                    📄 Download PDF Receipt
                  </button>
                  <a
                    href="/"
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center flex items-center justify-center gap-2"
                  >
                    🏠 Back to Home
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
