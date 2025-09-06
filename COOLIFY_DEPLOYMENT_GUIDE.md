# 🚀 Coolify Deployment Guide for Event Website

## 📋 Prerequisites
- Coolify instance running
- GitHub repository connected
- Docker support enabled

## 🔧 Deployment Configuration

### 1. **Project Structure**
```
Event-website/
├── Dockerfile                 # Docker configuration for deployment
├── .dockerignore             # Files to exclude from Docker build
├── nextjs-frontend/          # Next.js application
│   ├── package.json
│   ├── next.config.ts        # Configured with standalone output
│   └── src/
└── SanityBackend/           # Sanity CMS (not deployed)
```

### 2. **Environment Variables Required**

#### **Essential Variables:**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### **Required for Brochure Downloads:**
```env
SANITY_API_TOKEN=skJxcOEM55Yxtn04BIQ5Cf3gJ0oW58CtryfVcIPnWjsohKhxu0BNDG1psGawYEl4TVmq24g42dbILVm1SvB1CAPfd54X2AmV8YV6sKsNUId0JbwEi90k1gW6tnSvFjJxBpgW8xmpsUvM82hPjmgqQHhrGqEQ3rExNHYpOm7qLWThEeTS8D0n
```

#### **Optional Variables (for additional functionality):**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_here
RAZORPAY_SECRET_KEY=your_secret_here
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=your_from_email
```

### 3. **Coolify Configuration**

#### **Build Settings:**
- **Build Command**: `docker build -t event-website .`
- **Start Command**: `docker run -p 3000:3000 event-website`
- **Port**: `3000`
- **Health Check**: `/api/health` (if implemented)

#### **Docker Configuration:**
- Uses multi-stage build for optimization
- Node.js 18 Alpine base image
- Standalone Next.js output for minimal container size
- Non-root user for security

### 4. **Deployment Process**

1. **Push to GitHub**: Changes automatically trigger deployment
2. **Docker Build**: Coolify builds using the Dockerfile
3. **Container Start**: Application runs on port 3000
4. **Health Check**: Coolify monitors application health

## 🔍 Troubleshooting

### **Common Issues:**

#### **404 Error on Deployment**
- **Cause**: Application not starting properly
- **Solution**: Check environment variables and build logs

#### **Build Failures**
- **Cause**: Missing dependencies or configuration errors
- **Solution**: Review Dockerfile and package.json

#### **Payment Features Not Working**
- **Cause**: Missing Razorpay environment variables
- **Solution**: Add optional payment environment variables

### **Debugging Steps:**
1. Check Coolify deployment logs
2. Verify environment variables are set
3. Test Docker build locally
4. Check application health endpoint

## 📊 Features Available

### **With Basic Configuration:**
✅ Static pages (Home, About, Contact)  
✅ Conference listings from Sanity  
✅ Hero sections and content  
✅ Navigation and responsive design  
✅ FAQ sections  

### **With Full Configuration:**
✅ Contact form submissions  
✅ Payment processing (Razorpay)  
✅ Email notifications  
✅ Admin features  

## 🎯 Next Steps After Deployment

1. **Test the deployed website**
2. **Configure optional environment variables** for full functionality
3. **Set up monitoring** and alerts
4. **Configure custom domain** if needed
5. **Set up SSL certificate** through Coolify

## 📞 Support

If you encounter issues:
1. Check Coolify deployment logs
2. Verify all environment variables
3. Test the Docker build locally
4. Review this guide for common solutions
