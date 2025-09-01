# 🚀 COOLIFY ENVIRONMENT VARIABLES CONFIGURATION

## 📋 **COMPLETE Environment Variables for Production Deployment**

### **🔧 CORE APPLICATION SETTINGS (REQUIRED)**

```bash
# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0

# Base URL Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### **🗄️ SANITY CMS CONFIGURATION (REQUIRED)**

```bash
# Sanity Project Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# Sanity API Token (for write operations and dynamic content)
SANITY_API_TOKEN=your_sanity_api_token_here
```

### **💳 PAYPAL PAYMENT CONFIGURATION (REQUIRED)**

```bash
# PayPal Production Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_client_secret
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CURRENCY=USD

# PayPal Webhook Configuration
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
```

### **📧 EMAIL CONFIGURATION (REQUIRED)**

```bash
# SMTP Configuration for Payment Receipts
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contactus@intelliglobalconferences.com
SMTP_PASS=your_smtp_password_here

# Email Sender Configuration
EMAIL_FROM=contactus@intelliglobalconferences.com
EMAIL_FROM_NAME=Intelli Global Conferences
```

### **🔐 SECURITY CONFIGURATION (OPTIONAL)**

```bash
# JWT Secret for authentication (if using auth)
JWT_SECRET=your_jwt_secret_here

# API Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### **📊 ANALYTICS & MONITORING (OPTIONAL)**

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Sentry Error Tracking
SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_DSN=your_public_sentry_dsn_here
```

---

## 🔑 **HOW TO GET REQUIRED VALUES**

### **1. Sanity API Token**
1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project (`fl5uetho`)
3. Go to **API** → **Tokens**
4. Create a new token with **Editor** permissions
5. Copy the token value

### **2. PayPal Production Credentials**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Switch to **Live** environment
3. Create a new app or use existing
4. Copy **Client ID** and **Client Secret**
5. Set up webhooks for payment notifications

### **3. SMTP Configuration**
- Use your hosting provider's SMTP settings
- For Hostinger: `smtp.hostinger.com`, port `465`, SSL enabled
- Create email account: `contactus@intelliglobalconferences.com`

---

## 🚀 **COOLIFY DEPLOYMENT STEPS**

### **Step 1: Add Environment Variables**
1. Open your Coolify dashboard
2. Go to your application settings
3. Navigate to **Environment Variables**
4. Add each variable from the lists above

### **Step 2: Required Variables (Minimum)**
```bash
NODE_ENV=production
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contactus@intelliglobalconferences.com
SMTP_PASS=your_smtp_password
```

### **Step 3: Deploy Application**
1. Save environment variables
2. Trigger deployment
3. Monitor logs for any configuration errors

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Sanity CMS connection working
- [ ] PayPal payments processing correctly
- [ ] Email receipts being sent
- [ ] Dynamic content loading from Sanity
- [ ] Real payment data in receipts
- [ ] No test/hardcoded values in production

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**

1. **Sanity Connection Failed**
   - Verify `SANITY_API_TOKEN` has correct permissions
   - Check project ID matches your Sanity project

2. **PayPal Payments Not Working**
   - Ensure using production credentials, not sandbox
   - Verify webhook URL is configured in PayPal

3. **Emails Not Sending**
   - Check SMTP credentials are correct
   - Verify email account exists and is active
   - Test SMTP connection manually

4. **Environment Variables Not Loading**
   - Restart application after adding variables
   - Check variable names match exactly (case-sensitive)

---

## 📞 **SUPPORT**

If you encounter issues:
1. Check Coolify application logs
2. Verify all environment variables are set
3. Test individual components (Sanity, PayPal, Email)
4. Contact support with specific error messages
