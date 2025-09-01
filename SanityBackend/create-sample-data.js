// Script to create sample Event Schedule and Participation Benefits data in Sanity
// Run this in Sanity Studio's Vision tool or use the Sanity CLI

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fl5uetho',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN // You'll need to set this
});

const sampleEventSchedule = {
  _type: 'eventSchedule',
  title: 'Schedule',
  isActive: true,
  displayOrder: 1,
  days: [
    {
      _type: 'day',
      dayNumber: 1,
      date: '2025-08-04',
      displayDate: 'August 04, 2025',
      sessions: [
        {
          _type: 'session',
          startTime: '08:00',
          endTime: '09:00',
          title: 'Registration',
          description: 'Conference registration and welcome reception',
          type: 'registration',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '09:00',
          endTime: '09:30',
          title: 'Opening Ceremony And Introduction',
          description: 'Welcome address and conference overview',
          type: 'opening',
          isHighlighted: true
        },
        {
          _type: 'session',
          startTime: '09:30',
          endTime: '10:30',
          title: 'Keynote Session I',
          description: 'Featured keynote presentation by renowned expert',
          type: 'keynote',
          isHighlighted: true
        },
        {
          _type: 'session',
          startTime: '10:30',
          endTime: '11:00',
          title: 'Refreshment Break',
          description: 'Coffee break and networking opportunity',
          type: 'break',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '11:00',
          endTime: '12:30',
          title: 'Keynote Session II',
          description: 'Second keynote presentation',
          type: 'keynote',
          isHighlighted: true
        },
        {
          _type: 'session',
          startTime: '12:30',
          endTime: '13:00',
          title: 'Plenary Session I',
          description: 'Interactive plenary discussion',
          type: 'plenary',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '13:00',
          endTime: '14:00',
          title: 'Lunch Break',
          description: 'Networking lunch with fellow attendees',
          type: 'lunch',
          isHighlighted: false
        }
      ]
    },
    {
      _type: 'day',
      dayNumber: 2,
      date: '2025-08-05',
      displayDate: 'August 05, 2025',
      sessions: [
        // Day 2 sessions can be added later by administrators
      ]
    }
  ]
};

const sampleParticipationBenefits = {
  _type: 'participationBenefits',
  title: 'Participation Benefits',
  isActive: true,
  subtitle: '',
  displayOrder: 1,
  maxHeight: '400px',
  backgroundColor: 'white',
  benefits: [
    {
      _type: 'benefit',
      title: 'All programs entry',
      description: 'Access to all conference sessions, workshops, and presentations',
      icon: 'check',
      isHighlighted: false,
      displayOrder: 1
    },
    {
      _type: 'benefit',
      title: 'Reception banquet',
      description: 'Welcome reception and networking dinner',
      icon: 'food',
      isHighlighted: false,
      displayOrder: 2
    },
    {
      _type: 'benefit',
      title: '2 Coffee breaks and snacks during the two days',
      description: 'Refreshments and networking opportunities throughout the event',
      icon: 'coffee',
      isHighlighted: false,
      displayOrder: 3
    },
    {
      _type: 'benefit',
      title: 'Handbook',
      description: 'Comprehensive conference handbook with all session details',
      icon: 'book',
      isHighlighted: false,
      displayOrder: 4
    },
    {
      _type: 'benefit',
      title: 'Lunch during the conference',
      description: 'Catered lunch on both conference days',
      icon: 'food',
      isHighlighted: false,
      displayOrder: 5
    },
    {
      _type: 'benefit',
      title: 'Conference souvenir',
      description: 'Commemorative items and conference materials',
      icon: 'gift',
      isHighlighted: false,
      displayOrder: 6
    },
    {
      _type: 'benefit',
      title: 'Abstracts will be published in our refereed journal as a special issue',
      description: 'Your research will be published in our peer-reviewed journal',
      icon: 'certificate',
      isHighlighted: true,
      displayOrder: 7
    },
    {
      _type: 'benefit',
      title: '25% Discount on the manuscript publication fee',
      description: 'Reduced publication costs for conference participants',
      icon: 'star',
      isHighlighted: true,
      displayOrder: 8
    },
    {
      _type: 'benefit',
      title: '5% discount on the Inovinemeetings Group membership',
      description: 'Special membership pricing for ongoing benefits',
      icon: 'badge',
      isHighlighted: false,
      displayOrder: 9
    },
    {
      _type: 'benefit',
      title: 'Certification by the organizing committee',
      description: 'Official certificate of participation and completion',
      icon: 'certificate',
      isHighlighted: false,
      displayOrder: 10
    }
  ]
};

async function createSampleData() {
  try {
    console.log('Creating sample Event Schedule...');
    const scheduleResult = await client.create(sampleEventSchedule);
    console.log('✅ Event Schedule created:', scheduleResult._id);

    console.log('Creating sample Participation Benefits...');
    const benefitsResult = await client.create(sampleParticipationBenefits);
    console.log('✅ Participation Benefits created:', benefitsResult._id);

    console.log('\n🎉 Sample data created successfully!');
    console.log('The Event Schedule and Participation Benefits section should now display on the home page.');
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

// Run the script
createSampleData();
