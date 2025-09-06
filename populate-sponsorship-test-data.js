const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function populateSponsorshipTestData() {
  try {
    console.log('🔍 Fetching sponsorship tiers...')
    
    // Get available sponsorship tiers
    const sponsorshipTiers = await client.fetch(`
      *[_type == "sponsorshipTiers"] {
        _id,
        name,
        price
      }
    `)
    
    console.log('💎 Available tiers:', sponsorshipTiers)
    
    if (sponsorshipTiers.length === 0) {
      console.log('❌ No sponsorship tiers found. Creating some...')
      
      // Create sponsorship tiers
      const goldTier = await client.create({
        _type: 'sponsorshipTiers',
        name: 'Gold',
        price: 99,
        displayName: 'Gold Sponsor'
      })
      
      const diamondTier = await client.create({
        _type: 'sponsorshipTiers',
        name: 'Diamond',
        price: 199,
        displayName: 'Diamond Sponsor'
      })
      
      const platinumTier = await client.create({
        _type: 'sponsorshipTiers',
        name: 'Platinum',
        price: 299,
        displayName: 'Platinum Sponsor'
      })
      
      console.log('✅ Created sponsorship tiers')
      sponsorshipTiers.push(goldTier, diamondTier, platinumTier)
    }
    
    // Get sponsorship registrations that don't have proper tier references
    const sponsorshipRegistrations = await client.fetch(`
      *[_type == "conferenceRegistration" && registrationType == "sponsorship"] {
        _id,
        registrationId,
        sponsorshipDetails,
        selectedOption,
        sponsorType
      }
    `)
    
    console.log(`📋 Found ${sponsorshipRegistrations.length} sponsorship registrations`)
    
    // Update sponsorship registrations with proper tier references
    for (const registration of sponsorshipRegistrations) {
      console.log(`\n🔄 Processing registration: ${registration.registrationId}`)
      
      // Determine which tier to assign based on existing data or randomly
      let tierToAssign = null
      
      if (registration.selectedOption) {
        // Find tier by name matching selectedOption
        tierToAssign = sponsorshipTiers.find(tier => 
          tier.name.toLowerCase() === registration.selectedOption.toLowerCase()
        )
      } else if (registration.sponsorType) {
        // Find tier by name matching sponsorType
        tierToAssign = sponsorshipTiers.find(tier => 
          tier.name.toLowerCase() === registration.sponsorType.toLowerCase()
        )
      }
      
      // If no match found, assign a random tier for testing
      if (!tierToAssign) {
        tierToAssign = sponsorshipTiers[Math.floor(Math.random() * sponsorshipTiers.length)]
        console.log(`   🎲 Randomly assigning: ${tierToAssign.name}`)
      } else {
        console.log(`   ✅ Matched tier: ${tierToAssign.name}`)
      }
      
      // Update the registration with proper sponsorship details
      const updateData = {
        sponsorshipDetails: {
          sponsorshipTier: {
            _type: 'reference',
            _ref: tierToAssign._id
          },
          companyName: `Test Company ${Math.floor(Math.random() * 1000)}`
        },
        // Also set the direct fields for backward compatibility
        sponsorType: tierToAssign.name,
        selectedOption: tierToAssign.name
      }
      
      await client.patch(registration._id).set(updateData).commit()
      console.log(`   ✅ Updated registration with ${tierToAssign.name} tier`)
    }
    
    console.log('\n🎉 Successfully populated sponsorship test data!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

populateSponsorshipTestData()
