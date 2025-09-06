import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Validate environment variables
const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';
const token = process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  token,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    if (!token) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Check if brochure settings exist
    const brochureSettingsQuery = `*[_type == "brochureSettings"][0] {
      _id,
      title,
      description,
      pdfFile {
        asset -> {
          _id,
          url,
          originalFilename,
          size
        }
      },
      active,
      downloadCount
    }`;

    const brochureSettings = await client.fetch(brochureSettingsQuery);

    if (!brochureSettings) {
      // Create default brochure settings
      const defaultSettings = {
        _type: 'brochureSettings',
        title: 'Conference Brochure',
        description: 'Download our comprehensive conference brochure to learn more about the event, speakers, and opportunities.',
        active: false, // Set to false until PDF is uploaded
        downloadCount: 0,
        lastUpdated: new Date().toISOString(),
      };

      const result = await client.create(defaultSettings);
      
      return NextResponse.json({
        success: true,
        message: 'Brochure settings created. Please upload a PDF file in Sanity Studio.',
        settings: result,
        needsPdfUpload: true,
        studioUrl: 'https://nursing-conferences-cms.sanity.studio/',
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      settings: brochureSettings,
      hasPdf: !!brochureSettings.pdfFile?.asset,
      isActive: brochureSettings.active,
      downloadCount: brochureSettings.downloadCount || 0,
      studioUrl: 'https://nursing-conferences-cms.sanity.studio/',
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error checking brochure settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to check brochure settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
