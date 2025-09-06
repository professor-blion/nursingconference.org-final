# 🚀 Production Email Deployment Guide for Coolify

## 📋 **CRITICAL DEPLOYMENT CHECKLIST**

### ✅ **Step 1: Environment Variables Configuration**

**In your Coolify application settings, add these environment variables:**

```bash
# SMTP Configuration (CRITICAL)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contactus@intelliglobalconferences.com
SMTP_PASS=Muni@12345m

# Email Settings
FROM_EMAIL=contactus@intelliglobalconferences.com
FROM_NAME="Intelli Global Conferences"

# Application Environment
NODE_ENV=production

# PayPal Production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_client_secret
PAYPAL_BASE_URL=https://api-m.paypal.com

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Application URL
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your_secure_random_string
```

### ✅ **Step 2: Test Email System Before Deployment**

**Run this command locally to verify email configuration:**

```bash
node test-production-email-system.js
```

**Expected output:**
```
🧪 TESTING PRODUCTION EMAIL SYSTEM...
✅ All required environment variables are set
✅ Primary SMTP configuration successful!
✅ Test email sent successfully!
🎉 EMAIL SYSTEM TEST COMPLETE!
```

### ✅ **Step 3: Deploy to Coolify**

1. **Push all changes to GitHub:**
   ```bash
   git add .
   git commit -m "Enhanced production email system with SMTP verification and error handling"
   git push origin main
   ```

2. **In Coolify:**
   - Go to your application settings
   - Add all environment variables from Step 1
   - **CRITICAL:** Ensure `SMTP_PASS=Muni@12345m` is set correctly
   - Deploy the application

### ✅ **Step 4: Verify Production Email Delivery**

**After deployment, check these logs in Coolify:**

1. **Look for SMTP verification logs:**
   ```
   🔍 Verifying SMTP connection...
   ✅ SMTP connection verified successfully
   ```

2. **Monitor payment capture logs:**
   ```
   📧 Initiating REAL payment receipt email for registration: [ID]
   ✅ REAL payment receipt email sent successfully
   ```

3. **Check for error patterns:**
   ```
   ❌ SMTP verification failed: [error details]
   🔧 SMTP Configuration Issue - Check environment variables
   ```

## 🔧 **TROUBLESHOOTING PRODUCTION ISSUES**

### **Issue 1: SMTP Connection Fails**

**Symptoms:**
```
❌ SMTP verification failed: connect ECONNREFUSED
```

**Solutions:**
1. **Check Coolify firewall settings:**
   - Ensure outbound connections to `smtp.hostinger.com:465` are allowed
   - Try alternative port 587 if 465 is blocked

2. **Verify environment variables:**
   ```bash
   # In Coolify container terminal:
   echo $SMTP_HOST
   echo $SMTP_PORT
   echo $SMTP_USER
   echo $SMTP_PASS
   ```

3. **Test network connectivity:**
   ```bash
   # In Coolify container:
   telnet smtp.hostinger.com 465
   ```

### **Issue 2: Authentication Failures**

**Symptoms:**
```
❌ SMTP verification failed: Invalid login
```

**Solutions:**
1. **Verify SMTP credentials:**
   - Confirm `contactus@intelliglobalconferences.com` exists
   - Verify password `Muni@12345m` is correct
   - Check if email provider requires app-specific passwords

2. **Test with alternative SMTP:**
   - System automatically tries port 587 if 465 fails
   - Monitor logs for alternative configuration attempts

### **Issue 3: Emails Not Delivered**

**Symptoms:**
```
✅ SMTP connection verified successfully
✅ REAL payment receipt email sent successfully
# But clients don't receive emails
```

**Solutions:**
1. **Check spam/junk folders**
2. **Verify email content and headers**
3. **Monitor email provider logs**
4. **Test with different recipient domains**

## 📊 **MONITORING AND MAINTENANCE**

### **Production Monitoring Commands**

**1. Check email delivery status:**
```bash
# In Coolify logs, search for:
grep "payment receipt email" /var/log/application.log
```

**2. Monitor SMTP health:**
```bash
# Look for SMTP verification patterns:
grep "SMTP.*verif" /var/log/application.log
```

**3. Track email delivery metrics:**
```bash
# Search for successful deliveries:
grep "Email delivery metrics" /var/log/application.log
```

### **Key Performance Indicators**

- **Email Delivery Success Rate:** >95%
- **SMTP Connection Success:** 100%
- **Average Email Delivery Time:** <30 seconds
- **PDF Generation Success:** >98%

## 🚨 **EMERGENCY PROCEDURES**

### **If Email System Completely Fails:**

1. **Immediate Actions:**
   ```bash
   # Check environment variables
   # Verify SMTP credentials
   # Test network connectivity
   # Review application logs
   ```

2. **Fallback Options:**
   - Use Gmail SMTP as backup
   - Manual email sending for critical receipts
   - Contact email provider support

3. **Recovery Steps:**
   ```bash
   # Update SMTP configuration
   # Redeploy application
   # Test with sample transaction
   # Monitor for 24 hours
   ```

## 📧 **TESTING PRODUCTION EMAIL SYSTEM**

### **Automated Test Script**

**Run this after deployment:**

```bash
# SSH into Coolify container
cd /app
node test-production-email-system.js
```

### **Manual Test Process**

1. **Complete a test payment transaction**
2. **Check recipient email inbox**
3. **Verify PDF attachment quality**
4. **Test print functionality**
5. **Confirm email formatting**

## 🎯 **SUCCESS CRITERIA**

**✅ Email system is working correctly when:**

1. **SMTP verification passes:** `✅ SMTP connection verified successfully`
2. **Emails are delivered:** Recipients receive emails within 30 seconds
3. **PDFs are attached:** Professional PDF receipts are included
4. **Print formatting works:** PDFs print with correct layout and colors
5. **Error handling works:** System gracefully handles failures
6. **Monitoring is active:** Logs provide clear delivery status

## 📞 **SUPPORT CONTACTS**

**For production email issues:**
- **Application Logs:** Check Coolify application logs first
- **SMTP Issues:** Contact Hostinger support
- **PayPal Integration:** Check PayPal developer dashboard
- **Sanity CMS:** Verify Sanity API connectivity

---

## 🔄 **DEPLOYMENT VERIFICATION STEPS**

**After completing deployment:**

1. ✅ All environment variables set in Coolify
2. ✅ Application deployed successfully
3. ✅ SMTP verification passes in logs
4. ✅ Test payment transaction completed
5. ✅ Receipt email delivered to test address
6. ✅ PDF attachment opens correctly
7. ✅ Print formatting is professional
8. ✅ Production monitoring is active

**🎉 PRODUCTION EMAIL SYSTEM IS READY!**
