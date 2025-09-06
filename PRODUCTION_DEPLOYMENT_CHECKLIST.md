# Production Deployment Checklist for PayPal Configuration

## 🚨 **Current Issue**
Production server shows: "PayPal Configuration Error: PayPal Client ID is missing. Please check environment variables."

## ✅ **Deployment Verification Steps**

### **1. Verify Latest Code Deployment**
- [ ] Confirm commit `3e0caac` is deployed to production
- [ ] Check that the updated `coolify.yaml` is being used
- [ ] Verify build completed successfully without errors

### **2. Environment Variables Verification**
Check that ALL these variables are set in Coolify:

#### **Client-Side Variables (NEXT_PUBLIC_*)**
```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CURRENCY=USD
NEXT_PUBLIC_BASE_URL=https://nursingeducationconferences.org
```

#### **Server-Side Variables**
```bash
PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
PAYPAL_CLIENT_SECRET=EMzGihvUsifDMxblEl3j9CGXLbOACaFsC8ykdBwMv3gK8f_a5S7NulJ9sSqe4atrt2d_2bCo7TBZ6x01
PAYPAL_ENVIRONMENT=production
```

#### **Other Required Variables**
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n
```

### **3. Deployment Actions Required**
- [ ] **Rebuild the application** after environment variable changes
- [ ] **Restart the container/service** in Coolify
- [ ] **Clear any cached builds** if applicable
- [ ] **Verify the new build includes the environment variables**

### **4. Testing and Verification**

#### **A. Use Debug Endpoints**
1. Visit: `https://your-domain.com/api/paypal/config-status`
2. Check the response for:
   - `hasNextPublicPayPalClientId: true`
   - `readyForPayments: true`
   - No missing variables in troubleshooting section

#### **B. Use Verification Page**
1. Visit: `https://your-domain.com/paypal-config-verify`
2. Verify all environment variables show as "✅ Set"
3. Check that "PayPal Configuration Complete" is displayed

#### **C. Test Registration Page**
1. Visit: `https://your-domain.com/registration`
2. Fill out the form completely
3. Select a registration type or sponsorship
4. Verify PayPal button appears without error message
5. Test that PayPal button is functional

## 🔧 **Troubleshooting Steps**

### **If Environment Variables Are Not Loading:**
1. **Check Coolify Environment Variables Tab**
   - Ensure all variables are listed
   - Verify no typos in variable names
   - Check for trailing spaces or quotes

2. **Rebuild and Restart**
   - Trigger a new build in Coolify
   - Restart the application service
   - Wait for deployment to complete

3. **Check Build Logs**
   - Look for environment variable injection during build
   - Check for any build-time errors
   - Verify Next.js is picking up the variables

### **If Variables Are Set But Still Not Working:**
1. **Check next.config.js**
   - Verify the updated config is deployed
   - Ensure environment variable fallbacks are working

2. **Browser Cache**
   - Clear browser cache and cookies
   - Try in incognito/private mode
   - Hard refresh the page (Ctrl+F5)

3. **CDN/Proxy Cache**
   - Clear any CDN cache if applicable
   - Check if there's a proxy caching old builds

## 🎯 **Expected Results After Fix**

### **Debug Endpoint Response:**
```json
{
  "success": true,
  "summary": {
    "readyForPayments": true,
    "configurationComplete": true
  },
  "troubleshooting": {
    "missingVars": [],
    "recommendations": []
  }
}
```

### **Registration Page:**
- PayPal button visible in "Complete Payment" section
- No error messages about missing configuration
- Button functional for test payments

### **Browser Console:**
- PayPal debug logs showing successful configuration
- No errors about missing client ID
- PayPal SDK loading successfully

## 📞 **If Issues Persist**

1. **Check Coolify Logs**
   - Application startup logs
   - Build process logs
   - Runtime error logs

2. **Verify Coolify Configuration**
   - Environment variables tab
   - Build settings
   - Deployment configuration

3. **Manual Environment Variable Check**
   - SSH into the container (if possible)
   - Run: `env | grep PAYPAL`
   - Verify variables are present at runtime

## 🚀 **Success Criteria**
- [ ] All environment variables present in production
- [ ] Debug endpoint returns success
- [ ] Registration page shows PayPal button
- [ ] No configuration error messages
- [ ] PayPal payments functional
