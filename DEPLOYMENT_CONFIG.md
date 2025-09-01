# 🚀 DEPLOYMENT CONFIGURATION FOR COOLIFY

## 📋 **ENVIRONMENT VARIABLES FOR COOLIFY**

Copy and paste these environment variables into your Coolify deployment:

### **🔧 REQUIRED VARIABLES (CRITICAL)**

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=sk5ZJnKnmbkzR8oiue5pXEvOZly20Km0ZHRnc4ywpg8HPby9N3wipoQsOHMSIIj1yTF0dtccBarQQsL2P0YwmP5Uf8QeoHP44FleIkjPXotKSmGPwzkdpDjC2nA1Fbic5W5QnQeghKuQTfnsqLKIWvP4q5idSUpopClvl0BLJcAJTQeBZoQy

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contactus@intelliglobalconferences.com
SMTP_PASS=Muni@12345m
FROM_EMAIL=contactus@intelliglobalconferences.com

# Application Configuration
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

### **🔧 OPTIONAL VARIABLES (PAYMENT GATEWAYS)**

```bash
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_SECRET_KEY=your_razorpay_secret_key_here

# PayPal Configuration (if needed)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production

# Development/Testing
NEXT_PUBLIC_UPI_TEST_MODE=true
```

---

## 🏗️ **DEPLOYMENT SETTINGS**

### **📁 Build Configuration**
```yaml
Build Command: npm run build
Start Command: npm start
Port: 3000
Node Version: 18.x or higher
```

### **📂 Project Structure**
```
Repository: https://github.com/professor-blion/Nursingconferences.git
Branch: main
Build Context: ./nextjs-frontend
```

### **🔧 Build Environment**
```bash
# Build-time environment variables
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_UPI_TEST_MODE=true
```

---

## 🎯 **FEATURES ENABLED**

### **✅ Core Functionality**
- ✅ **Registration System**: Complete registration management with Sanity CMS
- ✅ **PDF Receipts**: Automatic generation, email delivery, and Sanity storage
- ✅ **Admin Interface**: Enhanced table with filtering, sorting, CSV export
- ✅ **Email System**: Professional receipts with dynamic branding
- ✅ **Payment Processing**: Razorpay and PayPal integration ready

### **✅ Admin Features**
- ✅ **Registration Management**: View, filter, and export registrations
- ✅ **PDF Downloads**: Download individual or bulk PDF receipts
- ✅ **Search & Filter**: Advanced search by name, email, transaction ID
- ✅ **Status Management**: Track payment statuses and registration types
- ✅ **Data Export**: CSV export with filtered data

### **✅ Production Ready**
- ✅ **Sanity CMS**: Live studio at https://nursing-conferences-cms.sanity.studio/
- ✅ **Database**: Optimized schema with PayPal integration
- ✅ **Security**: Proper CORS, authentication, and API protection
- ✅ **Performance**: Optimized builds and CDN delivery

---

## 🔐 **SECURITY CHECKLIST**

### **✅ Environment Variables**
- ✅ **SANITY_API_TOKEN**: Has write permissions for PDF uploads
- ✅ **SMTP Credentials**: Valid and tested for email delivery
- ✅ **Payment Tokens**: Secure and environment-appropriate
- ✅ **NODE_ENV**: Set to 'production' for live deployment

### **✅ Access Control**
- ✅ **Sanity Studio**: Restricted to authorized users
- ✅ **API Endpoints**: Protected with proper authentication
- ✅ **File Uploads**: Validated and sanitized
- ✅ **CORS Policy**: Configured for production domains

---

## 📊 **MONITORING & VERIFICATION**

### **✅ Health Checks**
```bash
# Application Health
GET /api/health

# Sanity Connection
GET /api/sanity/health

# Email System
GET /api/email/test
```

### **✅ Key URLs**
```bash
# Main Application
https://your-domain.com

# Sanity Studio
https://nursing-conferences-cms.sanity.studio/

# Registration Management
https://nursing-conferences-cms.sanity.studio/structure/registrationSystem

# Enhanced Table
https://nursing-conferences-cms.sanity.studio/structure/registrationSystem;registrationsTableEnhanced
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues & Solutions**

**1. PDF Upload Failures**
```bash
# Check SANITY_API_TOKEN permissions
# Verify token has 'Editor' or 'Admin' role
# Test with: curl -H "Authorization: Bearer $SANITY_API_TOKEN" https://api.sanity.io/v1/projects/n3no08m3
```

**2. Email Delivery Issues**
```bash
# Verify SMTP credentials
# Check SMTP_HOST, SMTP_PORT, SMTP_SECURE settings
# Test email connectivity
```

**3. Build Failures**
```bash
# Ensure all NEXT_PUBLIC_* variables are set at build time
# Check Node.js version compatibility (18.x+)
# Verify package.json dependencies
```

**4. Sanity Connection Issues**
```bash
# Verify NEXT_PUBLIC_SANITY_* variables
# Check project ID and dataset name
# Ensure API version compatibility
```

---

## 📞 **SUPPORT**

### **Documentation**
- ✅ **Setup Guide**: `REGISTRATION_SYSTEM_CONSOLIDATION.md`
- ✅ **PDF Management**: `PDF_RECEIPT_MANAGEMENT_FIXED.md`
- ✅ **Schema Guide**: `SANITY_SCHEMA_OPTIMIZATION.md`
- ✅ **Access Guide**: `REGISTRATION_TABLE_ACCESS_GUIDE.md`

### **Verification Scripts**
- ✅ **System Check**: `verify-registration-system.js`
- ✅ **PDF Test**: `verify-pdf-download-functionality.js`
- ✅ **Data Validation**: `diagnose-sanity-data-issues.js`

**🎉 Your Nursing Conferences application is ready for production deployment with all enhanced features!**
