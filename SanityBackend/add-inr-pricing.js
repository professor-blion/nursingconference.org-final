const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  // token: process.env.SANITY_API_TOKEN, // Comment out for now to test read access
  apiVersion: '2023-05-03',
});

// USD to INR conversion rate (approximate)
const USD_TO_INR_RATE = 83.0;

async function addINRPricingToRegistrationTypes() {
  try {
    console.log('🚀 Starting INR pricing addition...');

    // Fetch all registration types
    const registrationTypes = await client.fetch(`
      *[_type == "registrationTypes"] {
        _id,
        name,
        earlyBirdPrice,
        nextRoundPrice,
        onSpotPrice,
        earlyBirdPriceINR,
        nextRoundPriceINR,
        onSpotPriceINR
      }
    `);

    console.log(`📊 Found ${registrationTypes.length} registration types`);

    // Update each registration type with INR pricing
    for (const regType of registrationTypes) {
      // Skip if INR pricing already exists
      if (regType.earlyBirdPriceINR && regType.nextRoundPriceINR && regType.onSpotPriceINR) {
        console.log(`⏭️  Skipping ${regType.name} - INR pricing already exists`);
        continue;
      }

      // Calculate INR prices based on USD prices
      const earlyBirdPriceINR = Math.round(regType.earlyBirdPrice * USD_TO_INR_RATE);
      const nextRoundPriceINR = Math.round(regType.nextRoundPrice * USD_TO_INR_RATE);
      const onSpotPriceINR = Math.round(regType.onSpotPrice * USD_TO_INR_RATE);

      console.log(`💰 Adding INR pricing to ${regType.name}:`);
      console.log(`   Early Bird: $${regType.earlyBirdPrice} → ₹${earlyBirdPriceINR}`);
      console.log(`   Next Round: $${regType.nextRoundPrice} → ₹${nextRoundPriceINR}`);
      console.log(`   On Spot: $${regType.onSpotPrice} → ₹${onSpotPriceINR}`);

      // Update the document
      await client
        .patch(regType._id)
        .set({
          earlyBirdPriceINR,
          nextRoundPriceINR,
          onSpotPriceINR,
        })
        .commit();

      console.log(`✅ Updated ${regType.name} with INR pricing`);
    }

    console.log('🎉 INR pricing addition completed successfully!');

  } catch (error) {
    console.error('❌ Error adding INR pricing:', error);
  }
}

// Run the script
addINRPricingToRegistrationTypes();