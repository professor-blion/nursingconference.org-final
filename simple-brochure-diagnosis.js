const { createClient } = require('@sanity/client');

// Initialize Sanity client with current credentials
const client = createClient({
  projectId: 'sqpmeuqp',
  dataset: 'production',
  useCdn: false,
  token: 'skcr4aPHPIYzjJ7NNTdIkI9uxSjcOYLwV53fRkJAgW65cTOYxGlOFh01cyzEKPNbj5P0tTCJmgBh0WOqkY9YDcTglklLQzuurFTvLbZ4Q9oRQBd7DqFX7m1WMGRyFhUP6QRqEHSA9ROVDlXx63i2kIqZ6u00eOMbzjNyNCB5Ek6iVtfdNYgk',
  apiVersion: '2023-05-03'
});

async function simpleBrochureDiagnosis() {
  console.log('🔍 SIMPLE BROCHURE DIAGNOSIS\n');

  try {
    // 1. Test basic connection and get all brochure settings
    console.log('1️⃣ CHECKING BROCHURE SETTINGS...');
    const allSettings = await client.fetch(`*[_type == "brochureSettings"]`);
    console.log(`✅ Found ${allSettings.length} brochureSettings documents`);

    if (allSettings.length === 0) {
      console.log('❌ NO BROCHURE SETTINGS FOUND');
      console.log('🔧 CREATING DEFAULT SETTINGS...');
      
      const defaultSettings = {
        _type: 'brochureSettings',
        title: 'Diabetes Conference Brochure',
        description: 'Download our comprehensive diabetes conference brochure.',
        active: true,
        downloadCount: 0,
        heroOverlayOpacity: 60
      };

      const created = await client.create(defaultSettings);
      console.log(`✅ Created: ${created._id}`);
      
      console.log('\n🚨 UPLOAD PDF FILE REQUIRED:');
      console.log('1. Go to: https://diabetesconference-final.sanity.studio/');
      console.log('2. Find "Brochure Settings"');
      console.log('3. Upload PDF file');
      console.log('4. Save changes');
      return;
    }

    // 2. Check detailed settings
    console.log('\n2️⃣ DETAILED ANALYSIS...');
    const detailedSettings = await client.fetch(`
      *[_type == "brochureSettings"][0] {
        _id,
        title,
        active,
        downloadCount,
        heroBackgroundImage {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        pdfFile {
          asset-> {
            _id,
            url,
            originalFilename,
            size
          }
        }
      }
    `);

    if (!detailedSettings) {
      console.log('❌ No detailed settings found');
      return;
    }

    console.log(`📋 Settings ID: ${detailedSettings._id}`);
    console.log(`📋 Title: ${detailedSettings.title}`);
    console.log(`📋 Active: ${detailedSettings.active}`);
    console.log(`📋 Downloads: ${detailedSettings.downloadCount || 0}`);
    console.log(`📋 Has Hero Image: ${!!detailedSettings.heroBackgroundImage?.asset}`);
    console.log(`📋 Has PDF File: ${!!detailedSettings.pdfFile?.asset}`);

    // 3. Test the exact API query that fails
    console.log('\n3️⃣ TESTING API QUERY (EXACT FROM SUBMIT ROUTE)...');
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
      console.log('❌ API QUERY RETURNED NULL');
      console.log('🔍 Checking if document is inactive...');
      
      // Check if document exists but is inactive
      const inactiveCheck = await client.fetch(`*[_type == "brochureSettings"][0]`);
      if (inactiveCheck) {
        console.log(`📋 Found document but active = ${inactiveCheck.active}`);
        if (!inactiveCheck.active) {
          console.log('🔧 ACTIVATING DOCUMENT...');
          await client.patch(inactiveCheck._id).set({ active: true }).commit();
          console.log('✅ Document activated');
          
          // Re-test
          const retestResult = await client.fetch(apiQuery);
          if (retestResult) {
            console.log('✅ API QUERY NOW WORKS');
          }
        }
      }
    } else {
      console.log('✅ API QUERY SUCCESSFUL');
      console.log(`📋 Document ID: ${apiResult._id}`);
      console.log(`📋 Has PDF: ${!!apiResult.pdfFile?.asset}`);
      
      if (!apiResult.pdfFile?.asset) {
        console.log('\n❌ PDF FILE MISSING - THIS CAUSES 503 ERROR');
        console.log('🔧 SOLUTION: Upload PDF in Sanity Studio');
      } else {
        console.log('✅ PDF FILE AVAILABLE');
        console.log(`📋 PDF URL: ${apiResult.pdfFile.asset.url}`);
        console.log(`📋 PDF Name: ${apiResult.pdfFile.asset.originalFilename}`);
        console.log(`📋 PDF Size: ${Math.round(apiResult.pdfFile.asset.size / 1024)} KB`);
      }
    }

    // 4. Final diagnosis
    console.log('\n4️⃣ FINAL DIAGNOSIS');
    console.log('=' .repeat(40));
    
    const finalCheck = await client.fetch(apiQuery);
    const hasPdf = !!(finalCheck?.pdfFile?.asset);
    
    if (!finalCheck) {
      console.log('❌ ISSUE: No active brochureSettings found');
      console.log('🔧 FIX: Activate brochureSettings in Sanity Studio');
    } else if (!hasPdf) {
      console.log('❌ ISSUE: PDF file missing (ROOT CAUSE OF 503 ERROR)');
      console.log('🔧 FIX: Upload PDF file in Sanity Studio');
      console.log('📍 Location: Brochure Settings > PDF Brochure File');
    } else {
      console.log('✅ BROCHURE SHOULD BE WORKING');
      console.log('🧪 Test at: http://localhost:3000/brochure');
    }

  } catch (error) {
    console.error('❌ DIAGNOSIS ERROR:', error.message);
  }
}

// Run the diagnosis
simpleBrochureDiagnosis();