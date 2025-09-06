# Conference Registration System

A comprehensive conference registration system built with Next.js 15, Sanity CMS, and Razorpay payment integration.

## 🚀 Features

### Frontend Features
- **Responsive Registration Form** - Works seamlessly on desktop, tablet, and mobile
- **Dynamic Pricing System** - Date-based pricing (Early Bird, Next Round, Spot Registration)
- **Real-time Price Calculation** - Instant updates as users make selections
- **Form Validation** - Client-side and server-side validation with detailed error messages
- **Payment Integration** - Secure Razorpay payment gateway integration
- **Sponsorship Options** - Comprehensive sponsorship tiers with automatic option management
- **Accommodation Booking** - Hotel selection with room type and package options

### Backend Features
- **Sanity CMS Integration** - Full admin control over all registration settings
- **API Routes** - RESTful APIs for registration, payment, and admin functions
- **Payment Webhooks** - Automatic payment status updates via Razorpay webhooks
- **Admin Dashboard** - Complete registration management with search, filter, and export
- **Data Export** - CSV export functionality for registration data

### Admin Features
- **Registration Settings Management** - Control dates, pricing, and form settings
- **Registration Types Management** - Create and manage different registration categories
- **Sponsorship Tiers Management** - Configure sponsorship packages and benefits
- **Accommodation Management** - Manage hotel options and room configurations
- **Registration Monitoring** - Real-time dashboard with statistics and status tracking

## 📁 File Structure

```
nextjs-frontend/
├── src/app/
│   ├── registration/
│   │   └── page.tsx                 # Main registration form
│   ├── payment/
│   │   ├── page.tsx                 # Payment processing page
│   │   └── success/
│   │       └── page.tsx             # Payment success confirmation
│   ├── admin/
│   │   └── registrations/
│   │       └── page.tsx             # Admin dashboard
│   └── api/
│       ├── registration/
│       │   └── route.ts             # Registration API endpoints
│       ├── payment/
│       │   ├── razorpay/
│       │   │   └── route.ts         # Razorpay payment API
│       │   └── webhook/
│       │       └── route.ts         # Payment webhook handler
│       └── admin/
│           └── registrations/
│               └── route.ts         # Admin API endpoints

SanityBackend/
├── schemaTypes/
│   ├── registrationSettings.ts     # Registration configuration schema
│   ├── registrationTypes.ts        # Registration type schema
│   ├── sponsorshipTiersRegistration.ts # Sponsorship tier schema
│   ├── accommodationOptions.ts     # Accommodation schema
│   └── conferenceRegistration.ts   # Registration record schema
└── deskStructure.js                # Sanity Studio structure
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_SECRET_KEY=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### 2. Install Dependencies

The required packages are already installed:
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation resolvers
- `zod` - Schema validation
- `razorpay` - Payment processing (install if needed)

If you need to install Razorpay:
```bash
npm install razorpay @types/razorpay
```

### 3. Sanity Backend Setup

The Sanity schemas are already created in the `SanityBackend` directory. To populate sample data:

```bash
# Set your Sanity API token
export SANITY_API_TOKEN=your_sanity_api_token

# Run the data population script
node populate-registration-data.js
```

### 4. Razorpay Setup

1. Create a Razorpay account at https://razorpay.com/
2. Get your test API keys from the dashboard
3. Configure webhook URL: `https://yourdomain.com/api/payment/webhook`
4. Add webhook events: `payment.captured`, `payment.failed`, `order.paid`

## 🎯 Usage Guide

### For Users (Registration Process)

1. **Access Registration**: Navigate to `/registration`
2. **Fill Personal Details**: Complete all required fields
3. **Select Registration Type**: Choose from available options
4. **Choose Sponsorship** (Optional): Select sponsorship tier if applicable
5. **Select Accommodation** (Optional): Choose hotel and room options
6. **Review & Submit**: Verify details and submit registration
7. **Make Payment**: Complete payment via Razorpay
8. **Confirmation**: Receive confirmation and registration details

### For Admins (Management)

#### Sanity Studio Management
1. Access your Sanity Studio
2. Navigate to "Registration System" section
3. Configure:
   - **Registration Settings**: Dates, pricing periods, contact info
   - **Registration Types**: Different registration categories and pricing
   - **Sponsorship Tiers**: Sponsorship packages and benefits
   - **Accommodation Options**: Hotels, rooms, and packages

#### Admin Dashboard
1. Access `/admin/registrations` (requires authentication)
2. View registration statistics and summaries
3. Search and filter registrations
4. Export registration data to CSV
5. Monitor payment statuses

## 🔧 Configuration Options

### Pricing Periods
Configure in Sanity Studio under "Registration Settings":
- **Early Bird**: Discounted pricing for early registrations
- **Next Round**: Standard pricing for mid-period registrations
- **Spot Registration**: Premium pricing for last-minute registrations

### Registration Types
Each type includes:
- Name and description
- Category classification
- Pricing for all periods (academia/business rates)
- Benefits and inclusions
- Availability dates
- Maximum participants

### Sponsorship Tiers
Configure sponsorship packages with:
- Tier name and level
- Pricing
- Benefits and descriptions
- Package inclusions (registration, accommodation)
- Display order and styling

### Accommodation Options
Hotel management includes:
- Hotel details and categories
- Room types and pricing
- Package options with inclusions
- Amenities and policies
- Booking deadlines

## 🔒 Security Features

- **Form Validation**: Client and server-side validation
- **Payment Security**: Razorpay signature verification
- **Admin Authentication**: Basic authentication for admin routes
- **Webhook Verification**: Secure webhook signature validation
- **Data Sanitization**: Input sanitization and validation

## 📊 Analytics & Reporting

### Admin Dashboard Metrics
- Total registrations count
- Payment status breakdown
- Revenue tracking
- Registration trends

### Export Capabilities
- CSV export of all registration data
- Filterable data exports
- Payment transaction records

## 🚨 Error Handling

### Frontend Error Handling
- Form validation errors with specific messages
- Payment failure handling with retry options
- Network error recovery
- User-friendly error displays

### Backend Error Handling
- API error responses with detailed messages
- Payment webhook error logging
- Database operation error handling
- Graceful failure recovery

## 🔄 Payment Flow

1. **Registration Submission**: User submits registration form
2. **Order Creation**: System creates Razorpay order
3. **Payment Processing**: User completes payment via Razorpay
4. **Payment Verification**: System verifies payment signature
5. **Status Update**: Registration status updated to completed
6. **Confirmation**: User receives confirmation page
7. **Webhook Processing**: Automatic status updates via webhooks

## 📱 Responsive Design

The registration system is fully responsive and works on:
- **Desktop**: Full-featured experience with optimal layout
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Streamlined mobile-first design

## 🎨 Styling & Theming

- **Consistent Design**: Matches existing website theme
- **Tailwind CSS**: Utility-first CSS framework
- **Color Scheme**: Blue primary with green accents for registration
- **Typography**: Consistent with existing header styling
- **Spacing**: Responsive spacing that matches site standards

## 🔧 Customization

### Adding New Registration Types
1. Go to Sanity Studio
2. Navigate to "Registration Types"
3. Create new type with pricing and benefits
4. Set display order and availability

### Modifying Pricing Periods
1. Update "Registration Settings" in Sanity
2. Modify pricing dates
3. System automatically switches pricing based on dates

### Adding Payment Methods
1. Configure additional methods in Razorpay dashboard
2. Update payment settings in Sanity Studio
3. Methods will be available in payment flow

## 🐛 Troubleshooting

### Common Issues

**Registration Form Not Loading**
- Check Sanity API connection
- Verify environment variables
- Check browser console for errors

**Payment Failures**
- Verify Razorpay API keys
- Check webhook configuration
- Review payment logs in Razorpay dashboard

**Admin Dashboard Access Issues**
- Verify admin credentials in environment variables
- Check authentication headers
- Ensure proper API route configuration

### Debug Mode
Enable debug logging by adding to your environment:
```env
NODE_ENV=development
DEBUG=true
```

## 📞 Support

For technical support or questions:
- **Email**: intelliglobalconferences@gmail.com
- **Phone**: +919876543210

## 🚀 Deployment

### Production Checklist
- [ ] Update environment variables for production
- [ ] Configure production Razorpay keys
- [ ] Set up webhook URLs
- [ ] Configure admin authentication
- [ ] Test payment flow end-to-end
- [ ] Verify email notifications (if configured)
- [ ] Set up monitoring and logging

### Environment Variables for Production
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_SECRET_KEY=your_live_secret_key
ADMIN_PASSWORD=secure_production_password
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📈 Future Enhancements

Potential improvements for future versions:
- Email confirmation system
- PDF receipt generation
- Multi-language support
- Advanced reporting dashboard
- Integration with calendar systems
- Automated reminder emails
- QR code generation for tickets
- Mobile app integration

---

**Built with ❤️ for Intelli Global Conferences**
