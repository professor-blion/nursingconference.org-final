# Production Environment Variables for Coolify Deployment

## PayPal Configuration

### Required Environment Variables for Production Deployment:

```bash
# Client-side PayPal variables (accessible in browser)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CURRENCY=USD

# Server-side PayPal variables (secure, not accessible in browser)
PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
PAYPAL_CLIENT_SECRET=EMzGihvUsifDMxblEl3j9CGXLbOACaFsC8ykdBwMv3gK8f_a5S7NulJ9sSqe4atrt2d_2bCo7TBZ6x01
PAYPAL_ENVIRONMENT=production

# Base URL for the application
NEXT_PUBLIC_BASE_URL=https://nursingeducationconferences.org
```

## Sanity CMS Configuration

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n
```

## Next.js Configuration

```bash
# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

## Important Notes:

1. **NEXT_PUBLIC_* variables** are accessible in the browser and will be included in the client-side bundle
2. **Variables without NEXT_PUBLIC_** are server-side only and secure
3. **Both PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_CLIENT_ID** should have the same value for consistency
4. **PayPal Environment** should be set to "production" for live payments
5. **Base URL** should match your actual domain

## Coolify Deployment Instructions:

1. In Coolify, go to your application settings
2. Navigate to Environment Variables section
3. Add each variable listed above
4. Ensure no trailing spaces or quotes around values
5. Restart the application after adding variables

## Troubleshooting:

- If you see "Client ID is missing" error, check that `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
- If server-side PayPal API calls fail, check that `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set
- Verify that both client and server PayPal Client IDs match
