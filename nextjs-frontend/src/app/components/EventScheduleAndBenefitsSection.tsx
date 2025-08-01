'use client';

import React, { useState, useEffect } from 'react';
import EventScheduleSection from './EventScheduleSection';
import ParticipationBenefitsSection from './ParticipationBenefitsSection';

interface Session {
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  type: string;
  isHighlighted?: boolean;
}

interface Day {
  dayNumber: number;
  date: string;
  displayDate: string;
  sessions: Session[];
}

interface EventScheduleData {
  title: string;
  isActive: boolean;
  days: Day[];
  displayOrder: number;
}

interface Benefit {
  title: string;
  description?: string;
  icon: string;
  isHighlighted?: boolean;
  displayOrder: number;
}

interface ParticipationBenefitsData {
  title: string;
  isActive: boolean;
  subtitle?: string;
  benefits: Benefit[];
  maxHeight?: string;
  backgroundColor?: string;
  displayOrder: number;
}

interface EventScheduleAndBenefitsSectionProps {
  className?: string;
}

const EventScheduleAndBenefitsSection: React.FC<EventScheduleAndBenefitsSectionProps> = ({ 
  className = '' 
}) => {
  const [scheduleData, setScheduleData] = useState<EventScheduleData | null>(null);
  const [benefitsData, setBenefitsData] = useState<ParticipationBenefitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both schedule and benefits data
        const [scheduleResponse, benefitsResponse] = await Promise.all([
          fetch('/api/event-schedule'),
          fetch('/api/participation-benefits')
        ]);

        let scheduleResult = null;
        let benefitsResult = null;

        if (scheduleResponse.ok) {
          const scheduleJson = await scheduleResponse.json();
          if (scheduleJson.success && scheduleJson.data) {
            scheduleResult = scheduleJson.data;
          }
        }

        if (benefitsResponse.ok) {
          const benefitsJson = await benefitsResponse.json();
          if (benefitsJson.success && benefitsJson.data) {
            benefitsResult = benefitsJson.data;
          }
        }

        setScheduleData(scheduleResult);
        setBenefitsData(benefitsResult);
      } catch (err) {
        console.error('Error fetching schedule and benefits data:', err);
        setError('Failed to load schedule and benefits data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show placeholder if no data exists (for development/testing)
  const hasAnyData = scheduleData?.isActive || benefitsData?.isActive;
  const showPlaceholder = !loading && !hasAnyData;

  // Don't render anything if both sections are inactive or missing (only in production)
  if (!loading && !hasAnyData && process.env.NODE_ENV === 'production') {
    return null;
  }

  if (loading) {
    return (
      <section className={`py-8 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* EXACT SKELETON MATCHING: Fixed height grid with explicit dimensions */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            style={{
              minHeight: '600px', // Force minimum height for equal columns
            }}
          >
            {/* Schedule Skeleton - EXACT DIMENSIONS (30% Larger) */}
            <div
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 animate-pulse flex flex-col"
              style={{
                height: '780px', // Increased by 30% to match content
                minHeight: '780px',
                maxHeight: '780px',
              }}
            >
              {/* Header - EXACT skeleton match */}
              <div className="text-center mb-6" style={{ flexShrink: 0 }}>
                <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-3"></div>
                <div className="w-12 h-0.5 bg-gray-300 mx-auto"></div>
              </div>

              {/* Day Tabs - EXACT skeleton match */}
              <div className="flex justify-center mb-6 gap-1" style={{ flexShrink: 0 }}>
                <div className="h-8 bg-gray-300 w-16"></div>
                <div className="h-8 bg-gray-300 w-16"></div>
              </div>

              {/* Content Area - EXACT skeleton match */}
              <div
                className="border border-gray-200 bg-gray-50 overflow-hidden"
                style={{
                  flex: 1,
                  minHeight: '400px',
                  maxHeight: '400px',
                }}
              >
                <div className="bg-white px-4 py-3 border-b border-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
                </div>
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1 h-12 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits Skeleton - EXACT DIMENSIONS (30% Larger) */}
            <div
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 animate-pulse flex flex-col"
              style={{
                height: '780px', // Increased by 30% to match content
                minHeight: '780px',
                maxHeight: '780px',
              }}
            >
              {/* Header - EXACT skeleton match */}
              <div className="text-center mb-6" style={{ flexShrink: 0 }}>
                <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-3"></div>
                <div className="w-12 h-0.5 bg-gray-300 mx-auto"></div>
              </div>

              {/* Content Area - EXACT skeleton match */}
              <div
                className="border border-gray-200 bg-gray-50 overflow-hidden"
                style={{
                  flex: 1,
                  minHeight: '460px', // Slightly larger for benefits (no day tabs)
                  maxHeight: '460px',
                }}
              >
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Schedule & Benefits
              </h3>
              <p className="text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show placeholder when no data exists (development mode)
  if (showPlaceholder) {
    return (
      <section className={`py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Event Schedule & Participation Benefits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This section will display the conference schedule and participation benefits once configured in the Sanity CMS.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Schedule Placeholder */}
            <div className="bg-gray-900 rounded-xl p-6 md:p-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Event Schedule
                </h3>
                <div className="w-16 h-1 bg-green-500 mx-auto rounded-full"></div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-center text-gray-300">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-lg mb-2">No schedule configured</p>
                  <p className="text-sm opacity-75">
                    Add an Event Schedule document in Sanity CMS to display the conference schedule here.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Placeholder */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Participation Benefits
                </h3>
                <div className="w-16 h-1 bg-green-500 mx-auto rounded-full"></div>
              </div>
              <div className="text-center text-gray-600">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-lg mb-2">No benefits configured</p>
                <p className="text-sm opacity-75">
                  Add a Participation Benefits document in Sanity CMS to display the benefits here.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm">
                <strong>For Administrators:</strong> Go to your Sanity Studio to create "Event Schedule" and "Participation Benefits" documents to populate this section.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Each Column Contains Its Own Heading + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Event Schedule Column - Heading + Content */}
          <div className="order-1">
            {/* Event Schedule Heading */}
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                Event <span className="text-orange-500">Schedule</span>
              </h2>
              <div className="w-16 h-0.5 bg-orange-500 mx-auto lg:mx-0 mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">
                Detailed timeline of all conference sessions and activities
              </p>
            </div>

            {/* Event Schedule Content - Fixed Equal Height (30% Larger) */}
            <div
              style={{
                display: 'flex',
                height: '780px', // Increased by 30% (600px × 1.3)
                minHeight: '780px',
                maxHeight: '780px',
              }}
            >
              <EventScheduleSection scheduleData={scheduleData} />
            </div>
          </div>

          {/* Participation Benefits Column - Heading + Content */}
          <div className="order-2">
            {/* Participation Benefits Heading */}
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                Participation <span className="text-orange-500">Benefits</span>
              </h2>
              <div className="w-16 h-0.5 bg-orange-500 mx-auto lg:mx-0 mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">
                Exclusive advantages and opportunities for conference attendees
              </p>
            </div>

            {/* Participation Benefits Content - Fixed Equal Height (30% Larger) */}
            <div
              style={{
                display: 'flex',
                height: '780px', // Increased by 30% (600px × 1.3)
                minHeight: '780px',
                maxHeight: '780px',
              }}
            >
              <ParticipationBenefitsSection benefitsData={benefitsData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventScheduleAndBenefitsSection;
