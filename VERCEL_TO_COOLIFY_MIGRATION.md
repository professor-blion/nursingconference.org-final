# 🔄 VERCEL TO COOLIFY MIGRATION GUIDE

## 📋 MIGRATION OVERVIEW

**Previous Setup:**
- Platform: Vercel
- DNS: d30392757f5f4f6b.vercel-dns-017.com
- Multiple CAA records for SSL certificates

**New Setup:**
- Platform: Coolify
- URL: http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io/
- IP Address: 31.97.203.190

---

## 🚨 STEP 1: DNS RECORDS MIGRATION

### **DELETE These Records:**
```
Type: CNAME
Name: www
Value: d30392757f5f4f6b.vercel-dns-017.com
TTL: 300
❌ DELETE THIS

Type: CAA
Name: @
Value: 0 issue "digicert.com"
❌ DELETE THIS

Type: CAA  
Name: @
Value: 0 issue "sectigo.com"
❌ DELETE THIS

Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
❌ DELETE THIS

Type: CAA
Name: @
Value: 0 issue "globalsign.com"
❌ DELETE THIS

Type: CAA
Name: @
Value: 0 issue "comodoca.com"
❌ DELETE THIS

[Delete all other CAA records shown in your screenshot]
```

### **ADD These Records:**
```
Type: A
Name: @
Value: 31.97.203.190
TTL: 300
✅ ADD THIS

Type: A
Name: www
Value: 31.97.203.190
TTL: 300
✅ ADD THIS

Type: CNAME (Optional)
Name: coolify
Value: icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io
TTL: 300
✅ ADD THIS (for subdomain access)
```

---

## 🔧 STEP 2: COOLIFY ENVIRONMENT SETUP

### **Access Coolify Dashboard:**
1. Go to your Coolify dashboard
2. Navigate to your project
3. Click "Environment Variables" tab

### **REQUIRED Environment Variables:**
```bash
# Core Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
```

### **OPTIONAL Environment Variables:**
```bash
# Sanity Write Access (for admin features)
SANITY_API_TOKEN=your_sanity_token_here

# Payment Integration (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET_KEY=your_razorpay_secret

# Email System (SMTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=your_from_email

# UPI Testing (if needed)
NEXT_PUBLIC_UPI_TEST_MODE=true
NEXT_PUBLIC_UPI_TEST_ID=test@upi
```

---

## 🐳 STEP 3: DEPLOYMENT CONFIGURATION

### **Coolify Settings:**
```yaml
# Application Settings
Port: 3000
Health Check Path: /api/health
Restart Policy: unless-stopped

# Build Configuration
Build Command: docker build -t event-website .
Start Command: npm start

# Resource Limits (adjust as needed)
Memory: 512MB
CPU: 0.5 cores
```

---

## ✅ STEP 4: VERIFICATION CHECKLIST

### **1. Test Migration Script:**
```bash
node test-coolify-migration.js
```

### **2. Manual Verification:**
- [ ] **Basic Access**: http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io/
- [ ] **Health Check**: /api/health
- [ ] **Environment**: /api/debug-env
- [ ] **Conferences API**: /api/conferences
- [ ] **Sponsorship Tiers**: /api/sponsorship-tiers
- [ ] **Site Settings**: /api/site-settings

### **3. Functionality Tests:**
- [ ] **Homepage loads** with proper styling
- [ ] **Navigation works** between pages
- [ ] **Sanity data displays** correctly
- [ ] **Images load** from Sanity CDN
- [ ] **Contact forms** submit (if configured)
- [ ] **Payment system** works (if configured)

---

## 🔍 STEP 5: TROUBLESHOOTING

### **Common Issues:**

**1. Environment Variables Not Loading:**
```bash
# Check in Coolify logs:
echo "NODE_ENV: $NODE_ENV"
echo "SANITY_PROJECT_ID: $NEXT_PUBLIC_SANITY_PROJECT_ID"
```

**2. Build Failures:**
```bash
# Ensure Dockerfile exists and is correct
# Check build logs in Coolify dashboard
```

**3. API Endpoints Failing:**
```bash
# Test Sanity connection:
curl http://your-url/api/debug-env
```

**4. DNS Propagation:**
```bash
# Check DNS propagation:
nslookup your-domain.com
dig your-domain.com
```

---

## 📞 STEP 6: POST-MIGRATION

### **1. Update External References:**
- Update any hardcoded Vercel URLs in code
- Update webhook URLs in external services
- Update API endpoint references

### **2. Monitor Performance:**
- Check Coolify logs for errors
- Monitor response times
- Verify SSL certificate installation

### **3. Backup Verification:**
- Ensure Sanity data is accessible
- Test all critical user flows
- Verify payment processing (if applicable)

---

## 🎯 SUCCESS CRITERIA

✅ **Migration Complete When:**
- DNS points to Coolify (31.97.203.190)
- All environment variables set
- Application builds and starts successfully
- All API endpoints respond correctly
- Sanity integration works
- Frontend displays properly
- No console errors in browser

---

## 🆘 ROLLBACK PLAN

**If Issues Occur:**
1. **Immediate**: Change DNS back to Vercel
2. **Investigate**: Check Coolify logs and configuration
3. **Fix**: Resolve issues and re-attempt migration
4. **Verify**: Run full test suite before switching DNS again
