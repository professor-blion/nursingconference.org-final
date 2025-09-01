# Sanity Webhook Setup for Real-time Frontend Updates

## Overview
To ensure that changes made in the Sanity backend immediately reflect on the Next.js frontend, you need to set up webhooks that trigger revalidation when content is updated.

## Step-by-Step Webhook Configuration

### 1. Access Sanity Management Console
1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Log in with your Sanity account
3. Select your project: **Eventapp** (Project ID: `fl5uetho`)

### 2. Navigate to Webhooks
1. In the project dashboard, click on **"API"** in the left sidebar
2. Click on **"Webhooks"** tab
3. Click **"Create webhook"** button

### 3. Configure the Webhook

#### Basic Settings:
- **Name**: `Next.js Revalidation Webhook`
- **Description**: `Triggers cache revalidation when content changes`
- **URL**: `http://localhost:3000/api/revalidate` (for development)
  - For production, use your actual domain: `https://yourdomain.com/api/revalidate`

#### Trigger Settings:
- **Dataset**: `production`
- **Trigger on**: Select **"Create"**, **"Update"**, and **"Delete"**
- **Filter**: Leave empty to trigger on all document changes, or use:
  ```groq
  _type in ["siteSettings", "conferenceEvent", "aboutUs", "heroSection"]
  ```

#### HTTP Settings:
- **Method**: `POST`
- **HTTP Headers**: (Optional, but recommended for security)
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_SECRET_TOKEN
  ```

#### Payload:
- **Include drafts**: `No` (only trigger on published content)
- **Projection**: Use this to send relevant data:
  ```groq
  {
    "_type": _type,
    "_id": _id,
    "slug": slug
  }
  ```

### 4. Test the Webhook

#### Option A: Use Sanity's Test Feature
1. After creating the webhook, click **"Test webhook"**
2. This will send a test payload to your endpoint
3. Check your Next.js console for revalidation logs

#### Option B: Make a Real Change
1. Go to your Sanity Studio: `http://localhost:3333`
2. Edit any content in Site Settings
3. Publish the changes
4. Check if the frontend updates automatically

### 5. Webhook Security (Recommended)

#### Add Webhook Secret Validation:
1. In the webhook configuration, add a custom header:
   ```
   X-Webhook-Secret: your-secret-key-here
   ```

2. Update your revalidation API to validate the secret:
   ```typescript
   // In /api/revalidate/route.ts
   const webhookSecret = request.headers.get('x-webhook-secret');
   if (webhookSecret !== process.env.WEBHOOK_SECRET) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

3. Add the secret to your environment variables:
   ```bash
   # In .env.local
   WEBHOOK_SECRET=your-secret-key-here
   ```

## Alternative: Manual Revalidation

If webhooks are not working, you can manually trigger revalidation:

### Method 1: API Endpoint
Visit: `http://localhost:3000/api/revalidate-manual`

### Method 2: Browser Console
```javascript
fetch('/api/revalidate-manual', { method: 'GET' })
  .then(res => res.json())
  .then(data => console.log('Revalidation result:', data));
```

### Method 3: Command Line
```bash
curl http://localhost:3000/api/revalidate-manual
```

## Troubleshooting

### Common Issues:

1. **Webhook not triggering**:
   - Check the webhook URL is correct
   - Ensure your Next.js server is running
   - Verify the webhook is enabled in Sanity

2. **Changes not reflecting**:
   - Check browser cache (hard refresh: Ctrl+F5)
   - Verify the revalidation API is working
   - Check Next.js console for error logs

3. **CORS issues**:
   - Webhooks should work fine, but if testing locally, ensure your dev server accepts external requests

### Debug Steps:

1. **Check webhook delivery**:
   - In Sanity webhook settings, check the "Deliveries" tab
   - Look for successful/failed delivery attempts

2. **Check Next.js logs**:
   - Look for revalidation messages in your terminal
   - Check for any error messages

3. **Test manual revalidation**:
   - Use the manual endpoint to verify revalidation works
   - If manual works but webhook doesn't, it's a webhook configuration issue

## Current Configuration Status

✅ **Revalidation API**: Configured and working
✅ **Manual revalidation**: Available at `/api/revalidate-manual`
✅ **Cache invalidation**: Implemented with 30-second cache duration
✅ **Error handling**: Comprehensive logging and error responses

⚠️ **Webhook**: Needs to be configured in Sanity Management Console

## Next Steps

1. Set up the webhook in Sanity Management Console using the instructions above
2. Test the webhook by making changes in Sanity Studio
3. Verify that changes appear on the frontend within 30 seconds
4. For production, update the webhook URL to your live domain

Once the webhook is configured, all changes made in Sanity will automatically trigger cache revalidation, ensuring your frontend always displays the latest content!
