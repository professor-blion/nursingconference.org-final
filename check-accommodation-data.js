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

console.log('🏨 Checking Accommodation Data Structure...');

async function checkAccommodationData() {
  try {
    // Fetch all accommodation options with detailed room pricing
    const accommodations = await client.fetch(`*[_type == 'accommodationOptions'] {
      _id,
      hotelName,
      hotelCategory,
      roomOptions[] {
        roomType,
        pricePerNight,
        pricePerNightEUR,
        pricePerNightGBP,
        roomDescription,
        maxGuests,
        isAvailable
      },
      isActive,
      displayOrder
    } | order(displayOrder asc)`);
    
    console.log(`\n📊 Found ${accommodations.length} accommodation options:`);
    
    accommodations.forEach((hotel, index) => {
      console.log(`\n${index + 1}. ${hotel.hotelName} (${hotel.hotelCategory})`);
      console.log(`   Active: ${hotel.isActive ? '✅' : '❌'}`);
      
      if (hotel.roomOptions && hotel.roomOptions.length > 0) {
        console.log(`   Room Options (${hotel.roomOptions.length}):`);
        
        hotel.roomOptions.forEach((room, roomIndex) => {
          const hasEUR = room.pricePerNightEUR !== undefined && room.pricePerNightEUR !== null;
          const hasGBP = room.pricePerNightGBP !== undefined && room.pricePerNightGBP !== null;
          
          console.log(`     ${roomIndex + 1}. ${room.roomType}`);
          console.log(`        USD: $${room.pricePerNight || 'N/A'}`);
          console.log(`        EUR: €${room.pricePerNightEUR || 'N/A'} ${hasEUR ? '✅' : '❌'}`);
          console.log(`        GBP: £${room.pricePerNightGBP || 'N/A'} ${hasGBP ? '✅' : '❌'}`);
          console.log(`        Available: ${room.isAvailable ? '✅' : '❌'}`);
        });
      } else {
        console.log(`   ❌ No room options defined`);
      }
    });
    
    // Check if any accommodation needs multi-currency updates
    const needsUpdate = accommodations.some(hotel => 
      hotel.roomOptions?.some(room => 
        !room.pricePerNightEUR || !room.pricePerNightGBP
      )
    );
    
    console.log(`\n🔍 ANALYSIS:`);
    console.log(`Total accommodations: ${accommodations.length}`);
    console.log(`Multi-currency update needed: ${needsUpdate ? '❌ YES' : '✅ NO'}`);
    
    if (needsUpdate) {
      console.log(`\n⚠️  Some accommodations are missing EUR/GBP pricing`);
      console.log(`💡 Need to populate multi-currency data`);
    } else {
      console.log(`\n✅ All accommodations have complete multi-currency pricing`);
    }
    
  } catch (error) {
    console.error('❌ Failed to check accommodation data:', error.message);
  }
}

checkAccommodationData();
