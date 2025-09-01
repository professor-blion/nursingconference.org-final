const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

// Sample poster presenters data
const samplePosterPresenters = [
  {
    _type: 'posterPresenters',
    name: 'Dr. Sarah Chen',
    title: 'PhD Student in Biomedical Engineering',
    institution: 'Stanford University',
    country: 'United States',
    bio: 'Dr. Sarah Chen is a dedicated PhD student specializing in biomedical engineering with a focus on neural interfaces and brain-computer interaction systems. Her research combines cutting-edge neuroscience with advanced engineering principles to develop innovative solutions for neurological disorders. She has published extensively in peer-reviewed journals and has been recognized for her outstanding contributions to the field.',
    posterTitle: 'Neural Interface Technology for Stroke Rehabilitation: A Novel Approach to Motor Recovery',
    posterAbstract: 'This research presents a groundbreaking neural interface system designed to enhance motor recovery in stroke patients. Our approach utilizes advanced machine learning algorithms to decode neural signals and translate them into therapeutic interventions. The study involved 45 stroke patients over a 6-month period, showing significant improvements in motor function recovery rates compared to traditional rehabilitation methods. The system demonstrates 89% accuracy in signal interpretation and has shown promising results in clinical trials.',
    researchArea: 'Biomedical Engineering',
    keywords: ['Neural Interfaces', 'Stroke Rehabilitation', 'Brain-Computer Interface', 'Motor Recovery', 'Machine Learning'],
    email: 'sarah.chen@stanford.edu',
    linkedinUrl: 'https://linkedin.com/in/sarahchen-biomed',
    orcidId: '0000-0002-1234-5678',
    researchGateUrl: 'https://researchgate.net/profile/Sarah-Chen-123',
    presentationDate: '2024-06-24T14:30:00.000Z',
    sessionTrack: 'technology-innovation',
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    awards: ['Best Student Research Award 2023', 'IEEE Young Researcher Grant', 'Stanford Excellence in Research'],
    publications: [
      'Chen, S. et al. (2023). "Advanced Neural Decoding for Stroke Recovery." Nature Biomedical Engineering.',
      'Chen, S. & Johnson, M. (2023). "Machine Learning in Neural Rehabilitation." IEEE Transactions on Neural Systems.',
      'Chen, S. (2022). "Brain-Computer Interfaces: Current State and Future Directions." Journal of Biomedical Engineering.'
    ],
    collaborators: ['Dr. Michael Johnson', 'Prof. Lisa Wang', 'Dr. Robert Martinez']
  },
  {
    _type: 'posterPresenters',
    name: 'Dr. Ahmed Hassan',
    title: 'Research Fellow in Oncology',
    institution: 'Johns Hopkins University',
    country: 'United States',
    bio: 'Dr. Ahmed Hassan is a distinguished research fellow in oncology at Johns Hopkins University, specializing in cancer immunotherapy and precision medicine. His work focuses on developing personalized treatment strategies for various cancer types using genomic analysis and immunological profiling. He has been instrumental in several clinical trials and has contributed significantly to the understanding of tumor microenvironments.',
    posterTitle: 'Personalized Cancer Immunotherapy: Genomic Profiling for Treatment Optimization',
    posterAbstract: 'Our research investigates the application of comprehensive genomic profiling to optimize cancer immunotherapy treatments. Through analysis of tumor samples from 200 patients across multiple cancer types, we have identified key biomarkers that predict treatment response. Our personalized approach has shown a 34% improvement in treatment efficacy compared to standard protocols. The study demonstrates the potential for precision medicine to revolutionize cancer care.',
    researchArea: 'Oncology',
    keywords: ['Cancer Immunotherapy', 'Precision Medicine', 'Genomic Profiling', 'Biomarkers', 'Personalized Treatment'],
    email: 'ahmed.hassan@jhmi.edu',
    linkedinUrl: 'https://linkedin.com/in/ahmedhassan-oncology',
    orcidId: '0000-0003-2345-6789',
    researchGateUrl: 'https://researchgate.net/profile/Ahmed-Hassan-456',
    presentationDate: '2024-06-24T15:00:00.000Z',
    sessionTrack: 'clinical-research',
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    awards: ['American Cancer Society Research Grant', 'Johns Hopkins Excellence Award', 'ASCO Young Investigator Award'],
    publications: [
      'Hassan, A. et al. (2023). "Genomic Biomarkers in Cancer Immunotherapy." New England Journal of Medicine.',
      'Hassan, A. & Smith, K. (2023). "Precision Oncology: Current Challenges and Future Opportunities." Cancer Research.',
      'Hassan, A. (2022). "Tumor Microenvironment and Immunotherapy Response." Nature Cancer.'
    ],
    collaborators: ['Dr. Katherine Smith', 'Prof. David Lee', 'Dr. Maria Rodriguez']
  },
  {
    _type: 'posterPresenters',
    name: 'Dr. Emily Rodriguez',
    title: 'Assistant Professor of Public Health',
    institution: 'Harvard T.H. Chan School of Public Health',
    country: 'United States',
    bio: 'Dr. Emily Rodriguez is an assistant professor of public health with expertise in epidemiology and global health policy. Her research focuses on health disparities, social determinants of health, and the impact of policy interventions on population health outcomes. She has conducted extensive fieldwork in underserved communities and has been a vocal advocate for health equity.',
    posterTitle: 'Social Determinants of Health: Impact of Housing Policy on Community Health Outcomes',
    posterAbstract: 'This comprehensive study examines the relationship between housing policy interventions and community health outcomes across 15 urban areas over a 5-year period. Our analysis reveals significant correlations between affordable housing initiatives and reduced rates of chronic diseases, mental health improvements, and decreased healthcare utilization. The research provides evidence-based recommendations for policy makers to address health disparities through targeted housing interventions.',
    researchArea: 'Public Health',
    keywords: ['Social Determinants', 'Health Policy', 'Housing', 'Health Disparities', 'Community Health'],
    email: 'emily.rodriguez@hsph.harvard.edu',
    linkedinUrl: 'https://linkedin.com/in/emilyrodriguez-publichealth',
    orcidId: '0000-0004-3456-7890',
    researchGateUrl: 'https://researchgate.net/profile/Emily-Rodriguez-789',
    presentationDate: '2024-06-24T15:30:00.000Z',
    sessionTrack: 'public-health',
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    awards: ['CDC Public Health Excellence Award', 'Harvard Teaching Excellence Award', 'APHA Early Career Award'],
    publications: [
      'Rodriguez, E. et al. (2023). "Housing Policy and Health Outcomes: A Longitudinal Analysis." American Journal of Public Health.',
      'Rodriguez, E. & Brown, J. (2023). "Social Determinants and Health Equity." The Lancet Public Health.',
      'Rodriguez, E. (2022). "Community-Based Health Interventions: Lessons Learned." Health Affairs.'
    ],
    collaborators: ['Dr. James Brown', 'Prof. Susan Taylor', 'Dr. Michael Kim']
  },
  {
    _type: 'posterPresenters',
    name: 'Dr. Raj Patel',
    title: 'Postdoctoral Researcher',
    institution: 'MIT Computer Science and Artificial Intelligence Laboratory',
    country: 'United States',
    bio: 'Dr. Raj Patel is a postdoctoral researcher at MIT CSAIL, specializing in artificial intelligence applications in healthcare. His work focuses on developing machine learning models for medical diagnosis and treatment prediction. He has extensive experience in deep learning, computer vision, and natural language processing applied to medical data.',
    posterTitle: 'AI-Powered Medical Diagnosis: Deep Learning Models for Radiology Image Analysis',
    posterAbstract: 'This research presents a novel deep learning framework for automated medical image analysis in radiology. Our convolutional neural network architecture achieves 96.7% accuracy in detecting abnormalities across multiple imaging modalities including X-rays, CT scans, and MRIs. The system has been validated on a dataset of over 100,000 medical images and shows potential to significantly reduce diagnostic errors and improve patient outcomes.',
    researchArea: 'Artificial Intelligence in Healthcare',
    keywords: ['Deep Learning', 'Medical Imaging', 'Computer Vision', 'Radiology', 'AI Diagnosis'],
    email: 'raj.patel@mit.edu',
    linkedinUrl: 'https://linkedin.com/in/rajpatel-ai',
    orcidId: '0000-0005-4567-8901',
    researchGateUrl: 'https://researchgate.net/profile/Raj-Patel-012',
    presentationDate: '2024-06-24T16:00:00.000Z',
    sessionTrack: 'technology-innovation',
    displayOrder: 4,
    isFeatured: false,
    isActive: true,
    awards: ['MIT Excellence in Research Award', 'Google AI Research Grant', 'IEEE Computer Society Award'],
    publications: [
      'Patel, R. et al. (2023). "Deep Learning in Medical Imaging: A Comprehensive Review." Nature Machine Intelligence.',
      'Patel, R. & Zhang, L. (2023). "Automated Radiology Diagnosis Using CNNs." Medical Image Analysis.',
      'Patel, R. (2022). "AI Applications in Healthcare: Current State and Future Prospects." AI in Medicine.'
    ],
    collaborators: ['Dr. Lisa Zhang', 'Prof. Andrew Chen', 'Dr. Sarah Williams']
  },
  {
    _type: 'posterPresenters',
    name: 'Dr. Maria Gonzalez',
    title: 'Clinical Research Coordinator',
    institution: 'Mayo Clinic',
    country: 'United States',
    bio: 'Dr. Maria Gonzalez is a clinical research coordinator at Mayo Clinic with expertise in cardiovascular research and clinical trial management. She has overseen numerous multi-center clinical trials and has been instrumental in advancing cardiovascular treatment protocols. Her work focuses on improving patient outcomes through evidence-based medicine.',
    posterTitle: 'Cardiovascular Risk Assessment: Novel Biomarkers for Early Detection',
    posterAbstract: 'Our study identifies novel biomarkers for early cardiovascular risk assessment in asymptomatic patients. Through analysis of blood samples from 1,500 participants over 3 years, we have discovered a panel of 12 biomarkers that can predict cardiovascular events with 92% sensitivity and 88% specificity. This breakthrough could revolutionize preventive cardiology and enable earlier interventions.',
    researchArea: 'Cardiovascular Medicine',
    keywords: ['Cardiovascular Risk', 'Biomarkers', 'Early Detection', 'Preventive Medicine', 'Clinical Trials'],
    email: 'maria.gonzalez@mayo.edu',
    linkedinUrl: 'https://linkedin.com/in/mariagonzalez-cardio',
    orcidId: '0000-0006-5678-9012',
    researchGateUrl: 'https://researchgate.net/profile/Maria-Gonzalez-345',
    presentationDate: '2024-06-24T16:30:00.000Z',
    sessionTrack: 'clinical-research',
    displayOrder: 5,
    isFeatured: true,
    isActive: true,
    awards: ['American Heart Association Research Award', 'Mayo Clinic Innovation Award', 'Clinical Research Excellence Award'],
    publications: [
      'Gonzalez, M. et al. (2023). "Novel Biomarkers in Cardiovascular Risk Assessment." Circulation.',
      'Gonzalez, M. & Thompson, R. (2023). "Preventive Cardiology: Current Strategies." Journal of the American College of Cardiology.',
      'Gonzalez, M. (2022). "Clinical Trial Design in Cardiovascular Research." Clinical Trials.'
    ],
    collaborators: ['Dr. Robert Thompson', 'Prof. Jennifer Davis', 'Dr. Mark Wilson']
  },
  {
    _type: 'posterPresenters',
    name: 'Dr. James Liu',
    title: 'Graduate Research Assistant',
    institution: 'University of California, Berkeley',
    country: 'United States',
    bio: 'Dr. James Liu is a graduate research assistant at UC Berkeley, pursuing his PhD in Environmental Science with a focus on climate change and public health. His research examines the intersection of environmental factors and human health outcomes, particularly in urban settings. He has been involved in several interdisciplinary projects addressing environmental justice.',
    posterTitle: 'Climate Change and Urban Health: Air Quality Impact on Respiratory Diseases',
    posterAbstract: 'This longitudinal study investigates the relationship between air quality changes and respiratory disease incidence in major urban areas. Our analysis of 10 years of environmental and health data from 8 metropolitan areas reveals significant correlations between PM2.5 levels and asthma hospitalization rates. The research provides crucial insights for urban planning and public health policy in the context of climate change.',
    researchArea: 'Environmental Health',
    keywords: ['Climate Change', 'Air Quality', 'Respiratory Health', 'Urban Planning', 'Environmental Justice'],
    email: 'james.liu@berkeley.edu',
    linkedinUrl: 'https://linkedin.com/in/jamesliu-envhealth',
    orcidId: '0000-0007-6789-0123',
    researchGateUrl: 'https://researchgate.net/profile/James-Liu-678',
    presentationDate: '2024-06-24T17:00:00.000Z',
    sessionTrack: 'public-health',
    displayOrder: 6,
    isFeatured: false,
    isActive: true,
    awards: ['EPA Student Research Grant', 'Berkeley Graduate Fellowship', 'Environmental Health Student Award'],
    publications: [
      'Liu, J. et al. (2023). "Urban Air Quality and Respiratory Health Outcomes." Environmental Health Perspectives.',
      'Liu, J. & Anderson, P. (2023). "Climate Change Impacts on Public Health." The Lancet Planetary Health.',
      'Liu, J. (2022). "Environmental Justice in Urban Settings." Environmental Science & Policy.'
    ],
    collaborators: ['Dr. Patricia Anderson', 'Prof. David Green', 'Dr. Rachel Martinez']
  },
  {
    _type: 'posterPresenters',
    name: 'Dr. Anna Kowalski',
    title: 'Research Scientist',
    institution: 'European Molecular Biology Laboratory',
    country: 'Germany',
    bio: 'Dr. Anna Kowalski is a research scientist at EMBL, specializing in molecular biology and genetics. Her work focuses on gene therapy applications and CRISPR technology for treating genetic disorders. She has been at the forefront of developing innovative approaches to gene editing and has contributed significantly to the field of precision medicine.',
    posterTitle: 'CRISPR Gene Therapy for Inherited Metabolic Disorders: Clinical Applications',
    posterAbstract: 'This research demonstrates the successful application of CRISPR-Cas9 gene editing technology for treating inherited metabolic disorders. Our in vivo studies show 85% correction efficiency in target genes associated with lysosomal storage diseases. The therapy has shown promising results in animal models and is currently being prepared for Phase I clinical trials. This work represents a significant advancement in gene therapy applications.',
    researchArea: 'Molecular Biology',
    keywords: ['CRISPR', 'Gene Therapy', 'Genetic Disorders', 'Precision Medicine', 'Molecular Biology'],
    email: 'anna.kowalski@embl.de',
    linkedinUrl: 'https://linkedin.com/in/annakowalski-molbio',
    orcidId: '0000-0008-7890-1234',
    researchGateUrl: 'https://researchgate.net/profile/Anna-Kowalski-901',
    presentationDate: '2024-06-24T17:30:00.000Z',
    sessionTrack: 'basic-science',
    displayOrder: 7,
    isFeatured: false,
    isActive: true,
    awards: ['EMBL Excellence Award', 'European Research Council Grant', 'CRISPR Innovation Prize'],
    publications: [
      'Kowalski, A. et al. (2023). "CRISPR Applications in Metabolic Disorders." Nature Genetics.',
      'Kowalski, A. & Mueller, H. (2023). "Gene Editing Technologies: Current State and Future Directions." Cell.',
      'Kowalski, A. (2022). "Precision Medicine Through Gene Therapy." Nature Medicine.'
    ],
    collaborators: ['Dr. Hans Mueller', 'Prof. Sophie Dubois', 'Dr. Marco Rossi']
  },
  {
    _type: 'posterPresenters',
    name: 'Dr. Kenji Tanaka',
    title: 'Associate Professor',
    institution: 'University of Tokyo',
    country: 'Japan',
    bio: 'Dr. Kenji Tanaka is an associate professor at the University of Tokyo, specializing in regenerative medicine and stem cell research. His laboratory focuses on developing novel approaches for tissue engineering and organ regeneration. He has been a pioneer in using induced pluripotent stem cells for therapeutic applications and has numerous patents in the field.',
    posterTitle: 'Stem Cell-Based Cardiac Regeneration: From Bench to Bedside',
    posterAbstract: 'Our research presents a comprehensive approach to cardiac regeneration using induced pluripotent stem cells (iPSCs). We have successfully differentiated iPSCs into functional cardiomyocytes and demonstrated their therapeutic potential in animal models of myocardial infarction. The treatment showed 40% improvement in cardiac function and significant reduction in scar tissue formation. Clinical trials are planned to begin next year.',
    researchArea: 'Regenerative Medicine',
    keywords: ['Stem Cells', 'Cardiac Regeneration', 'iPSCs', 'Tissue Engineering', 'Regenerative Medicine'],
    email: 'kenji.tanaka@u-tokyo.ac.jp',
    linkedinUrl: 'https://linkedin.com/in/kenjitanaka-regen',
    orcidId: '0000-0009-8901-2345',
    researchGateUrl: 'https://researchgate.net/profile/Kenji-Tanaka-234',
    presentationDate: '2024-06-24T18:00:00.000Z',
    sessionTrack: 'basic-science',
    displayOrder: 8,
    isFeatured: true,
    isActive: true,
    awards: ['Japanese Society for Regenerative Medicine Award', 'University of Tokyo Excellence Prize', 'International Stem Cell Research Award'],
    publications: [
      'Tanaka, K. et al. (2023). "iPSC-Based Cardiac Regeneration: Clinical Applications." Nature Biotechnology.',
      'Tanaka, K. & Yamamoto, S. (2023). "Stem Cell Therapy in Cardiovascular Disease." Circulation Research.',
      'Tanaka, K. (2022). "Regenerative Medicine: Current Challenges and Future Opportunities." Cell Stem Cell.'
    ],
    collaborators: ['Dr. Satoshi Yamamoto', 'Prof. Hiroshi Nakamura', 'Dr. Yuki Sato']
  }
];

// Function to add sample poster presenters
async function addSamplePosterPresenters() {
  try {
    console.log('🚀 Starting to add sample poster presenters...');

    // Check if poster presenters already exist
    const existingPresenters = await client.fetch('*[_type == "posterPresenters"]');

    if (existingPresenters.length > 0) {
      console.log(`⚠️ Found ${existingPresenters.length} existing poster presenters. Skipping creation to avoid duplicates.`);
      console.log('💡 If you want to recreate them, please delete existing poster presenters first.');
      return;
    }

    console.log('📝 Creating poster presenters...');

    // Create all poster presenters
    const results = await Promise.all(
      samplePosterPresenters.map(presenter => client.create(presenter))
    );

    console.log(`✅ Successfully created ${results.length} poster presenters!`);

    // Log created presenters
    results.forEach((presenter, index) => {
      console.log(`${index + 1}. ${presenter.name} - ${presenter.posterTitle}`);
    });

    console.log('\n🎉 Sample poster presenters have been added successfully!');
    console.log('🌐 You can now view them at: http://localhost:3000/poster-presenters');
    console.log('⚙️ You can manage them in Sanity Studio at: http://localhost:3333');

  } catch (error) {
    console.error('❌ Error adding sample poster presenters:', error);
    process.exit(1);
  }
}

// Run the function
addSamplePosterPresenters();