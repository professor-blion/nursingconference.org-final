# 🔧 Production Brochure Download Fix

## 🚨 **Issue Identified**
The brochure download is working on localhost but failing on production due to:
1. **Wrong Project ID**: Coolify config has `tq1qdk3m` instead of `fl5uetho`
2. **Missing API Token**: Production environment lacks `SANITY_API_TOKEN`

## ✅ **Solution: Update Coolify Environment Variables**

### **Step 1: Access Coolify Dashboard**
1. Log into your Coolify instance
2. Navigate to your Event Website project
3. Go to **Environment Variables** section

### **Step 2: Update/Add These Variables**

#### **Critical Updates:**
```env
# Fix Project ID (CHANGE THIS)
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho

# Add Missing API Token (ADD THIS)
SANITY_API_TOKEN=skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c
```

#### **Complete Environment Variables List:**
```env
# Core Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0

# Sanity Configuration (CORRECTED)
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=sk5ZJnKnmbkzR8oiue5pXEvOZly20Km0ZHRnc4ywpg8HPby9N3wipoQsOHMSIIj1yTF0dtccBarQQsL2P0YwmP5Uf8QeoHP44FleIkjPXotKSmGPwzkdpDjC2nA1Fbic5W5QnQeghKuQTfnsqLKIWvP4q5idSUpopClvl0BLJcAJTQeBZoQy

# PayPal Configuration (existing)
PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
PAYPAL_CLIENT_SECRET=EMzGihvUsifDMxblEl3j9CGXLbOACaFsC8ykdBwMv3gK8f_a5S7NulJ9sSqe4atrt2d_2bCo7TBZ6x01
PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
```

### **Step 3: Redeploy Application**
1. After updating environment variables
2. **Trigger a new deployment** in Coolify
3. Wait for build to complete
4. Check deployment logs for success

### **Step 4: Verify Fix**
Test these endpoints after deployment:

1. **Brochure Setup**: `https://www.nursingeducationconferences.org/api/brochure/setup`
   - Should return: `{"success":true,"settings":{...}}`

2. **Brochure Form**: `https://www.nursingeducationconferences.org/brochure`
   - Fill out form and submit
   - Should download PDF successfully

## 🔍 **Troubleshooting**

### **If Still Not Working:**

1. **Check Deployment Logs**:
   ```
   Look for: "✅ SANITY_API_TOKEN is configured"
   Avoid: "❌ SANITY_API_TOKEN is not set"
   ```

2. **Test API Directly**:
   ```bash
   curl https://www.nursingeducationconferences.org/api/brochure/setup
   ```

3. **Verify Environment Variables**:
   - Ensure no trailing spaces
   - Confirm exact project ID: `n3no08m3`
   - Verify API token is complete

### **Success Indicators:**
- ✅ Brochure form submits without errors
- ✅ PDF download link appears
- ✅ PDF file downloads successfully
- ✅ No "Failed to process" error messages

## 📋 **Quick Checklist**
- [ ] Updated `NEXT_PUBLIC_SANITY_PROJECT_ID` to `n3no08m3`
- [ ] Added `SANITY_API_TOKEN` environment variable
- [ ] Triggered new deployment in Coolify
- [ ] Tested brochure download on production site
- [ ] Verified API endpoints are responding correctly

## 🎯 **Expected Result**
After these changes, the brochure download at `https://www.nursingeducationconferences.org/brochure` should work exactly like it does on localhost.
