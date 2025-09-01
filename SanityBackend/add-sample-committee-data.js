const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: 'your-token', // Replace with your actual token - get from sanity.io/manage
  apiVersion: '2023-05-03'
});

// Sample committee member data
const sampleCommitteeMembers = [
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
    ]
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample committee member data...');
    
    for (const member of sampleCommitteeMembers) {
      const result = await client.create(member);
      console.log(`✅ Added: ${member.name} (ID: ${result._id})`);
    }
    
    console.log('\n🎉 Successfully added all sample committee members!');
    console.log('\nNext steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to "Organizing Committee Member" documents');
    console.log('3. Add profile images to each member');
    console.log('4. Review and edit the content as needed');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    console.log('\nPlease make sure to:');
    console.log('1. Replace "your-project-id" with your actual Sanity project ID');
    console.log('2. Replace "your-token" with a valid Sanity token with write permissions');
    console.log('3. Ensure your Sanity project is set up correctly');
  }
}

// Run the script
addSampleData();
