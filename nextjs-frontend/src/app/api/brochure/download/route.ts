import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Use environment variables for configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'fl5uetho';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-05-03';

const client = createClient({
  projectId,
  dataset,
  useCdn: true, // Use CDN for read operations
  apiVersion,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const downloadId = searchParams.get('downloadId');

    console.log('📄 Processing brochure download request...');
    console.log('Download ID:', downloadId);

    // Fetch active brochure settings
    const brochureSettingsQuery = `*[_type == "brochureSettings" && active == true][0] {
      _id,
      title,
      description,
      pdfFile {
        asset -> {
          _id,
          url,
          originalFilename,
          size,
          mimeType
        }
      },
      active
    }`;

    const brochureSettings = await client.fetch(brochureSettingsQuery);

    if (!brochureSettings || !brochureSettings.active) {
      return NextResponse.json(
        { error: 'Brochure downloads are currently not available.' },
        { status: 503, headers: corsHeaders }
      );
    }

    if (!brochureSettings.pdfFile || !brochureSettings.pdfFile.asset) {
      return NextResponse.json(
        { error: 'Brochure file is not available.' },
        { status: 503, headers: corsHeaders }
      );
    }

    // If downloadId is provided, verify it exists (optional security check)
    if (downloadId) {
      const downloadRecord = await client.fetch(
        `*[_type == "brochureDownload" && _id == $downloadId][0]`,
        { downloadId }
      );

      if (!downloadRecord) {
        console.warn('⚠️ Invalid download ID provided:', downloadId);
        // Still allow download but log the issue
      }
    }

    const pdfAsset = brochureSettings.pdfFile.asset;
    
    console.log('✅ Serving brochure download');
    console.log('File:', pdfAsset.originalFilename);
    console.log('Size:', pdfAsset.size);

    // Return the PDF file URL for direct download
    // The client can use this URL to download the file directly
    return NextResponse.json({
      success: true,
      downloadUrl: pdfAsset.url,
      filename: pdfAsset.originalFilename || 'brochure.pdf',
      size: pdfAsset.size,
      mimeType: pdfAsset.mimeType || 'application/pdf',
      title: brochureSettings.title,
      description: brochureSettings.description,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error serving brochure download:', error);

    return NextResponse.json(
      {
        error: 'Failed to serve brochure download. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Alternative endpoint to serve the file directly (if needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { downloadId } = body;

    console.log('📄 Direct file serve request...');
    console.log('Download ID:', downloadId);

    // Fetch active brochure settings
    const brochureSettingsQuery = `*[_type == "brochureSettings" && active == true][0] {
      _id,
      title,
      pdfFile {
        asset -> {
          _id,
          url,
          originalFilename,
          size,
          mimeType
        }
      },
      active
    }`;

    const brochureSettings = await client.fetch(brochureSettingsQuery);

    if (!brochureSettings || !brochureSettings.active) {
      return NextResponse.json(
        { error: 'Brochure downloads are currently not available.' },
        { status: 503, headers: corsHeaders }
      );
    }

    if (!brochureSettings.pdfFile || !brochureSettings.pdfFile.asset) {
      return NextResponse.json(
        { error: 'Brochure file is not available.' },
        { status: 503, headers: corsHeaders }
      );
    }

    // Verify download record exists
    if (downloadId) {
      const downloadRecord = await client.fetch(
        `*[_type == "brochureDownload" && _id == $downloadId][0]`,
        { downloadId }
      );

      if (!downloadRecord) {
        return NextResponse.json(
          { error: 'Invalid download request.' },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    const pdfAsset = brochureSettings.pdfFile.asset;

    // Fetch the actual file content from Sanity CDN
    const fileResponse = await fetch(pdfAsset.url);
    
    if (!fileResponse.ok) {
      throw new Error('Failed to fetch PDF file from CDN');
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const filename = pdfAsset.originalFilename || 'brochure.pdf';

    console.log('✅ Serving PDF file directly');
    console.log('File:', filename);
    console.log('Size:', fileBuffer.byteLength);

    // Return the PDF file directly
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': pdfAsset.mimeType || 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error serving PDF file directly:', error);

    return NextResponse.json(
      {
        error: 'Failed to serve PDF file. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch download info or POST to download file directly.' },
    { status: 405, headers: corsHeaders }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch download info or POST to download file directly.' },
    { status: 405, headers: corsHeaders }
  );
}
