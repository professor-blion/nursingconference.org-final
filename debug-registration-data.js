const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fl5uetho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function debugRegistrationData() {
  try {
    console.log('🔍 Fetching registration data...')
    
    // First, let's get a single registration to see the structure
    const singleRegistration = await client.fetch(`
      *[_type == "conferenceRegistration"][0] {
        _id,
        registrationId,
        registrationType,
        personalDetails,
        selectedRegistrationName,
        selectedRegistrationType,
        sponsorshipDetails,
        accommodationDetails,
        accommodationOption,
        pricing
      }
    `)
    
    console.log('📋 Single Registration Structure:')
    console.log(JSON.stringify(singleRegistration, null, 2))
    
    // Let's also check what sponsorship tiers exist
    const sponsorshipTiers = await client.fetch(`
      *[_type == "sponsorshipTiers"] {
        _id,
        name,
        tierName,
        displayName,
        price
      }
    `)
    
    console.log('\n💎 Available Sponsorship Tiers:')
    console.log(JSON.stringify(sponsorshipTiers, null, 2))
    
    // Check accommodation options
    const accommodationOptions = await client.fetch(`
      *[_type == "accommodationOptions"] {
        _id,
        hotelName,
        roomOptions
      }
    `)
    
    console.log('\n🏨 Available Accommodation Options:')
    console.log(JSON.stringify(accommodationOptions, null, 2))
    
    // Let's try the full query with proper references
    const fullQuery = `*[_type == "conferenceRegistration"] | order(registrationDate desc) [0..2] {
      _id,
      registrationId,
      registrationType,
      personalDetails {
        title,
        firstName,
        lastName,
        email,
        phoneNumber,
        country,
        fullPostalAddress
      },
      selectedRegistrationName,
      selectedRegistrationType-> {
        name,
        category
      },
      sponsorshipDetails {
        sponsorshipTier-> {
          _id,
          name,
          tierName,
          price,
          displayName
        },
        companyName
      },
      accommodationDetails {
        accommodationType,
        accommodationNights
      },
      accommodationOption {
        hotel-> {
          _id,
          hotelName,
          roomOptions[] {
            roomType,
            pricePerNight
          }
        },
        roomType,
        nights,
        checkInDate,
        checkOutDate
      },
      pricing {
        registrationPrice,
        accommodationPrice,
        totalPrice,
        currency,
        pricingPeriod,
        participantCategory
      },
      paymentStatus,
      paymentId,
      registrationDate,
      numberOfParticipants
    }`
    
    const fullRegistrations = await client.fetch(fullQuery)
    
    console.log('\n📊 Full Registration Data (first 2 records):')
    console.log(JSON.stringify(fullRegistrations, null, 2))
    
  } catch (error) {
    console.error('❌ Error fetching data:', error)
  }
}

debugRegistrationData()
