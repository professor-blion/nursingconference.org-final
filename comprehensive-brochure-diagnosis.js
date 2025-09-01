const { createClient } = require('@sanity/client');

// Initialize Sanity client with current credentials
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'skcr4aPHPIYzjJ7NNTdIkI9uxSjcOYLwV53fRkJAgW65cTOYxGlOFh01cyzEKPNbj5P0tTCJmgBh0WOqkY9YDcTglklLQzuurFTvLbZ4Q9oRQBd7DqFX7m1WMGRyFhUP6QRqEHSA9ROVDlXx63i2kIqZ6u00eOMbzjNyNCB5Ek6iVtfdNYgk',
  apiVersion: '2023-05-03'
});

async function comprehensiveBrochureDiagnosis() {
  console.log('🔍 COMPREHENSIVE BROCHURE DIAGNOSIS\n');
  console.log('=' .repeat(60));

  try {
    // 1. Test basic Sanity connection
    console.log('\n1️⃣ TESTING SANITY CONNECTION...');
    const connectionTest = await client.fetch('*[_type == "brochureSettings"] | length');
    console.log(`✅ Sanity connection successful`);
    console.log(`📊 Found ${connectionTest} brochureSettings documents`);

    // 2. Analyze brochureSettings documents
    console.log('\n2️⃣ ANALYZING BROCHURE SETTINGS...');
    const allBrochureSettings = await client.fetch(`
      *[_type == "brochureSettings"] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        description,
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
            size,
            mimeType
          }
        }
      }
    `);

    if (allBrochureSettings.length === 0) {
      console.log('❌ NO BROCHURE SETTINGS FOUND');
      console.log('🔧 CREATING DEFAULT BROCHURE SETTINGS...');
      
      const defaultSettings = {
        _type: 'brochureSettings',
        title: 'Diabetes Conference Brochure',
        description: 'Download our comprehensive diabetes conference brochure to learn more about the event, speakers, and opportunities.',
        active: true,
        downloadCount: 0,
        heroOverlayOpacity: 60,
        lastUpdated: new Date().toISOString()
      };

      const created = await client.create(defaultSettings);
      console.log(`✅ Created default brochure settings: ${created._id}`);
      
      console.log('\n🚨 NEXT STEPS REQUIRED:');
      console.log('1. Go to: https://diabetesconference-final.sanity.studio/');
      console.log('2. Navigate to "Brochure Settings"');
      console.log('3. Upload a PDF file in "PDF Brochure File" field');
      console.log('4. Upload a hero background image (optional)');
      console.log('5. Save/Publish changes');
      return;
    }

    console.log(`✅ Found ${allBrochureSettings.length} brochure settings document(s)`);
    
    allBrochureSettings.forEach((settings, index) => {
      console.log(`\n📋 Document ${index + 1}:`);
      console.log(`   ID: ${settings._id}`);
      console.log(`   Title: ${settings.title}`);
      console.log(`   Active: ${settings.active}`);
      console.log(`   Downloads: ${settings.downloadCount || 0}`);
      console.log(`   Has Hero Image: ${!!settings.heroBackgroundImage?.asset}`);
      console.log(`   Has PDF File: ${!!settings.pdfFile?.asset}`);
      
      if (settings.heroBackgroundImage?.asset) {
        console.log(`   Hero Image URL: ${settings.heroBackgroundImage.asset.url}`);
      }
      
      if (settings.pdfFile?.asset) {
        console.log(`   PDF URL: ${settings.pdfFile.asset.url}`);
        console.log(`   PDF Filename: ${settings.pdfFile.asset.originalFilename}`);
        console.log(`   PDF Size: ${Math.round(settings.pdfFile.asset.size / 1024)} KB`);
      }
    });

    // 3. Test the exact API query that's failing
    console.log('\n3️⃣ TESTING API QUERY (EXACT MATCH)...');
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
      console.log('🔍 POSSIBLE CAUSES:');
      console.log('   - No brochureSettings with active == true');
      console.log('   - Document exists but active field is false/missing');
      
      // Check for inactive documents
      const inactiveQuery = `*[_type == "brochureSettings" && active != true] {
        _id,
        title,
        active
      }`;
      const inactiveResults = await client.fetch(inactiveQuery);
      
      if (inactiveResults.length > 0) {
        console.log('\n🔧 FOUND INACTIVE BROCHURE SETTINGS:');
        inactiveResults.forEach(doc => {
          console.log(`   ID: ${doc._id}, Active: ${doc.active}`);
        });
        
        console.log('\n🔧 ACTIVATING BROCHURE SETTINGS...');
        for (const doc of inactiveResults) {
          await client.patch(doc._id).set({ active: true }).commit();
          console.log(`✅ Activated: ${doc._id}`);
        }
        
        // Re-test the API query
        const retestResult = await client.fetch(apiQuery);
        if (retestResult) {
          console.log('✅ API QUERY NOW SUCCESSFUL AFTER ACTIVATION');
        }
      }
    } else {
      console.log('✅ API QUERY SUCCESSFUL');
      console.log(`   Document ID: ${apiResult._id}`);
      console.log(`   Title: ${apiResult.title}`);
      console.log(`   Active: ${apiResult.active}`);
      console.log(`   Has PDF: ${!!apiResult.pdfFile?.asset}`);
      
      if (!apiResult.pdfFile?.asset) {
        console.log('❌ PDF FILE MISSING - THIS IS THE 503 ERROR CAUSE');
        console.log('🔧 SOLUTION: Upload PDF file in Sanity Studio');
      } else {
        console.log('✅ PDF FILE AVAILABLE');
        console.log(`   PDF URL: ${apiResult.pdfFile.asset.url}`);
      }
    }

    // 4. Test page-level query
    console.log('\n4️⃣ TESTING PAGE-LEVEL QUERY...');
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
      console.log('✅ PAGE QUERY SUCCESSFUL');
      console.log(`   Has Hero Image: ${!!pageResult.heroBackgroundImage?.asset}`);
      console.log(`   Has PDF: ${!!pageResult.pdfFile?.asset}`);
    } else {
      console.log('❌ PAGE QUERY FAILED');
    }

    // 5. Summary and recommendations
    console.log('\n5️⃣ DIAGNOSIS SUMMARY');
    console.log('=' .repeat(40));
    
    const hasActiveSettings = !!apiResult;
    const hasPdfFile = !!(apiResult?.pdfFile?.asset);
    const hasHeroImage = !!(pageResult?.heroBackgroundImage?.asset);
    
    console.log(`✅ Sanity Connection: Working`);
    console.log(`${hasActiveSettings ? '✅' : '❌'} Active Brochure Settings: ${hasActiveSettings ? 'Found' : 'Missing'}`);
    console.log(`${hasPdfFile ? '✅' : '❌'} PDF File: ${hasPdfFile ? 'Available' : 'MISSING (503 ERROR CAUSE)'}`);
    console.log(`${hasHeroImage ? '✅' : '⚠️ '} Hero Image: ${hasHeroImage ? 'Available' : 'Missing (optional)'}`);
    
    if (!hasPdfFile) {
      console.log('\n🚨 ROOT CAUSE OF 503 ERROR:');
      console.log('   The PDF file is missing from brochureSettings');
      console.log('   API returns "Brochure file is not available" (line 135 in submit route)');
      
      console.log('\n🔧 IMMEDIATE SOLUTION:');
      console.log('1. Go to: https://nursing-conference-final-cms.sanity.studio/');
      console.log('2. Find "Brochure Settings" in sidebar');
      console.log('3. Upload PDF file in "PDF Brochure File" field');
      console.log('4. Click "Publish" to save');
      console.log('5. Test brochure form again');
    } else {
      console.log('\n🎉 BROCHURE SHOULD BE WORKING!');
      console.log('   All required components are in place');
    }

  } catch (error) {
    console.error('\n❌ DIAGNOSIS ERROR:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the comprehensive diagnosis
comprehensiveBrochureDiagnosis();