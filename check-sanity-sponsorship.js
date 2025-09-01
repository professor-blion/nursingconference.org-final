#!/usr/bin/env node

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function checkSponsorshipData() {
  try {
    console.log('🔍 Checking Sanity CMS for sponsorship data...\n');

    // First, let's see what document types exist that contain "sponsor"
    console.log('📋 Checking all document types with "sponsor" in the name...');
    const allDocs = await client.fetch(`*[_type match "*sponsor*"] {
      _type,
      _id,
      tierName,
      tierLevel,
      price,
      isActive
    }`);

    console.log(`Found ${allDocs.length} documents with "sponsor" in type name:`);
    allDocs.forEach((doc, index) => {
      console.log(`${index + 1}. Type: ${doc._type}`);
      console.log(`   ID: ${doc._id}`);
      console.log(`   Name: ${doc.tierName || 'N/A'}`);
      console.log(`   Level: ${doc.tierLevel || 'N/A'}`);
      console.log(`   Price: $${doc.price || 'N/A'}`);
      console.log(`   Active: ${doc.isActive || 'N/A'}`);
      console.log('');
    });

    // Check specifically for sponsorshipTiersRegistration
    console.log('🎯 Checking sponsorshipTiersRegistration documents...');
    const regSponsors = await client.fetch(`*[_type == "sponsorshipTiersRegistration"] {
      _id,
      tierName,
      tierLevel,
      price,
      isActive,
      displayOrder
    }`);

    console.log(`Found ${regSponsors.length} sponsorshipTiersRegistration documents:`);
    regSponsors.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.tierName} (${doc.tierLevel})`);
      console.log(`   Price: $${doc.price}`);
      console.log(`   Active: ${doc.isActive}`);
      console.log(`   Display Order: ${doc.displayOrder}`);
      console.log('');
    });

    // Check for other possible sponsorship document types
    console.log('🔍 Checking for other sponsorship document types...');
    const otherTypes = await client.fetch(`*[_type match "*tier*" || _type match "*Tier*"] {
      _type,
      _id,
      tierName,
      tierLevel,
      price,
      isActive
    }`);

    console.log(`Found ${otherTypes.length} documents with "tier" in type name:`);
    otherTypes.forEach((doc, index) => {
      console.log(`${index + 1}. Type: ${doc._type}`);
      console.log(`   Name: ${doc.tierName || 'N/A'}`);
      console.log(`   Level: ${doc.tierLevel || 'N/A'}`);
      console.log(`   Price: $${doc.price || 'N/A'}`);
      console.log('');
    });

    // List all document types to see what's available
    console.log('📊 All document types in the dataset:');
    const allTypes = await client.fetch(`array::unique(*[]._type)`);
    console.log(allTypes.sort().join(', '));

  } catch (error) {
    console.error('❌ Error checking Sanity data:', error);
  }
}

checkSponsorshipData();
