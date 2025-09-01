# Sanity Backend Connection Guide

## Overview
This guide ensures your Sanity backend is properly connected to the frontend without disturbing the UI.

## Quick Start

### 1. Start the Complete System
```bash
# Run this command in the EventNextApp-main directory
start-complete-system.bat
```

This will:
- Test the Sanity connection
- Install all dependencies
- Start Sanity Studio on port 3333
- Start the frontend on port 3000

### 2. Manual Startup (Alternative)

#### Start Sanity Backend:
```bash
cd SanityBackend
npm install
npm run dev -- --port 3333
```

#### Start Frontend:
```bash
cd nextjs-frontend
npm install
npm run dev
```

## Connection Testing

### Test Connection Script
```bash
node test-sanity-connection.js
```

### Health Check Endpoint
Visit: `http://localhost:3000/api/health`

### Real-time Status Monitor
- A connection status indicator appears in the bottom-right corner (development mode only)
- Shows real-time connection status for both frontend and backend
- Auto-refreshes every 30 seconds

## Configuration Details

### Sanity Configuration
- **Project ID**: `fl5uetho`
- **Dataset**: `production`
- **API Version**: `2023-05-03`
- **Studio Port**: `3333`
- **Frontend Port**: `3000`

### CORS Settings
The backend is configured to accept connections from:
- `http://localhost:3000`
- `http://localhost:3333`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3333`

## Troubleshooting

### Common Issues

#### 1. "Sanity connection failed"
**Solutions:**
- Ensure Sanity Studio is running on port 3333
- Check if port 3333 is available
- Verify project ID and dataset in configuration
- Check network connectivity

#### 2. "Cannot access Sanity Studio"
**Solutions:**
- Run: `cd SanityBackend && npm run dev -- --port 3333`
- Visit: `http://localhost:3333`
- Check console for error messages

#### 3. "Frontend not loading data"
**Solutions:**
- Check the connection status indicator
- Visit `/api/health` endpoint
- Check browser console for errors
- Verify Sanity Studio is accessible

#### 4. "Real-time updates not working"
**Solutions:**
- Ensure both frontend and backend are running
- Check the revalidation endpoints: `/api/revalidate`
- Verify webhook configuration (if using webhooks)

### Error Handling Features

1. **Automatic Retries**: Connection attempts retry up to 3 times
2. **Graceful Fallbacks**: UI continues to work with cached data
3. **Error Boundaries**: Prevent crashes from connection issues
4. **Real-time Monitoring**: Live connection status updates

## Verification Steps

### 1. Check Services are Running
- Sanity Studio: `http://localhost:3333`
- Frontend App: `http://localhost:3000`
- Health Check: `http://localhost:3000/api/health`

### 2. Test Data Flow
1. Open Sanity Studio (`http://localhost:3333`)
2. Edit any content (e.g., site settings, hero section)
3. Save changes
4. Check frontend (`http://localhost:3000`) for updates
5. Updates should appear within 5-10 seconds

### 3. Monitor Connection Status
- Look for the status indicator in bottom-right corner
- Green = All systems connected
- Yellow = Partial connectivity
- Red = Connection issues

## Files Modified for Better Connectivity

### Backend Files:
- `SanityBackend/sanity.config.ts` - Enhanced CORS and real-time settings
- `start-sanity-backend.bat` - Automated startup script

### Frontend Files:
- `nextjs-frontend/src/app/sanity/client.ts` - Enhanced error handling and retries
- `nextjs-frontend/src/app/layout.tsx` - Added connection monitoring
- `nextjs-frontend/src/app/api/health/route.ts` - Health check endpoint
- `nextjs-frontend/src/app/components/ConnectionStatus.tsx` - Real-time status monitor

### Utility Files:
- `test-sanity-connection.js` - Comprehensive connection testing
- `start-complete-system.bat` - Complete system startup
- `start-frontend.bat` - Frontend-only startup

## Support

If you continue to experience connection issues:

1. Run the connection test: `node test-sanity-connection.js`
2. Check the health endpoint: `http://localhost:3000/api/health`
3. Monitor the real-time status indicator
4. Check browser console and terminal logs for detailed error messages

The system is designed to maintain UI functionality even during temporary connection issues, ensuring a smooth user experience.
