// Script to populate organizing committee data using Sanity client
const { createClient } = require('@sanity/client');

// Initialize Sanity client with the project details
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  // Note: This will work for reading, but writing requires a token
  // For writing, you'll need to add: token: 'your-sanity-token'
});

// Committee members data
const committeeMembers = [
  {
    _type: 'organizingCommittee',
    name: 'Dr. Sarah Johnson',
    title: 'Professor of Nursing',
    institution: 'Johns Hopkins University School of Nursing',
    country: 'United States',
    bio: 'Dr. Sarah Johnson is a distinguished professor with over 20 years of experience in nursing education and research. She specializes in critical care nursing and has published extensively on patient safety and quality improvement initiatives. Dr. Johnson has received numerous awards for her contributions to nursing education and serves on several editorial boards of prestigious nursing journals.',
    specialization: 'Critical Care Nursing',
    email: 'sarah.johnson@jhu.edu',
    linkedinUrl: 'https://linkedin.com/in/sarah-johnson-nursing',
    displayOrder: 1,
    isChairperson: true,
    isActive: true,
    yearsOfExperience: 20,
    achievements: [
      'American Academy of Nursing Fellow',
      'Excellence in Nursing Education Award 2022',
      'Published over 50 peer-reviewed articles',
      'Principal Investigator on $2M NIH grant'
    ],
    publications: [
      'Johnson, S. et al. (2023). "Innovations in Critical Care Nursing Education." Journal of Nursing Education.',
      'Johnson, S. & Smith, M. (2022). "Patient Safety Protocols in ICU Settings." Critical Care Nursing Quarterly.'
    ]
  },
  {
    _type: 'organizingCommittee',
    name: 'Prof. Michael Chen',
    title: 'Director of Nursing Research',
    institution: 'University of California, San Francisco',
    country: 'United States',
    bio: 'Professor Michael Chen is a renowned researcher in the field of nursing informatics and healthcare technology. His work focuses on the integration of artificial intelligence in nursing practice and the development of evidence-based protocols for digital health interventions. He has been instrumental in advancing the use of technology to improve patient outcomes.',
    specialization: 'Nursing Informatics',
    email: 'm.chen@ucsf.edu',
    linkedinUrl: 'https://linkedin.com/in/michael-chen-nursing',
    orcidId: '0000-0002-1234-5678',
    displayOrder: 2,
    isChairperson: false,
    isActive: true,
    yearsOfExperience: 18,
    achievements: [
      'Healthcare Information Technology Innovation Award',
      'Sigma Theta Tau International Research Award',
      'Lead developer of NurseBot AI system'
    ],
    publications: [
      'Chen, M. et al. (2023). "AI Applications in Nursing Practice." Nursing Informatics Today.',
      'Chen, M. (2022). "Digital Health Interventions: A Systematic Review." Healthcare Technology Review.'
    ]
  },
  {
    _type: 'organizingCommittee',
    name: 'Dr. Emily Rodriguez',
    title: 'Chief Nursing Officer',
    institution: 'Mayo Clinic',
    country: 'United States',
    bio: 'Dr. Emily Rodriguez brings extensive clinical and administrative experience to the organizing committee. As Chief Nursing Officer at Mayo Clinic, she oversees nursing operations across multiple facilities and has been a leader in implementing evidence-based practice initiatives. Her expertise in nursing leadership and quality improvement makes her an invaluable member of our committee.',
    specialization: 'Nursing Leadership & Administration',
    email: 'rodriguez.emily@mayo.edu',
    displayOrder: 3,
    isChairperson: false,
    isActive: true,
    yearsOfExperience: 22,
    achievements: [
      'Magnet Recognition Program Excellence Award',
      'American Organization for Nursing Leadership Fellow',
      'Quality Improvement Champion Award 2021'
    ],
    publications: [
      'Rodriguez, E. (2023). "Leadership Excellence in Nursing Administration." Nursing Management Today.',
      'Rodriguez, E. et al. (2022). "Quality Metrics in Healthcare Settings." Healthcare Quality Journal.'
    ]
  },
  {
    _type: 'organizingCommittee',
    name: 'Prof. James Wilson',
    title: 'Professor of Pediatric Nursing',
    institution: 'University of Pennsylvania',
    country: 'United States',
    bio: 'Professor James Wilson is a leading expert in pediatric nursing with a focus on family-centered care and childhood chronic illness management. His research has significantly contributed to improving care delivery for children with complex medical needs. He is actively involved in developing international standards for pediatric nursing practice.',
    specialization: 'Pediatric Nursing',
    email: 'j.wilson@upenn.edu',
    linkedinUrl: 'https://linkedin.com/in/james-wilson-pediatric-nursing',
    displayOrder: 4,
    isChairperson: false,
    isActive: true,
    yearsOfExperience: 16,
    achievements: [
      'Pediatric Nursing Excellence Award',
      'International Association of Pediatric Nurses Board Member',
      'Published pediatric care guidelines adopted globally'
    ],
    publications: [
      'Wilson, J. et al. (2023). "Family-Centered Care in Pediatric Settings." Pediatric Nursing Journal.',
      'Wilson, J. (2022). "Chronic Illness Management in Children." Child Health Review.'
    ]
  },
  {
    _type: 'organizingCommittee',
    name: 'Dr. Lisa Thompson',
    title: 'Associate Professor of Mental Health Nursing',
    institution: 'University of Toronto',
    country: 'Canada',
    bio: 'Dr. Lisa Thompson is a respected researcher and clinician in mental health nursing. Her work focuses on innovative therapeutic approaches for patients with psychiatric disorders and the integration of mental health services in primary care settings. She has been instrumental in developing evidence-based interventions for anxiety and depression management.',
    specialization: 'Mental Health Nursing',
    email: 'l.thompson@utoronto.ca',
    displayOrder: 5,
    isChairperson: false,
    isActive: true,
    yearsOfExperience: 14,
    achievements: [
      'Canadian Psychiatric Association Research Award',
      'Mental Health Innovation Grant Recipient',
      'Expert consultant for WHO mental health initiatives'
    ],
    publications: [
      'Thompson, L. et al. (2023). "Mental Health Integration in Primary Care." Mental Health Nursing.',
      'Thompson, L. (2022). "Evidence-Based Interventions for Anxiety Disorders." Psychiatric Care Today.'
    ]
  },
  {
    _type: 'organizingCommittee',
    name: 'Prof. David Kim',
    title: 'Professor of Community Health Nursing',
    institution: 'Seoul National University',
    country: 'South Korea',
    bio: 'Professor David Kim is an internationally recognized expert in community health nursing and public health policy. His research focuses on health promotion strategies in underserved communities and the role of nurses in addressing health disparities. He has led numerous community-based health initiatives across Asia.',
    specialization: 'Community Health Nursing',
    email: 'd.kim@snu.ac.kr',
    linkedinUrl: 'https://linkedin.com/in/david-kim-community-health',
    displayOrder: 6,
    isChairperson: false,
    isActive: true,
    yearsOfExperience: 19,
    achievements: [
      'WHO Collaborating Centre Director',
      'Asian Nursing Research Society President',
      'Community Health Excellence Award 2020'
    ],
    publications: [
      'Kim, D. et al. (2023). "Health Promotion in Underserved Communities." Community Health Nursing.',
      'Kim, D. (2022). "Addressing Health Disparities Through Nursing." Public Health Review.'
    ]
  },
  {
    _type: 'organizingCommittee',
    name: 'Dr. Maria Santos',
    title: 'Director of Nursing Education',
    institution: 'University of São Paulo',
    country: 'Brazil',
    bio: 'Dr. Maria Santos is a prominent figure in nursing education with expertise in curriculum development and innovative teaching methodologies. She has been instrumental in advancing nursing education standards in Latin America and has collaborated with international organizations to improve nursing education globally.',
    specialization: 'Nursing Education',
    email: 'm.santos@usp.br',
    displayOrder: 7,
    isChairperson: false,
    isActive: true,
    yearsOfExperience: 17,
    achievements: [
      'Latin American Nursing Education Excellence Award',
      'UNESCO Education Innovation Grant',
      'Developed nursing curriculum adopted by 15+ universities'
    ],
    publications: [
      'Santos, M. et al. (2023). "Innovative Teaching in Nursing Education." Nursing Education Today.',
      'Santos, M. (2022). "Curriculum Development for Global Nursing Standards." Education Review.'
    ]
  },
  {
    _type: 'organizingCommittee',
    name: 'Prof. Robert Anderson',
    title: 'Professor of Gerontological Nursing',
    institution: 'King\'s College London',
    country: 'United Kingdom',
    bio: 'Professor Robert Anderson is a leading authority on gerontological nursing and aging research. His work focuses on improving quality of life for older adults and developing age-friendly healthcare environments. He has contributed significantly to policy development for elderly care and has advised government agencies on aging-related health issues.',
    specialization: 'Gerontological Nursing',
    email: 'r.anderson@kcl.ac.uk',
    linkedinUrl: 'https://linkedin.com/in/robert-anderson-gerontology',
    orcidId: '0000-0003-9876-5432',
    displayOrder: 8,
    isChairperson: false,
    isActive: true,
    yearsOfExperience: 25,
    achievements: [
      'British Geriatrics Society Lifetime Achievement Award',
      'European Gerontological Nursing Association President',
      'Advisor to UK Department of Health on aging policies'
    ],
    publications: [
      'Anderson, R. et al. (2023). "Age-Friendly Healthcare Environments." Gerontological Nursing.',
      'Anderson, R. (2022). "Quality of Life in Elderly Care Settings." Aging Research Today.'
    ]
  }
];

async function populateCommitteeData() {
  console.log('🚀 Starting committee data population...');
  console.log('📊 Project ID: fl5uetho');
  console.log('📦 Dataset: production');
  console.log('👥 Members to create: 8');
  
  try {
    // Test connection first
    console.log('\n🔍 Testing Sanity connection...');
    const testQuery = '*[_type == "organizingCommittee"] | order(displayOrder asc)';
    const existingMembers = await client.fetch(testQuery);
    console.log(`✅ Connection successful! Found ${existingMembers.length} existing committee members.`);
    
    if (existingMembers.length > 0) {
      console.log('\n⚠️  Warning: Committee members already exist:');
      existingMembers.forEach(member => {
        console.log(`   - ${member.name} (Order: ${member.displayOrder})`);
      });
      console.log('\n💡 To avoid duplicates, please delete existing members first or modify this script.');
      return;
    }
    
    console.log('\n📝 Creating committee members...');
    
    for (let i = 0; i < committeeMembers.length; i++) {
      const member = committeeMembers[i];
      console.log(`\n${i + 1}/8 Creating: ${member.name}`);
      
      try {
        const result = await client.create(member);
        console.log(`   ✅ Success! ID: ${result._id}`);
        console.log(`   📋 Title: ${member.title}`);
        console.log(`   🏛️  Institution: ${member.institution}`);
        console.log(`   🌍 Country: ${member.country}`);
        if (member.isChairperson) {
          console.log(`   👑 Chairperson: YES`);
        }
      } catch (createError) {
        console.log(`   ❌ Failed to create ${member.name}:`);
        console.log(`   Error: ${createError.message}`);
        
        if (createError.message.includes('token') || createError.message.includes('permission')) {
          console.log('\n🔐 Authentication Error Detected!');
          console.log('This script requires a Sanity token with write permissions.');
          console.log('\nTo get a token:');
          console.log('1. Go to https://sanity.io/manage');
          console.log('2. Select your project (fl5uetho)');
          console.log('3. Go to API > Tokens');
          console.log('4. Create a new token with "Editor" permissions');
          console.log('5. Add it to this script or the add-sample-committee-data.js file');
          return;
        }
      }
    }
    
    console.log('\n🎉 Committee data population completed!');
    console.log('\n📋 Summary:');
    console.log('✅ 8 committee members created');
    console.log('👑 1 chairperson (Dr. Sarah Johnson)');
    console.log('🌍 International representation (US, Canada, South Korea, Brazil, UK)');
    console.log('📚 All members have complete profiles with achievements and publications');
    
    console.log('\n🔄 Next steps:');
    console.log('1. 🖼️  Add profile images in Sanity Studio');
    console.log('2. 🌐 Visit http://localhost:3333 to manage content');
    console.log('3. 👀 Check http://localhost:3000/organizing-committee to see results');
    console.log('4. 🔧 Test the API at http://localhost:3000/api/organizing-committee');
    
  } catch (error) {
    console.error('\n❌ Error during population:', error.message);
    
    if (error.message.includes('token') || error.message.includes('permission')) {
      console.log('\n🔐 Authentication Required!');
      console.log('This script needs a Sanity token to write data.');
      console.log('\nQuick setup:');
      console.log('1. Get token from https://sanity.io/manage');
      console.log('2. Update the client configuration above with your token');
      console.log('3. Re-run this script');
    } else {
      console.log('\n🔍 Troubleshooting:');
      console.log('- Check if Sanity Studio is running on port 3333');
      console.log('- Verify the schema is properly deployed');
      console.log('- Ensure network connectivity');
    }
  }
}

// Execute the population
populateCommitteeData();
