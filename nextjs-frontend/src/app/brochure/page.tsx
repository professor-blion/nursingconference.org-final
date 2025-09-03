import { Metadata } from 'next';
import Image from 'next/image';
import BrochureDownloadForm from './BrochureDownloadForm';
import { getSiteSettings, getFullBrandName } from '../getSiteSettings';

export async function generateMetadata(): Promise<Metadata> {
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for brochure metadata:', error);
  }

  const fullBrandName = getFullBrandName(siteSettings);

  return {
    title: `Download Brochure | ${fullBrandName}`,
    description: 'Download our comprehensive conference brochure to learn more about upcoming events, speakers, and opportunities.',
    keywords: 'conference brochure, download, nursing conferences, medical events, healthcare',
    openGraph: {
      title: 'Download Conference Brochure',
      description: 'Get detailed information about our upcoming conferences and events.',
      type: 'website',
    },
  };
}

async function getBrochureSettings() {
  try {
    // Import Sanity client directly to fetch brochure settings
    const { client } = await import('../sanity/client');

    const query = `*[_type == "brochureSettings" && _id == "brochureSettings"][0] {
      title,
      description,
      heroBackgroundImage {
        asset-> {
          _id,
          url
        }
      },
      heroOverlayOpacity,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename
        }
      }
    }`;

    const brochureSettings = await client.fetch(query, {}, {
      // Disable caching to ensure fresh data
      cache: 'no-store'
    });

    // Convert image asset to URL for easier use
    if (brochureSettings?.heroBackgroundImage?.asset?.url) {
      brochureSettings.heroBackgroundImageUrl = brochureSettings.heroBackgroundImage.asset.url;
    }

    return brochureSettings || null;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load brochure settings:', e);
    }
    return null;
  }
}

function BrochureHeroClient({ imageUrl, overlayPercent }: { imageUrl?: string; overlayPercent?: number }) {
  // Force overlay to exactly 60% as requested
  const opacity = 0.6;
  // Account for fixed/sticky header overlap with top padding (increase to clear both top bars)
  const headerOffset = 'pt-32 md:pt-40';
  return (
    <section
      className={`relative text-white ${headerOffset} pb-16 md:pb-24`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Fallback gradient only when no image */}
      {!imageUrl ? (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900" />
      ) : null}
      {/* Black overlay at requested opacity (0.4 – 0.6) */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md">
            BROCHURE FORM
          </h1>
          <nav className="mt-2 md:mt-3 text-sm md:text-base text-blue-100">
            <span>Home</span>
            <span className="mx-2">»</span>
            <span>Brochure Form</span>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default async function BrochurePage() {
  // Load CMS hero settings server-side (SSR)
  let heroImageUrl: string | undefined = undefined;
  let overlayPercent: number | undefined = 40;

  try {
    const data = await getBrochureSettings();
    if (data) {
      heroImageUrl = data.heroBackgroundImageUrl || data.imageUrl || undefined;
      overlayPercent = typeof data.heroOverlayOpacity === 'number' ? data.heroOverlayOpacity : 40;
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Brochure hero settings fetch failed, using defaults.', e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - CMS background with overlay matching About page style */}
      <BrochureHeroClient imageUrl={heroImageUrl} overlayPercent={overlayPercent} />

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Brochure Form
                </h2>
                <p className="text-gray-600 text-sm">
                  To download the brochure please fill out the below form
                </p>
              </div>

              <BrochureDownloadForm />
            </div>

            {/* Right Column - Download Section */}
            <div className="rounded-lg shadow-lg p-8 text-white" style={{backgroundColor: '#0b2a6b'}}>
              <div className="text-left sm:text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f97316] rounded-full mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-white">
                  Download Conference Brochure
                </h3>
                <p className="text-white text-sm mb-6 leading-relaxed">
                  Submit the form on the left to get instant access to our comprehensive conference brochure with all details about speakers, schedule, and registration information.
                </p>
                <div className="text-sm text-white space-y-2">
                  <p className="flex items-start gap-2"><span className="text-white">✓</span> <span className="text-white">Complete conference schedule</span></p>
                  <p className="flex items-start gap-2"><span className="text-white">✓</span> <span className="text-white">Speaker profiles and abstracts</span></p>
                  <p className="flex items-start gap-2"><span className="text-white">✓</span> <span className="text-white">Registration information</span></p>
                  <p className="flex items-start gap-2"><span className="text-white">✓</span> <span className="text-white">Venue and accommodation details</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
