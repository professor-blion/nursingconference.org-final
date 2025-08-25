'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const [registrationDetails, setRegistrationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams?.get('transaction_id');
  const orderId = searchParams?.get('order_id');
  const registrationId = searchParams?.get('registration_id');
  const paymentMethod = searchParams?.get('payment_method') || 'PayPal';
  const amount = searchParams?.get('amount');
  const currency = searchParams?.get('currency') || 'USD';
  const capturedAt = searchParams?.get('captured_at');

  useEffect(() => {
    if (registrationId) {
      // Fetch registration details
      fetch(`/api/registration?registrationId=${registrationId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRegistrationDetails(data.data);
          }
        })
        .catch(error => {
          console.error('Error fetching registration details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [registrationId]);

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
            <p className="text-green-100">Thank you for registering for the International Nursing Conference 2025</p>
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
                    onClick={() => window.print()}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Print Registration Receipt
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        // Download PDF using the UNIFIED PDF generation system
                        const response = await fetch('/api/registration/receipt-pdf', {
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
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Registration_Receipt_${registrationId}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } else {
                          alert('Failed to download PDF. Please try again.');
                        }
                      } catch (error) {
                        console.error('Error downloading PDF:', error);
                        alert('Failed to download PDF. Please try again.');
                      }
                    }}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Download PDF Receipt
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        // Use the unified email receipt system instead of the old PDF route
                        const response = await fetch('/api/email/send-receipt', {
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
                            // Removed testEmail - will use customer's actual email from registration
                          }),
                        });

                        if (response.ok) {
                          const result = await response.json();
                          if (result.success) {
                            alert('✅ Payment receipt email sent successfully! Please check your email inbox.');
                          } else {
                            throw new Error(result.error || 'Failed to send receipt email');
                          }
                        } else {
                          const errorData = await response.json();
                          throw new Error(errorData.error || 'Failed to send receipt email');
                        }
                      } catch (error) {
                        console.error('Error sending receipt email:', error);
                        alert('Failed to send receipt email. Please try again.');
                      }
                    }}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Email PDF Receipt
                  </button>
                  <a
                    href="/"
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
                  >
                    Back to Home
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
