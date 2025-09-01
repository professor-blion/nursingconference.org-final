const { createClient } = require('@sanity/client');

// Initialize Sanity client with current credentials
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'skcr4aPHPIYzjJ7NNTdIkI9uxSjcOYLwV53fRkJAgW65cTOYxGlOFh01cyzEKPNbj5P0tTCJmgBh0WOqkY9YDcTglklLQzuurFTvLbZ4Q9oRQBd7DqFX7m1WMGRyFhUP6QRqEHSA9ROVDlXx63i2kIqZ6u00eOMbzjNyNCB5Ek6iVtfdNYgk',
  apiVersion: '2023-05-03'
});

async function fixBrochureCompleteSolution() {
  console.log('🔧 COMPLETE BROCHURE SOLUTION\n');
  console.log('=' .repeat(50));

  try {
    // 1. Verify Sanity connection
    console.log('1️⃣ VERIFYING SANITY CONNECTION...');
    const connectionTest = await client.fetch('*[_type == "siteSettings"][0]._id');
    console.log('✅ Sanity connection verified');

    // 2. Check current brochure settings
    console.log('\n2️⃣ CHECKING BROCHURE SETTINGS...');
    const currentSettings = await client.fetch(`
      *[_type == "brochureSettings"] {
        _id,
        title,
        active,
        downloadCount,
        heroBackgroundImage {
          asset-> {
            _id,
            url
          }
        },
        pdfFile {
          asset-> {
            _id,
            url,
            originalFilename
          }
        }
      }
    `);

    console.log(`📊 Found ${currentSettings.length} brochureSettings documents`);

    let activeSettings = null;
    
    if (currentSettings.length === 0) {
      console.log('❌ No brochure settings found. Creating default...');
      
      const defaultSettings = {
        _type: 'brochureSettings',
        title: 'Diabetes Conference Brochure',
        description: 'Download our comprehensive diabetes conference brochure to learn more about the event, speakers, and opportunities.',
        active: true,
        downloadCount: 0,
        heroOverlayOpacity: 60,
        lastUpdated: new Date().toISOString()
      };

      activeSettings = await client.create(defaultSettings);
      console.log(`✅ Created default brochure settings: ${activeSettings._id}`);
    } else {
      // Use the first settings document
      activeSettings = currentSettings[0];
      console.log(`📋 Using existing settings: ${activeSettings._id}`);
      
      // Ensure it's active
      if (!activeSettings.active) {
        console.log('🔧 Activating brochure settings...');
        await client.patch(activeSettings._id).set({ active: true }).commit();
        console.log('✅ Brochure settings activated');
      }
    }

    // 3. Test the exact API query that's failing
    console.log('\n3️⃣ TESTING API QUERY...');
    const apiQuery = `*[_type == "brochureSettings" && active == true][0] {
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

    const apiResult = await client.fetch(apiQuery);
    
    if (!apiResult) {
      console.log('❌ API query failed - no active settings found');
      return;
    }

    console.log('✅ API query successful');
    console.log(`📋 Document ID: ${apiResult._id}`);
    console.log(`📋 Title: ${apiResult.title}`);
    console.log(`📋 Active: ${apiResult.active}`);
    console.log(`📋 Has PDF: ${!!apiResult.pdfFile?.asset}`);

    // 4. Check PDF file status
    console.log('\n4️⃣ PDF FILE STATUS...');
    if (!apiResult.pdfFile?.asset) {
      console.log('❌ PDF FILE MISSING - THIS IS THE ROOT CAUSE OF 503 ERROR');
      console.log('\n🚨 CRITICAL ISSUE IDENTIFIED:');
      console.log('   The brochure form fails because no PDF file is uploaded');
      console.log('   API route returns 503 "Brochure file is not available"');
      console.log('   This happens at line 133-137 in /api/brochure/submit/route.ts');
      
      console.log('\n🔧 IMMEDIATE SOLUTION REQUIRED:');
      console.log('1. Go to: https://nursing-conference-final-cms.sanity.studio/');
      console.log('2. Login with your Sanity credentials');
      console.log('3. Find "Brochure Settings" in the left sidebar');
      console.log('4. Click on the brochure settings document');
      console.log('5. Find "PDF Brochure File" field');
      console.log('6. Upload a PDF file (any PDF for testing)');
      console.log('7. Click "Publish" to save changes');
      console.log('8. Test the brochure form again');
      
      console.log('\n📝 FOR TESTING, YOU CAN:');
      console.log('- Create a simple PDF using Word/Google Docs');
      console.log('- Name it "diabetes-conference-brochure.pdf"');
      console.log('- Upload this temporary file to test functionality');
      console.log('- Replace with actual brochure later');
      
    } else {
      console.log('✅ PDF FILE FOUND');
      console.log(`📋 PDF URL: ${apiResult.pdfFile.asset.url}`);
      console.log(`📋 PDF Name: ${apiResult.pdfFile.asset.originalFilename}`);
      console.log(`📋 PDF Size: ${Math.round(apiResult.pdfFile.asset.size / 1024)} KB`);
      console.log('\n🎉 BROCHURE SHOULD BE WORKING!');
    }

    // 5. Test page-level query
    console.log('\n5️⃣ TESTING PAGE-LEVEL QUERY...');
    const pageQuery = `*[_type == "brochureSettings"][0] {
      title,
      description,
      heroBackgroundImage {
        asset-> {
          _id,
          url
        }
      },
      heroOverlayOpacity,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename
        }
      }
    }`;

    const pageResult = await client.fetch(pageQuery);
    
    if (pageResult) {
      console.log('✅ Page query successful');
      console.log(`📋 Has Hero Image: ${!!pageResult.heroBackgroundImage?.asset}`);
      console.log(`📋 Has PDF: ${!!pageResult.pdfFile?.asset}`);
      
      if (!pageResult.heroBackgroundImage?.asset) {
        console.log('\n⚠️  OPTIONAL: Hero background image missing');
        console.log('   This won\'t cause errors but page will use default gradient');
        console.log('   Upload a hero image in Sanity Studio for better appearance');
      }
    }

    // 6. Final summary
    console.log('\n6️⃣ FINAL SUMMARY');
    console.log('=' .repeat(40));
    
    const hasPdf = !!(apiResult?.pdfFile?.asset);
    const hasHero = !!(pageResult?.heroBackgroundImage?.asset);
    
    console.log(`✅ Sanity Connection: Working`);
    console.log(`✅ Brochure Settings: Active`);
    console.log(`${hasPdf ? '✅' : '❌'} PDF File: ${hasPdf ? 'Available' : 'MISSING (CAUSES 503 ERROR)'}`);
    console.log(`${hasHero ? '✅' : '⚠️ '} Hero Image: ${hasHero ? 'Available' : 'Missing (optional)'}`);
    
    if (hasPdf) {
      console.log('\n🎉 BROCHURE FUNCTIONALITY IS READY!');
      console.log('🧪 Test at: http://localhost:3000/brochure');
      console.log('📝 Fill out the form and submit to download PDF');
    } else {
      console.log('\n🚨 ACTION REQUIRED: Upload PDF file in Sanity Studio');
      console.log('📍 Location: Brochure Settings > PDF Brochure File');
      console.log('🔗 Studio URL: https://diabetesconference-final.sanity.studio/');
    }

    // 7. Configuration verification
    console.log('\n7️⃣ CONFIGURATION VERIFICATION');
    console.log('✅ Project ID: fl5uetho');
    console.log('✅ Dataset: production');
    console.log('✅ API Version: 2023-05-03');
    console.log('✅ API Token: Configured');
    console.log('✅ Sanity Client: Working');
    console.log('✅ GROQ Queries: Functional');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n🔧 TROUBLESHOOTING:');
    console.error('1. Check internet connection');
    console.error('2. Verify Sanity project ID: fl5uetho');
    console.error('3. Verify API token is correct');
    console.error('4. Check if Sanity Studio is accessible');
  }
}

// Run the complete solution
fixBrochureCompleteSolution();