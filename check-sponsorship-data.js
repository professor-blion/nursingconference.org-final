import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './nextjs-frontend/.env.local' });

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

console.log('🏆 Checking Sponsorship Tier Data Structure...');

async function checkSponsorshipData() {
  try {
    // Fetch all sponsorship tiers with detailed pricing
    const sponsorshipTiers = await client.fetch(`*[_type == 'sponsorshipTiers'] {
      _id,
      name,
      price,
      priceEUR,
      priceGBP,
      description,
      benefits,
      color,
      active,
      order,
      featured,
      slug
    } | order(order asc)`);
    
    console.log(`\n📊 Found ${sponsorshipTiers.length} sponsorship tiers:`);
    
    sponsorshipTiers.forEach((tier, index) => {
      console.log(`\n${index + 1}. ${tier.name || 'Unnamed Tier'}`);
      console.log(`   Active: ${tier.active ? '✅' : '❌'}`);
      console.log(`   Order: ${tier.order || 'N/A'}`);
      
      const hasEUR = tier.priceEUR !== undefined && tier.priceEUR !== null;
      const hasGBP = tier.priceGBP !== undefined && tier.priceGBP !== null;
      
      console.log(`   Pricing:`);
      console.log(`     USD: $${tier.price || 'N/A'}`);
      console.log(`     EUR: €${tier.priceEUR || 'N/A'} ${hasEUR ? '✅' : '❌'}`);
      console.log(`     GBP: £${tier.priceGBP || 'N/A'} ${hasGBP ? '✅' : '❌'}`);
      
      if (tier.price && hasEUR && hasGBP) {
        // Check conversion accuracy
        const expectedEUR = Math.round(tier.price * 0.85);
        const expectedGBP = Math.round(tier.price * 0.75);
        
        const eurAccurate = tier.priceEUR === expectedEUR;
        const gbpAccurate = tier.priceGBP === expectedGBP;
        
        console.log(`   Conversion accuracy: EUR ${eurAccurate ? '✅' : '❌'} (${tier.priceEUR} vs ${expectedEUR}), GBP ${gbpAccurate ? '✅' : '❌'} (${tier.priceGBP} vs ${expectedGBP})`);
      }
      
      if (tier.description) {
        console.log(`   Description: ${tier.description.substring(0, 50)}...`);
      }
      
      if (tier.benefits && tier.benefits.length > 0) {
        console.log(`   Benefits: ${tier.benefits.length} items`);
      }
    });
    
    // Check if any sponsorship tier needs multi-currency updates
    const needsUpdate = sponsorshipTiers.some(tier => 
      !tier.priceEUR || !tier.priceGBP
    );
    
    console.log(`\n🔍 ANALYSIS:`);
    console.log(`Total sponsorship tiers: ${sponsorshipTiers.length}`);
    console.log(`Active tiers: ${sponsorshipTiers.filter(t => t.active).length}`);
    console.log(`Multi-currency update needed: ${needsUpdate ? '❌ YES' : '✅ NO'}`);
    
    if (needsUpdate) {
      console.log(`\n⚠️  Some sponsorship tiers are missing EUR/GBP pricing`);
      console.log(`💡 Need to populate multi-currency data`);
    } else {
      console.log(`\n✅ All sponsorship tiers have complete multi-currency pricing`);
    }
    
    // Test the API endpoint that the frontend uses
    console.log(`\n🔗 Testing Frontend API Endpoint...`);
    try {
      const response = await fetch('http://localhost:3001/api/registration/dynamic-config');
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API endpoint accessible`);
        console.log(`📊 API returned ${data.sponsorshipTiers?.length || 0} sponsorship tiers`);
        
        if (data.sponsorshipTiers && data.sponsorshipTiers.length > 0) {
          const firstTier = data.sponsorshipTiers[0];
          console.log(`🔍 First tier from API: ${firstTier.name}`);
          console.log(`   USD: $${firstTier.price}`);
          console.log(`   EUR: €${firstTier.priceEUR || 'N/A'}`);
          console.log(`   GBP: £${firstTier.priceGBP || 'N/A'}`);
        }
      } else {
        console.log(`❌ API endpoint returned ${response.status}`);
      }
    } catch (apiError) {
      console.log(`❌ API endpoint not accessible: ${apiError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to check sponsorship data:', error.message);
  }
}

checkSponsorshipData();
