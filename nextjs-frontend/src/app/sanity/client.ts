import { createClient } from "next-sanity";

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fl5uetho";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  throw new Error("Missing SANITY_PROJECT_ID environment variable");
}

if (!dataset) {
  throw new Error("Missing SANITY_DATASET environment variable");
}

// Log Sanity configuration only in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Sanity Client Configuration:', {
    projectId,
    dataset,
    apiVersion,
    hasToken: !!token,
    tokenLength: token ? token.length : 0
  });
}

// Enhanced client configuration for optimal performance
const baseClientConfig = {
  projectId,
  dataset,
  apiVersion,
  perspective: 'published' as const,
  stega: {
    enabled: false,
  },
  // Enhanced retry configuration with exponential backoff
  maxRetries: 3,
  retryDelay: (attempt: number) => Math.min(Math.pow(2, attempt) * 1000, 10000),
};

// Write client configuration with API token
const writeClientConfig = {
  ...baseClientConfig,
  token, // Include the API token for write operations
  useCdn: false, // Never use CDN for write operations
};

// Primary client with CDN optimization
export const client = createClient({
  ...baseClientConfig,
  useCdn: true, // Always use CDN for better performance
  // Request timeout for better UX
  requestTagPrefix: 'sanity',
});

// Client for fresh data when CDN cache needs to be bypassed
export const freshClient = createClient({
  ...baseClientConfig,
  useCdn: false,
  maxRetries: 2,
  retryDelay: (attempt: number) => Math.pow(2, attempt) * 500,
});

// Write client with API token for create/update/delete operations
export const writeClient = createClient(writeClientConfig);

// Log write client status
if (token) {
  console.log('✅ Write client configured with API token');
} else {
  console.warn('⚠️ Write client configured WITHOUT API token - write operations will fail');
}

// Client specifically for header requests - optimized for speed
export const headerClient = createClient({
  ...baseClientConfig,
  useCdn: true, // Use CDN for headers too for better performance
  maxRetries: 1, // Faster failure for headers
  retryDelay: () => 250,
});

// Performance monitoring for Sanity requests
let requestCount = 0;
let totalRequestTime = 0;

export const performanceClient = createClient({
  ...baseClientConfig,
  useCdn: true,
});

// Wrapper function to monitor query performance
export async function monitoredFetch<T>(
  query: string,
  params: any = {},
  options: any = {},
  clientToUse = client
): Promise<T> {
  const startTime = performance.now();
  requestCount++;

  try {
    const result = await clientToUse.fetch<T>(query, params, options);
    const endTime = performance.now();
    const duration = endTime - startTime;
    totalRequestTime += duration;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Sanity Query Performance: ${duration.toFixed(2)}ms`);
      console.log(`📊 Average: ${(totalRequestTime / requestCount).toFixed(2)}ms over ${requestCount} requests`);
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ Sanity Query Failed: ${duration.toFixed(2)}ms`, error);
    }

    throw error;
  }
}

// Test connection function with enhanced error handling
export async function testSanityConnection(): Promise<boolean> {
  try {
    console.warn('🔍 Testing Sanity connection...');
    await client.fetch('*[_type == "siteSettings"][0]._id');
    console.warn('✅ Sanity connection successful');
    return true;
  } catch (error) {
    console.error('❌ Sanity connection test failed:', error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    // Provide troubleshooting guidance
    console.error('🔧 Troubleshooting:');
    console.error('1. Ensure Sanity Studio is running on port 3334');
    console.error('2. Check project ID: n3no08m3');
    console.error('3. Check dataset: production');
    console.error('4. Verify network connectivity');

    return false;
  }
}

// Enhanced connection test with retry logic
export async function testSanityConnectionWithRetry(maxRetries: number = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.warn(`🔄 Connection attempt ${attempt}/${maxRetries}...`);

    const isConnected = await testSanityConnection();
    if (isConnected) {
      return true;
    }

    if (attempt < maxRetries) {
      console.warn(`⏳ Waiting 2 seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.error(`❌ Failed to connect after ${maxRetries} attempts`);
  return false;
}

