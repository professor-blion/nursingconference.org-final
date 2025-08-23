// =============================================================================
// APP COMPONENT
// =============================================================================

import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import PayPalProvider from '@/components/paypal/PayPalProvider';
import '@/styles/globals.css';
import '@/styles/components.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PayPalProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </PayPalProvider>
  );
}
