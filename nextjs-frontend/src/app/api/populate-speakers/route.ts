import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';
import { createClient } from '@sanity/client';

// Create a write client with token for creating documents
const writeClient = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03'
});

// Sample speaker data with diverse profiles and categories
const sampleSpeakers = [
  // Keynote Speaker 1
  {
    _type: 'speakers',
    name: 'Dr. Maria Elena Rodriguez',
    title: 'Professor of Biomedical Engineering & Director of Neural Interface Lab',
    institution: 'Stanford University School of Medicine',
    country: 'United States',
    bio: 'Dr. Maria Elena Rodriguez is a world-renowned expert in biomedical engineering with over 25 years of experience in developing innovative medical devices. Her groundbreaking research in neural interfaces has revolutionized the treatment of neurological disorders, particularly in brain-computer interface technology for paralyzed patients. She has published over 200 peer-reviewed papers, holds 45 patents in biomedical technology, and her work has directly improved the lives of thousands of patients worldwide. Dr. Rodriguez is also a passionate advocate for diversity in STEM fields and has mentored over 100 graduate students.',
    specialization: 'Neural Interfaces & Brain-Computer Interface Technology',
    speakerCategory: 'keynote',
    sessionTitle: 'The Future of Neural Interfaces: Bridging Mind and Machine',
    sessionAbstract: 'This keynote will explore the latest advances in neural interface technology and their potential to transform healthcare. We will discuss current challenges in brain-computer interfaces, breakthrough innovations in neural signal processing, and the ethical considerations surrounding direct brain-machine communication. The presentation will include live demonstrations of cutting-edge neural prosthetics and their real-world applications.',
    email: 'maria.rodriguez@stanford.edu',
    linkedinUrl: 'https://linkedin.com/in/maria-rodriguez-bioeng',
    orcidId: '0000-0001-2345-6789',
    researchGateUrl: 'https://researchgate.net/profile/Maria-Rodriguez',
    websiteUrl: 'https://med.stanford.edu/profiles/maria-rodriguez',
    displayOrder: 1,
    isKeynote: true,
    isActive: true,
    isFeatured: true,
    yearsOfExperience: 25,
    achievements: [
      'IEEE Fellow for contributions to biomedical engineering and neural interfaces',
      'National Academy of Engineering Member (2020)',
      'Winner of the 2023 IEEE Engineering in Medicine and Biology Award',
      'Founder of three successful biotech startups with combined valuation of $500M',
      'NIH Director\'s Pioneer Award recipient (2019)'
    ],
    publications: [
      'Rodriguez, M.E. et al. (2023). "Advanced Neural Interface Technologies for Clinical Applications." Nature Biomedical Engineering, 7(4), 234-248.',
      'Rodriguez, M.E. & Smith, J. (2022). "Ethical Frameworks for Brain-Computer Interfaces in Clinical Practice." Science Translational Medicine, 14(632), eabm7890.',
      'Rodriguez, M.E. (2021). "Next-Generation Implantable Devices for Neurological Disorders." Cell, 184(12), 3127-3140.'
    ],
    sessionDate: '2024-06-15T09:00:00.000Z',
    sessionLocation: 'Main Auditorium'
  },
  // Keynote Speaker 2
  {
    _type: 'speakers',
    name: 'Prof. James Wei Chen',
    title: 'Director of AI Research Institute & Professor of Computer Science',
    institution: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    bio: 'Professor James Wei Chen is a leading authority in artificial intelligence and machine learning applications in healthcare. His research focuses on developing AI systems that can assist in medical diagnosis, treatment planning, and drug discovery. He has been instrumental in creating several FDA-approved AI diagnostic tools and has led groundbreaking research in federated learning for medical applications. Prof. Chen has published over 180 papers in top-tier venues and his work has been cited more than 15,000 times. He serves on the editorial boards of multiple prestigious journals and is a frequent keynote speaker at international conferences.',
    specialization: 'Artificial Intelligence in Healthcare & Medical Machine Learning',
    speakerCategory: 'keynote',
    sessionTitle: 'AI-Powered Healthcare: Transforming Patient Care Through Intelligent Systems',
    sessionAbstract: 'Explore how artificial intelligence is revolutionizing healthcare delivery, from diagnostic imaging to personalized treatment plans. This presentation will showcase real-world applications of AI in clinical settings, discuss the challenges of implementing AI in healthcare systems, and present a vision for the future of AI-assisted medicine. We will cover recent breakthroughs in large language models for clinical decision support, federated learning for privacy-preserving medical AI, and the ethical implications of AI in healthcare.',
    email: 'jwchen@mit.edu',
    linkedinUrl: 'https://linkedin.com/in/james-chen-ai-healthcare',
    orcidId: '0000-0002-3456-7890',
    researchGateUrl: 'https://researchgate.net/profile/James-Chen-MIT',
    websiteUrl: 'https://csail.mit.edu/person/james-chen',
    displayOrder: 2,
    isKeynote: true,
    isActive: true,
    isFeatured: true,
    yearsOfExperience: 20,
    achievements: [
      'ACM Fellow for contributions to AI in healthcare (2021)',
      'Winner of the 2022 Turing Award for AI Innovation in Medicine',
      'Advisor to WHO on AI in Global Health initiatives',
      'Co-founder of HealthAI Technologies (acquired by Google for $2.1B)',
      'NSF CAREER Award recipient (2015)'
    ],
    publications: [
      'Chen, J.W. et al. (2023). "Large Language Models in Clinical Decision Support: A Comprehensive Evaluation." New England Journal of Medicine, 388(15), 1387-1397.',
      'Chen, J.W. & Wang, L. (2022). "Federated Learning for Medical AI: Privacy-Preserving Approaches and Clinical Applications." Nature Machine Intelligence, 4(8), 623-635.',
      'Chen, J.W. (2021). "Explainable AI in Medical Diagnosis: Building Trust in Automated Systems." The Lancet Digital Health, 3(6), e356-e367.'
    ],
    sessionDate: '2024-06-15T14:00:00.000Z',
    sessionLocation: 'Main Auditorium'
  },
  // Invited Speaker 1
  {
    _type: 'speakers',
    name: 'Dr. Sarah Michelle Kim',
    title: 'Chief Medical Officer & Director of Precision Oncology',
    institution: 'Johns Hopkins Hospital & Sidney Kimmel Comprehensive Cancer Center',
    country: 'United States',
    bio: 'Dr. Sarah Michelle Kim is a distinguished physician-scientist with expertise in precision medicine and genomics. She leads clinical research initiatives focused on personalized treatment approaches for cancer patients, with particular emphasis on rare cancers and pediatric oncology. Her work has directly impacted treatment protocols for thousands of patients worldwide and has been instrumental in developing novel biomarker-driven therapies. Dr. Kim completed her medical degree at Harvard Medical School, followed by residency and fellowship training at Memorial Sloan Kettering Cancer Center. She has been recognized internationally for her contributions to translational cancer research.',
    specialization: 'Precision Medicine, Genomic Oncology & Rare Cancer Research',
    speakerCategory: 'invited',
    sessionTitle: 'Precision Medicine in Oncology: From Genomics to Personalized Treatment',
    sessionAbstract: 'This session will cover the latest developments in precision oncology, including genomic profiling, targeted therapies, and the integration of multi-omics data for treatment selection. We will explore real-world case studies demonstrating how genomic testing is transforming cancer care, discuss challenges in implementing precision medicine in diverse populations, and present emerging technologies like liquid biopsies and circulating tumor DNA analysis.',
    email: 'skim@jhmi.edu',
    linkedinUrl: 'https://linkedin.com/in/sarah-kim-md-precision-oncology',
    orcidId: '0000-0003-4567-8901',
    researchGateUrl: 'https://researchgate.net/profile/Sarah-Kim-MD',
    websiteUrl: 'https://hopkinsmedicine.org/profiles/sarah-kim',
    displayOrder: 3,
    isKeynote: false,
    isActive: true,
    isFeatured: true,
    yearsOfExperience: 18,
    achievements: [
      'American Society of Clinical Oncology Young Investigator Award (2019)',
      'NIH Director\'s New Innovator Award recipient (2020)',
      'Lead investigator on 15 clinical trials with over 2,000 patients enrolled',
      'Breakthrough Cancer Research Award from the V Foundation (2022)',
      'Named to Forbes 30 Under 30 in Healthcare (2018)'
    ],
    publications: [
      'Kim, S.M. et al. (2023). "Multi-omics Integration for Cancer Treatment Selection: A Comprehensive Analysis of 5,000 Patients." Cell, 186(8), 1847-1862.',
      'Kim, S.M. & Brown, A. (2022). "Liquid Biopsies in Precision Oncology: Clinical Applications and Future Directions." Nature Reviews Cancer, 22(10), 567-584.',
      'Kim, S.M. et al. (2021). "Genomic Profiling of Rare Cancers: Insights from the Precision Oncology Initiative." Journal of Clinical Oncology, 39(28), 3156-3168.'
    ],
    sessionDate: '2024-06-16T10:30:00.000Z',
    sessionLocation: 'Conference Room A'
  },
  // Invited Speaker 2
  {
    _type: 'speakers',
    name: 'Prof. Ahmed Hassan Al-Rashid',
    title: 'Professor of Global Health & Director of Centre for Tropical Medicine',
    institution: 'University of Oxford, Nuffield Department of Medicine',
    country: 'United Kingdom',
    bio: 'Professor Ahmed Hassan Al-Rashid is a globally recognized expert in infectious disease control and health systems strengthening in low-resource settings. With over 22 years of experience working across Africa, Asia, and the Middle East, his research has contributed to major public health initiatives that have saved millions of lives. Prof. Al-Rashid has led response efforts for multiple disease outbreaks, including Ebola, COVID-19, and cholera epidemics. He holds dual medical degrees from Cairo University and Oxford University, and has been instrumental in developing innovative community-based health interventions that are now implemented in over 40 countries.',
    specialization: 'Global Health, Infectious Disease Control & Health Systems Strengthening',
    speakerCategory: 'invited',
    sessionTitle: 'Building Resilient Health Systems: Lessons from the Global South',
    sessionAbstract: 'This session examines innovative approaches to health system strengthening in resource-limited settings, with particular focus on community-based interventions and technology solutions. We will explore successful models of healthcare delivery in challenging environments, discuss the role of digital health in expanding access to care, and present evidence-based strategies for building pandemic preparedness in low-resource settings. Case studies from recent outbreak responses will illustrate practical applications of these approaches.',
    email: 'ahmed.hassan@ndm.ox.ac.uk',
    linkedinUrl: 'https://linkedin.com/in/ahmed-hassan-globalhealth-oxford',
    orcidId: '0000-0004-5678-9012',
    researchGateUrl: 'https://researchgate.net/profile/Ahmed-Hassan-Oxford',
    websiteUrl: 'https://www.ndm.ox.ac.uk/team/ahmed-hassan',
    displayOrder: 4,
    isKeynote: false,
    isActive: true,
    yearsOfExperience: 22,
    achievements: [
      'WHO Goodwill Ambassador for Health Equity (2020-present)',
      'Gates Foundation Grand Challenges Winner for innovative health solutions (2019)',
      'Royal Society of Tropical Medicine Fellow and Gold Medal recipient (2021)',
      'Lead advisor for WHO COVID-19 response in Sub-Saharan Africa',
      'Recipient of the Prince Mahidol Award for Public Health (2022)'
    ],
    publications: [
      'Hassan, A. et al. (2023). "Community Health Worker Programs: A Systematic Review of 15 Years of Evidence." The Lancet Global Health, 11(7), e1023-e1035.',
      'Hassan, A. (2022). "Digital Health Solutions for Low-Resource Settings: Implementation Challenges and Success Factors." BMJ Global Health, 7(8), e009234.',
      'Hassan, A. et al. (2021). "Pandemic Preparedness in Resource-Limited Settings: Lessons from COVID-19." Nature Medicine, 27(6), 945-952.'
    ],
    sessionDate: '2024-06-16T15:00:00.000Z',
    sessionLocation: 'Conference Room B'
  },
  // Plenary Speaker
  {
    _type: 'speakers',
    name: 'Dr. Lisa Wang-Chen',
    title: 'Director of Digital Health Innovation & Chief Medical Officer',
    institution: 'Google Health & DeepMind Health',
    country: 'United States',
    bio: 'Dr. Lisa Wang-Chen leads digital health innovation at Google Health, focusing on developing scalable technology solutions for global healthcare challenges. With a unique background spanning both computer science (PhD from Stanford) and medicine (MD from UCSF), she brings exceptional insights to health technology development. Before joining Google, she was a practicing emergency physician and founded two successful health tech startups. Dr. Wang-Chen has been instrumental in developing AI-powered diagnostic tools that are now used in hospitals worldwide, and she leads Google\'s efforts in democratizing access to healthcare through technology.',
    specialization: 'Digital Health Technology, AI in Healthcare & Health Tech Innovation',
    speakerCategory: 'plenary',
    sessionTitle: 'Scaling Digital Health Solutions: From Innovation to Implementation',
    sessionAbstract: 'This plenary session explores the complex journey from digital health innovation to real-world implementation at scale. We will examine the challenges of scaling health technologies across diverse healthcare systems, regulatory considerations for digital therapeutics, and methodologies for measuring clinical and economic impact. The presentation will include case studies from Google Health\'s global initiatives, lessons learned from failed implementations, and a framework for successful digital health deployment.',
    email: 'lwang@google.com',
    linkedinUrl: 'https://linkedin.com/in/lisa-wang-digitalhealth-google',
    orcidId: '0000-0005-6789-0123',
    researchGateUrl: 'https://researchgate.net/profile/Lisa-Wang-Google',
    websiteUrl: 'https://health.google/people/lisa-wang',
    displayOrder: 5,
    isKeynote: false,
    isActive: true,
    isFeatured: false,
    yearsOfExperience: 15,
    achievements: [
      'Forbes 30 Under 30 in Healthcare (2018)',
      'MIT Technology Review Innovator Under 35 (2019)',
      'Led development of 5 FDA-approved digital health tools',
      'TIME Magazine\'s 100 Most Influential People in Health (2022)',
      'Founded two successful health tech startups (acquired for $300M combined)'
    ],
    publications: [
      'Wang, L. et al. (2023). "Regulatory Pathways for Digital Therapeutics: A Global Perspective." Nature Digital Medicine, 6(1), 45-58.',
      'Wang, L. (2022). "User-Centered Design in Health Technology: Principles and Practice." JMIR mHealth and uHealth, 10(8), e38492.',
      'Wang, L. et al. (2021). "AI-Powered Diagnostic Tools: Implementation Challenges in Resource-Limited Settings." The Lancet Digital Health, 3(9), e567-e578.'
    ],
    sessionDate: '2024-06-17T09:00:00.000Z',
    sessionLocation: 'Main Auditorium'
  },
  // Session Speaker
  {
    _type: 'speakers',
    name: 'Dr. Michael James Thompson',
    title: 'Associate Professor of Biostatistics & Director of Clinical Trials Methodology',
    institution: 'Harvard T.H. Chan School of Public Health',
    country: 'United States',
    bio: 'Dr. Michael James Thompson is a renowned biostatistician specializing in statistical methods for clinical trials and epidemiological studies. His methodological innovations have improved the design and analysis of medical research studies, particularly in the areas of adaptive trial designs and Bayesian statistics. Dr. Thompson has served as the statistical lead on over 50 clinical trials and has consulted for major pharmaceutical companies and regulatory agencies. He completed his PhD in Biostatistics at Johns Hopkins University and has been at Harvard for over 12 years, where he teaches advanced statistical methods and mentors the next generation of biostatisticians.',
    specialization: 'Biostatistics, Clinical Trial Design & Adaptive Trial Methodology',
    speakerCategory: 'session',
    sessionTitle: 'Advanced Statistical Methods for Clinical Research: Adaptive Designs and Bayesian Approaches',
    sessionAbstract: 'This session provides a comprehensive overview of modern statistical approaches for clinical trial design, including adaptive trials, Bayesian methods, and machine learning applications in clinical research. We will explore practical implementation strategies, regulatory considerations, and real-world case studies demonstrating the benefits and challenges of these advanced methodologies. Attendees will gain insights into when and how to apply these methods in their own research.',
    email: 'mthompson@hsph.harvard.edu',
    linkedinUrl: 'https://linkedin.com/in/michael-thompson-biostatistics',
    orcidId: '0000-0006-7890-1234',
    researchGateUrl: 'https://researchgate.net/profile/Michael-Thompson-Harvard',
    websiteUrl: 'https://www.hsph.harvard.edu/michael-thompson',
    displayOrder: 6,
    isKeynote: false,
    isActive: true,
    yearsOfExperience: 12,
    achievements: [
      'American Statistical Association Fellow (2020)',
      'Best Paper Award, Clinical Trials Journal (2022)',
      'International Biometric Society President\'s Award (2021)',
      'Statistical lead on 3 FDA breakthrough therapy designations'
    ],
    publications: [
      'Thompson, M.J. et al. (2023). "Adaptive Trial Designs in Oncology: A Comprehensive Review and Practical Guide." Statistics in Medicine, 42(18), 3234-3251.',
      'Thompson, M.J. (2022). "Bayesian Methods for Medical Device Trials: Regulatory Perspectives and Implementation." Biometrics, 78(3), 892-905.',
      'Thompson, M.J. & Lee, S. (2021). "Machine Learning in Clinical Trial Design: Opportunities and Challenges." Clinical Trials, 18(4), 423-435.'
    ],
    sessionDate: '2024-06-17T14:00:00.000Z',
    sessionLocation: 'Conference Room C'
  },
  // Workshop Leader
  {
    _type: 'speakers',
    name: 'Dr. Elena Mikhailovna Petrov',
    title: 'Senior Research Scientist & Head of Regulatory Strategy',
    institution: 'European Medicines Agency (EMA)',
    country: 'Netherlands',
    bio: 'Dr. Elena Mikhailovna Petrov is a leading regulatory science expert with extensive experience in drug development and approval processes across Europe and internationally. With over 16 years at the EMA, she has been instrumental in developing new regulatory frameworks for innovative therapies, including gene therapies, personalized medicines, and digital therapeutics. Dr. Petrov holds a PhD in Pharmacology from Moscow State University and an MBA from INSEAD. She regularly leads workshops on regulatory strategy and has guided numerous successful drug approvals, including several breakthrough therapies. Her expertise spans the entire drug development lifecycle from preclinical to post-market surveillance.',
    specialization: 'Regulatory Science, Drug Development & Innovative Therapy Approval Pathways',
    speakerCategory: 'workshop',
    sessionTitle: 'Navigating Regulatory Pathways: A Hands-on Workshop for Innovative Therapies',
    sessionAbstract: 'This interactive workshop covers comprehensive regulatory strategy development, submission preparation, and effective communication with regulatory agencies. Participants will work through real case studies of successful and failed submissions, learn to develop regulatory roadmaps for complex therapies, and practice presenting to regulatory committees. The workshop includes breakout sessions on specific therapy areas including gene therapy, CAR-T cells, and digital therapeutics.',
    email: 'elena.petrov@ema.europa.eu',
    linkedinUrl: 'https://linkedin.com/in/elena-petrov-ema-regulatory',
    orcidId: '0000-0007-8901-2345',
    researchGateUrl: 'https://researchgate.net/profile/Elena-Petrov-EMA',
    websiteUrl: 'https://www.ema.europa.eu/en/about-us/who-we-are/elena-petrov',
    displayOrder: 7,
    isKeynote: false,
    isActive: true,
    yearsOfExperience: 16,
    achievements: [
      'EMA Scientific Advice Committee Member and former Chair (2019-2022)',
      'Regulatory Affairs Professionals Society (RAPS) Fellow',
      'Lead regulatory advisor for 12 breakthrough therapy designations',
      'European Federation of Pharmaceutical Industries Excellence Award (2021)',
      'Co-author of EMA guidelines on gene therapy regulation'
    ],
    publications: [
      'Petrov, E.M. et al. (2023). "Regulatory Frameworks for Gene Therapy: European Perspective and Global Harmonization." Nature Reviews Drug Discovery, 22(7), 523-540.',
      'Petrov, E.M. (2022). "Digital Therapeutics Regulation: Challenges and Opportunities in the European Union." Regulatory Affairs Professionals Society Journal, 27(4), 445-458.',
      'Petrov, E.M. & Johnson, R. (2021). "Adaptive Regulatory Pathways for Innovative Medicines: Lessons from COVID-19." Drug Discovery Today, 26(8), 1987-1995.'
    ],
    sessionDate: '2024-06-18T10:00:00.000Z',
    sessionLocation: 'Workshop Room 1'
  },
  // Panel Moderator
  {
    _type: 'speakers',
    name: 'Prof. David Alexander Johnson',
    title: 'Editor-in-Chief, Medical Innovation Journal & Professor of Medicine',
    institution: 'University of California, San Francisco (UCSF)',
    country: 'United States',
    bio: 'Professor David Alexander Johnson is a highly respected voice in medical research and innovation with over 20 years of experience in academic medicine and scientific publishing. As Editor-in-Chief of the prestigious Medical Innovation Journal (Impact Factor: 15.2), he has unique insights into research trends, publication standards, and the evolving landscape of medical science. Prof. Johnson completed his MD/PhD at Johns Hopkins University and his residency in Internal Medicine at UCSF, where he has been a faculty member for 15 years. He has authored over 150 peer-reviewed publications and has been instrumental in promoting open science initiatives and research transparency.',
    specialization: 'Medical Research, Scientific Publishing & Research Ethics',
    speakerCategory: 'moderator',
    sessionTitle: 'Panel Discussion: The Future of Medical Research - Innovation, Ethics, and Open Science',
    sessionAbstract: 'Professor Johnson will moderate a dynamic panel discussion featuring leading researchers and industry experts exploring emerging trends in medical research, evolving publication practices, and the critical role of open science in advancing healthcare. The panel will address challenges in research reproducibility, the impact of AI on scientific discovery, ethical considerations in human subjects research, and strategies for making research more accessible globally.',
    email: 'david.johnson@ucsf.edu',
    linkedinUrl: 'https://linkedin.com/in/david-johnson-editor-ucsf',
    orcidId: '0000-0008-9012-3456',
    researchGateUrl: 'https://researchgate.net/profile/David-Johnson-UCSF',
    websiteUrl: 'https://profiles.ucsf.edu/david.johnson',
    displayOrder: 8,
    isKeynote: false,
    isActive: true,
    yearsOfExperience: 20,
    achievements: [
      'International Association of Medical Journal Editors (ICMJE) Board Member',
      'Committee on Publication Ethics (COPE) Chair (2020-2023)',
      'Recipient of the Excellence in Medical Journalism Award (2022)',
      'Lead author of ICMJE guidelines on research transparency',
      'Advisory board member for 8 major medical journals'
    ],
    publications: [
      'Johnson, D.A. et al. (2023). "The Future of Peer Review: AI-Assisted Evaluation and Quality Control." Nature Medicine, 29(6), 1234-1242.',
      'Johnson, D.A. (2022). "Open Science in Medical Research: Challenges and Opportunities for Global Health." The Lancet, 399(10332), 1456-1465.',
      'Johnson, D.A. & Smith, K. (2021). "Research Ethics in the Digital Age: Protecting Participant Privacy in Big Data Studies." New England Journal of Medicine, 384(15), 1423-1431.'
    ],
    sessionDate: '2024-06-18T15:30:00.000Z',
    sessionLocation: 'Panel Discussion Hall'
  }
];

export async function POST() {
  try {
    console.log('🚀 Starting speaker data population...');

    // Check if writeClient has a token
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json({
        success: false,
        message: 'SANITY_API_TOKEN environment variable is required for write operations. Please add it to your .env.local file.',
        instructions: [
          '1. Go to https://sanity.io/manage',
          '2. Select your project (fl5uetho)',
          '3. Go to API > Tokens',
          '4. Create a new token with "Editor" permissions',
          '5. Add SANITY_API_TOKEN=your_token to .env.local file',
          '6. Restart the Next.js server'
        ]
      }, { status: 400 });
    }

    const results = [];
    const errors = [];

    console.log(`📝 Creating ${sampleSpeakers.length} speaker documents...`);

    for (let i = 0; i < sampleSpeakers.length; i++) {
      const speaker = sampleSpeakers[i];
      try {
        console.log(`Creating speaker ${i + 1}/${sampleSpeakers.length}: ${speaker.name}`);

        const result = await writeClient.create(speaker);
        results.push({
          _id: result._id,
          name: speaker.name,
          title: speaker.title,
          institution: speaker.institution,
          speakerCategory: speaker.speakerCategory,
          isKeynote: speaker.isKeynote || false,
          isFeatured: speaker.isFeatured || false
        });

        console.log(`✅ Created: ${speaker.name} (${result._id})`);
      } catch (error) {
        console.error(`❌ Failed to create ${speaker.name}:`, error);
        errors.push({
          name: speaker.name,
          error: error.message
        });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Created ${results.length}/8 speakers. ${errors.length} failed.`,
        results,
        errors
      }, { status: 207 }); // 207 Multi-Status
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created all ${results.length} speakers!`,
      results,
      summary: {
        totalCreated: results.length,
        keynoteCount: results.filter(r => r.isKeynote).length,
        featuredCount: results.filter(r => r.isFeatured).length,
        nextSteps: [
          'Add profile images in Sanity Studio',
          'Visit http://localhost:3333/structure/speakers to manage content',
          'Check http://localhost:3000/speakers to see results'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Error in speaker population:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to populate speaker data',
      error: error.message
    }, { status: 500 });
  }
}
