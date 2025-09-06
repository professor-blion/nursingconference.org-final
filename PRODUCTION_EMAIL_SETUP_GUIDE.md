# PRODUCTION EMAIL SETUP GUIDE - AUTOMATIC EMAILS AFTER PAYPAL PAYMENTS

## 🚨 **ISSUE IDENTIFIED: Missing Environment Variables**

The diagnostic has identified that automatic emails are not working because of missing environment variables in your Coolify production deployment.

## 🔧 **IMMEDIATE FIX REQUIRED**

### **✅ Step 1: Add Missing Environment Variables in Coolify**

**Access your Coolify dashboard and add these environment variables:**

```bash
# SMTP Configuration (Already configured)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contactus@intelliglobalconferences.com
SMTP_PASS=Muni@12345m

# MISSING: Email Configuration (ADD THESE)
EMAIL_FROM=contactus@intelliglobalconferences.com
EMAIL_FROM_NAME=Intelli Global Conferences

# MISSING: PayPal Webhook Configuration (ADD THESE)
PAYPAL_WEBHOOK_ID=your_webhook_id_from_paypal_dashboard

# Sanity Configuration (Already configured)
SANITY_API_TOKEN=your_sanity_write_token
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# PayPal Configuration (Already configured)
PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_client_secret
```

### **✅ Step 2: Configure PayPal Webhook in PayPal Dashboard**

**1. Access PayPal Developer Dashboard:**
- Go to: https://developer.paypal.com/
- Login with your PayPal business account
- Navigate to "My Apps & Credentials"

**2. Create/Configure Webhook:**
- Click "Create App" or select existing app
- Go to "Webhooks" section
- Click "Add Webhook"

**3. Webhook Configuration:**
```
Webhook URL: https://yourdomain.com/api/paypal/webhook
Events to subscribe to:
- ✅ PAYMENT.CAPTURE.COMPLETED
- ✅ PAYMENT.CAPTURE.DENIED
- ✅ PAYMENT.CAPTURE.PENDING
- ✅ CHECKOUT.ORDER.COMPLETED
```

**4. Get Webhook ID:**
- After creating webhook, copy the "Webhook ID"
- Add it to Coolify as `PAYPAL_WEBHOOK_ID` environment variable

### **✅ Step 3: Verify Webhook URL Accessibility**

**Test your webhook URL:**
```bash
curl -X POST https://yourdomain.com/api/paypal/webhook
```

**Expected Response:**
- Status: 400 (Bad Request) - This is correct
- Should NOT return 404 (Not Found) or 500 (Server Error)

## 🔍 **ENHANCED WEBHOOK SYSTEM**

### **✅ New Features Added**

**1. Enhanced Logging:**
- Detailed environment configuration logging
- Comprehensive error tracking
- Production debugging information

**2. Better Error Handling:**
- Graceful handling of missing environment variables
- Detailed error messages for troubleshooting
- Automatic registration updates with failure status

**3. Configuration Validation:**
- Real-time environment variable checking
- SMTP configuration validation
- PayPal webhook verification

### **✅ Webhook Processing Flow**

```
PayPal Payment → Webhook Triggered → Environment Check → Email Sent → PDF Stored
```

**Enhanced Flow:**
1. **Webhook Received**: PayPal sends PAYMENT.CAPTURE.COMPLETED
2. **Environment Check**: Validates all required environment variables
3. **Registration Fetch**: Retrieves customer data from Sanity
4. **Email Generation**: Creates professional PDF receipt
5. **Email Delivery**: Sends to customer's email address
6. **PDF Storage**: Uploads PDF to Sanity backend
7. **Status Update**: Updates registration with delivery status

## 📋 **TROUBLESHOOTING CHECKLIST**

### **✅ Environment Variables Check**
- [ ] `EMAIL_FROM` is set to `contactus@intelliglobalconferences.com`
- [ ] `EMAIL_FROM_NAME` is set to `Intelli Global Conferences`
- [ ] `PAYPAL_WEBHOOK_ID` is set with actual webhook ID from PayPal
- [ ] All SMTP variables are correctly configured
- [ ] Sanity API token has write permissions

### **✅ PayPal Configuration Check**
- [ ] Webhook URL is publicly accessible
- [ ] Webhook is configured in PRODUCTION PayPal dashboard (not sandbox)
- [ ] Webhook subscribes to `PAYMENT.CAPTURE.COMPLETED` event
- [ ] PayPal client ID/secret are for production (not sandbox)

### **✅ Application Deployment Check**
- [ ] Latest code is deployed to Coolify
- [ ] Environment variables are set in Coolify dashboard
- [ ] Application is running without errors
- [ ] Webhook endpoint responds correctly

## 🧪 **TESTING PROCEDURE**

### **✅ Step 1: Test Webhook Endpoint**
```bash
# Test webhook accessibility
curl -X POST https://yourdomain.com/api/paypal/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

### **✅ Step 2: Check Application Logs**
- Monitor Coolify application logs
- Look for webhook received messages
- Check for environment configuration logs

### **✅ Step 3: Test Real Payment**
1. Make a small test payment ($1-5)
2. Monitor application logs during payment
3. Check if webhook is received
4. Verify email is sent to customer
5. Confirm PDF is stored in Sanity

## 🚨 **COMMON ISSUES AND SOLUTIONS**

### **❌ Issue 1: Webhook Not Received**
**Symptoms:** No webhook logs in application
**Solution:**
- Verify webhook URL is publicly accessible
- Check PayPal webhook configuration
- Ensure webhook is configured in production (not sandbox)

### **❌ Issue 2: Environment Variables Not Found**
**Symptoms:** "Missing required email configuration" error
**Solution:**
- Add missing environment variables in Coolify
- Restart application after adding variables
- Verify variables are correctly spelled

### **❌ Issue 3: SMTP Authentication Failed**
**Symptoms:** "SMTP connection failed" error
**Solution:**
- Verify SMTP credentials are correct
- Check email provider settings
- Test SMTP connection manually

### **❌ Issue 4: Registration Not Found**
**Symptoms:** "Registration not found" error
**Solution:**
- Verify PayPal custom_id matches Sanity registration ID
- Check Sanity API token permissions
- Ensure registration exists in Sanity database

## 📧 **EMAIL DELIVERY VERIFICATION**

### **✅ Success Indicators**
- Application logs show "✅ REAL payment receipt sent successfully"
- Customer receives email with PDF attachment
- PDF shows correct registration type (Sponsorship/Regular)
- PDF is stored in Sanity backend
- Registration table shows PDF download button

### **✅ Failure Indicators**
- Application logs show "❌ CRITICAL: Failed to send automatic payment receipt"
- No email received by customer
- Error messages in application logs
- Registration not updated with email status

## 🎯 **IMMEDIATE ACTION PLAN**

### **✅ Priority 1: Fix Environment Variables**
1. Add `EMAIL_FROM=contactus@intelliglobalconferences.com` to Coolify
2. Add `EMAIL_FROM_NAME=Intelli Global Conferences` to Coolify
3. Restart application in Coolify

### **✅ Priority 2: Configure PayPal Webhook**
1. Get webhook ID from PayPal dashboard
2. Add `PAYPAL_WEBHOOK_ID` to Coolify environment variables
3. Verify webhook URL is accessible

### **✅ Priority 3: Test Complete Flow**
1. Make a test payment
2. Monitor application logs
3. Verify email delivery
4. Check PDF storage in Sanity

## 📞 **SUPPORT INFORMATION**

### **✅ Log Monitoring**
- Check Coolify application logs during payment
- Look for webhook processing messages
- Monitor email sending attempts

### **✅ Manual Intervention**
- If automatic emails fail, use manual email button on success page
- Download PDFs from Sanity registration table
- Send receipts manually if needed

### **✅ Production Monitoring**
- Set up log monitoring for webhook events
- Monitor email delivery success rates
- Track PDF storage success rates

**After implementing these fixes, automatic emails should be sent to customers immediately after PayPal payment completion.**
