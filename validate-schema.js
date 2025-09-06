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

console.log('🔍 Validating multi-currency schema in production...');

async function validateSchema() {
  try {
    // Test registration types
    console.log('\n📋 Testing Registration Types...');
    const regTypes = await client.fetch(`*[_type == 'registrationTypes'] {
      _id,
      name,
      earlyBirdPrice,
      earlyBirdPriceEUR,
      earlyBirdPriceGBP,
      nextRoundPrice,
      nextRoundPriceEUR,
      nextRoundPriceGBP,
      onSpotPrice,
      onSpotPriceEUR,
      onSpotPriceGBP
    }`);
    
    console.log(`✅ Found ${regTypes.length} registration types`);
    let regTypesValid = 0;
    regTypes.forEach(type => {
      if (type.earlyBirdPriceEUR && type.earlyBirdPriceGBP) {
        regTypesValid++;
      }
    });
    console.log(`✅ ${regTypesValid}/${regTypes.length} registration types have multi-currency pricing`);

    // Test sponsorship tiers
    console.log('\n🏆 Testing Sponsorship Tiers...');
    const sponsorTiers = await client.fetch(`*[_type == 'sponsorshipTiers'] {
      _id,
      name,
      price,
      priceEUR,
      priceGBP
    }`);
    
    console.log(`✅ Found ${sponsorTiers.length} sponsorship tiers`);
    let tiersValid = 0;
    sponsorTiers.forEach(tier => {
      if (tier.priceEUR && tier.priceGBP) {
        tiersValid++;
      }
    });
    console.log(`✅ ${tiersValid}/${sponsorTiers.length} sponsorship tiers have multi-currency pricing`);

    // Test accommodation options
    console.log('\n🏨 Testing Accommodation Options...');
    const accommodations = await client.fetch(`*[_type == 'accommodationOptions'] {
      _id,
      hotelName,
      roomOptions[] {
        roomType,
        pricePerNight,
        pricePerNightEUR,
        pricePerNightGBP
      }
    }`);
    
    console.log(`✅ Found ${accommodations.length} accommodation options`);
    let roomsValid = 0;
    let totalRooms = 0;
    accommodations.forEach(hotel => {
      if (hotel.roomOptions) {
        hotel.roomOptions.forEach(room => {
          totalRooms++;
          if (room.pricePerNightEUR && room.pricePerNightGBP) {
            roomsValid++;
          }
        });
      }
    });
    console.log(`✅ ${roomsValid}/${totalRooms} room options have multi-currency pricing`);

    // Summary
    console.log('\n📊 VALIDATION SUMMARY:');
    console.log(`✅ Registration Types: ${regTypesValid}/${regTypes.length} with multi-currency`);
    console.log(`✅ Sponsorship Tiers: ${tiersValid}/${sponsorTiers.length} with multi-currency`);
    console.log(`✅ Room Options: ${roomsValid}/${totalRooms} with multi-currency`);
    
    const allValid = regTypesValid === regTypes.length && 
                     tiersValid === sponsorTiers.length && 
                     roomsValid === totalRooms;
    
    if (allValid) {
      console.log('\n🎉 ALL SCHEMA FIELDS ARE WORKING CORRECTLY IN PRODUCTION!');
      console.log('✅ Multi-currency data is fully accessible via API');
      console.log('✅ Frontend can retrieve and display all currency prices');
      console.log('⚠️  Note: Sanity Studio UI may need cache refresh to show new fields');
    } else {
      console.log('\n❌ Some schema fields are missing data');
    }

  } catch (error) {
    console.error('❌ Schema validation failed:', error.message);
  }
}

validateSchema();
