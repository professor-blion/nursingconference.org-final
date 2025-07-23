// Comprehensive country list based on ISO 3166-1 standard
// This file provides both country codes and full names for consistent handling

export interface Country {
  code: string;
  name: string;
  region?: string;
}

// Complete list of countries with proper capitalization and spelling
export const COUNTRIES: Country[] = [
  // Major countries first (most commonly selected)
  { code: 'US', name: 'United States', region: 'North America' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { code: 'CA', name: 'Canada', region: 'North America' },
  { code: 'AU', name: 'Australia', region: 'Oceania' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'IN', name: 'India', region: 'Asia' },
  { code: 'CN', name: 'China', region: 'Asia' },
  { code: 'JP', name: 'Japan', region: 'Asia' },
  { code: 'BR', name: 'Brazil', region: 'South America' },
  
  // All other countries alphabetically
  { code: 'AF', name: 'Afghanistan', region: 'Asia' },
  { code: 'AL', name: 'Albania', region: 'Europe' },
  { code: 'DZ', name: 'Algeria', region: 'Africa' },
  { code: 'AD', name: 'Andorra', region: 'Europe' },
  { code: 'AO', name: 'Angola', region: 'Africa' },
  { code: 'AG', name: 'Antigua and Barbuda', region: 'North America' },
  { code: 'AR', name: 'Argentina', region: 'South America' },
  { code: 'AM', name: 'Armenia', region: 'Asia' },
  { code: 'AT', name: 'Austria', region: 'Europe' },
  { code: 'AZ', name: 'Azerbaijan', region: 'Asia' },
  { code: 'BS', name: 'Bahamas', region: 'North America' },
  { code: 'BH', name: 'Bahrain', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', region: 'Asia' },
  { code: 'BB', name: 'Barbados', region: 'North America' },
  { code: 'BY', name: 'Belarus', region: 'Europe' },
  { code: 'BE', name: 'Belgium', region: 'Europe' },
  { code: 'BZ', name: 'Belize', region: 'North America' },
  { code: 'BJ', name: 'Benin', region: 'Africa' },
  { code: 'BT', name: 'Bhutan', region: 'Asia' },
  { code: 'BO', name: 'Bolivia', region: 'South America' },
  { code: 'BA', name: 'Bosnia and Herzegovina', region: 'Europe' },
  { code: 'BW', name: 'Botswana', region: 'Africa' },
  { code: 'BN', name: 'Brunei', region: 'Asia' },
  { code: 'BG', name: 'Bulgaria', region: 'Europe' },
  { code: 'BF', name: 'Burkina Faso', region: 'Africa' },
  { code: 'BI', name: 'Burundi', region: 'Africa' },
  { code: 'CV', name: 'Cape Verde', region: 'Africa' },
  { code: 'KH', name: 'Cambodia', region: 'Asia' },
  { code: 'CM', name: 'Cameroon', region: 'Africa' },
  { code: 'CF', name: 'Central African Republic', region: 'Africa' },
  { code: 'TD', name: 'Chad', region: 'Africa' },
  { code: 'CL', name: 'Chile', region: 'South America' },
  { code: 'CO', name: 'Colombia', region: 'South America' },
  { code: 'KM', name: 'Comoros', region: 'Africa' },
  { code: 'CG', name: 'Congo', region: 'Africa' },
  { code: 'CD', name: 'Congo (Democratic Republic)', region: 'Africa' },
  { code: 'CR', name: 'Costa Rica', region: 'North America' },
  { code: 'CI', name: 'Côte d\'Ivoire', region: 'Africa' },
  { code: 'HR', name: 'Croatia', region: 'Europe' },
  { code: 'CU', name: 'Cuba', region: 'North America' },
  { code: 'CY', name: 'Cyprus', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', region: 'Europe' },
  { code: 'DK', name: 'Denmark', region: 'Europe' },
  { code: 'DJ', name: 'Djibouti', region: 'Africa' },
  { code: 'DM', name: 'Dominica', region: 'North America' },
  { code: 'DO', name: 'Dominican Republic', region: 'North America' },
  { code: 'EC', name: 'Ecuador', region: 'South America' },
  { code: 'EG', name: 'Egypt', region: 'Africa' },
  { code: 'SV', name: 'El Salvador', region: 'North America' },
  { code: 'GQ', name: 'Equatorial Guinea', region: 'Africa' },
  { code: 'ER', name: 'Eritrea', region: 'Africa' },
  { code: 'EE', name: 'Estonia', region: 'Europe' },
  { code: 'SZ', name: 'Eswatini', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', region: 'Africa' },
  { code: 'FJ', name: 'Fiji', region: 'Oceania' },
  { code: 'FI', name: 'Finland', region: 'Europe' },
  { code: 'GA', name: 'Gabon', region: 'Africa' },
  { code: 'GM', name: 'Gambia', region: 'Africa' },
  { code: 'GE', name: 'Georgia', region: 'Asia' },
  { code: 'GH', name: 'Ghana', region: 'Africa' },
  { code: 'GR', name: 'Greece', region: 'Europe' },
  { code: 'GD', name: 'Grenada', region: 'North America' },
  { code: 'GT', name: 'Guatemala', region: 'North America' },
  { code: 'GN', name: 'Guinea', region: 'Africa' },
  { code: 'GW', name: 'Guinea-Bissau', region: 'Africa' },
  { code: 'GY', name: 'Guyana', region: 'South America' },
  { code: 'HT', name: 'Haiti', region: 'North America' },
  { code: 'HN', name: 'Honduras', region: 'North America' },
  { code: 'HU', name: 'Hungary', region: 'Europe' },
  { code: 'IS', name: 'Iceland', region: 'Europe' },
  { code: 'ID', name: 'Indonesia', region: 'Asia' },
  { code: 'IR', name: 'Iran', region: 'Asia' },
  { code: 'IQ', name: 'Iraq', region: 'Asia' },
  { code: 'IE', name: 'Ireland', region: 'Europe' },
  { code: 'IL', name: 'Israel', region: 'Asia' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'JM', name: 'Jamaica', region: 'North America' },
  { code: 'JO', name: 'Jordan', region: 'Asia' },
  { code: 'KZ', name: 'Kazakhstan', region: 'Asia' },
  { code: 'KE', name: 'Kenya', region: 'Africa' },
  { code: 'KI', name: 'Kiribati', region: 'Oceania' },
  { code: 'KP', name: 'North Korea', region: 'Asia' },
  { code: 'KR', name: 'South Korea', region: 'Asia' },
  { code: 'KW', name: 'Kuwait', region: 'Asia' },
  { code: 'KG', name: 'Kyrgyzstan', region: 'Asia' },
  { code: 'LA', name: 'Laos', region: 'Asia' },
  { code: 'LV', name: 'Latvia', region: 'Europe' },
  { code: 'LB', name: 'Lebanon', region: 'Asia' },
  { code: 'LS', name: 'Lesotho', region: 'Africa' },
  { code: 'LR', name: 'Liberia', region: 'Africa' },
  { code: 'LY', name: 'Libya', region: 'Africa' },
  { code: 'LI', name: 'Liechtenstein', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', region: 'Europe' },
  { code: 'MG', name: 'Madagascar', region: 'Africa' },
  { code: 'MW', name: 'Malawi', region: 'Africa' },
  { code: 'MY', name: 'Malaysia', region: 'Asia' },
  { code: 'MV', name: 'Maldives', region: 'Asia' },
  { code: 'ML', name: 'Mali', region: 'Africa' },
  { code: 'MT', name: 'Malta', region: 'Europe' },
  { code: 'MH', name: 'Marshall Islands', region: 'Oceania' },
  { code: 'MR', name: 'Mauritania', region: 'Africa' },
  { code: 'MU', name: 'Mauritius', region: 'Africa' },
  { code: 'MX', name: 'Mexico', region: 'North America' },
  { code: 'FM', name: 'Micronesia', region: 'Oceania' },
  { code: 'MD', name: 'Moldova', region: 'Europe' },
  { code: 'MC', name: 'Monaco', region: 'Europe' },
  { code: 'MN', name: 'Mongolia', region: 'Asia' },
  { code: 'ME', name: 'Montenegro', region: 'Europe' },
  { code: 'MA', name: 'Morocco', region: 'Africa' },
  { code: 'MZ', name: 'Mozambique', region: 'Africa' },
  { code: 'MM', name: 'Myanmar', region: 'Asia' },
  { code: 'NA', name: 'Namibia', region: 'Africa' },
  { code: 'NR', name: 'Nauru', region: 'Oceania' },
  { code: 'NP', name: 'Nepal', region: 'Asia' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'NZ', name: 'New Zealand', region: 'Oceania' },
  { code: 'NI', name: 'Nicaragua', region: 'North America' },
  { code: 'NE', name: 'Niger', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', region: 'Africa' },
  { code: 'MK', name: 'North Macedonia', region: 'Europe' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'OM', name: 'Oman', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', region: 'Asia' },
  { code: 'PW', name: 'Palau', region: 'Oceania' },
  { code: 'PS', name: 'Palestine', region: 'Asia' },
  { code: 'PA', name: 'Panama', region: 'North America' },
  { code: 'PG', name: 'Papua New Guinea', region: 'Oceania' },
  { code: 'PY', name: 'Paraguay', region: 'South America' },
  { code: 'PE', name: 'Peru', region: 'South America' },
  { code: 'PH', name: 'Philippines', region: 'Asia' },
  { code: 'PL', name: 'Poland', region: 'Europe' },
  { code: 'PT', name: 'Portugal', region: 'Europe' },
  { code: 'QA', name: 'Qatar', region: 'Asia' },
  { code: 'RO', name: 'Romania', region: 'Europe' },
  { code: 'RU', name: 'Russia', region: 'Europe' },
  { code: 'RW', name: 'Rwanda', region: 'Africa' },
  { code: 'KN', name: 'Saint Kitts and Nevis', region: 'North America' },
  { code: 'LC', name: 'Saint Lucia', region: 'North America' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', region: 'North America' },
  { code: 'WS', name: 'Samoa', region: 'Oceania' },
  { code: 'SM', name: 'San Marino', region: 'Europe' },
  { code: 'ST', name: 'São Tomé and Príncipe', region: 'Africa' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Asia' },
  { code: 'SN', name: 'Senegal', region: 'Africa' },
  { code: 'RS', name: 'Serbia', region: 'Europe' },
  { code: 'SC', name: 'Seychelles', region: 'Africa' },
  { code: 'SL', name: 'Sierra Leone', region: 'Africa' },
  { code: 'SG', name: 'Singapore', region: 'Asia' },
  { code: 'SK', name: 'Slovakia', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', region: 'Europe' },
  { code: 'SB', name: 'Solomon Islands', region: 'Oceania' },
  { code: 'SO', name: 'Somalia', region: 'Africa' },
  { code: 'ZA', name: 'South Africa', region: 'Africa' },
  { code: 'SS', name: 'South Sudan', region: 'Africa' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'LK', name: 'Sri Lanka', region: 'Asia' },
  { code: 'SD', name: 'Sudan', region: 'Africa' },
  { code: 'SR', name: 'Suriname', region: 'South America' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'SY', name: 'Syria', region: 'Asia' },
  { code: 'TW', name: 'Taiwan', region: 'Asia' },
  { code: 'TJ', name: 'Tajikistan', region: 'Asia' },
  { code: 'TZ', name: 'Tanzania', region: 'Africa' },
  { code: 'TH', name: 'Thailand', region: 'Asia' },
  { code: 'TL', name: 'Timor-Leste', region: 'Asia' },
  { code: 'TG', name: 'Togo', region: 'Africa' },
  { code: 'TO', name: 'Tonga', region: 'Oceania' },
  { code: 'TT', name: 'Trinidad and Tobago', region: 'North America' },
  { code: 'TN', name: 'Tunisia', region: 'Africa' },
  { code: 'TR', name: 'Turkey', region: 'Asia' },
  { code: 'TM', name: 'Turkmenistan', region: 'Asia' },
  { code: 'TV', name: 'Tuvalu', region: 'Oceania' },
  { code: 'UG', name: 'Uganda', region: 'Africa' },
  { code: 'UA', name: 'Ukraine', region: 'Europe' },
  { code: 'AE', name: 'United Arab Emirates', region: 'Asia' },
  { code: 'UY', name: 'Uruguay', region: 'South America' },
  { code: 'UZ', name: 'Uzbekistan', region: 'Asia' },
  { code: 'VU', name: 'Vanuatu', region: 'Oceania' },
  { code: 'VA', name: 'Vatican City', region: 'Europe' },
  { code: 'VE', name: 'Venezuela', region: 'South America' },
  { code: 'VN', name: 'Vietnam', region: 'Asia' },
  { code: 'YE', name: 'Yemen', region: 'Asia' },
  { code: 'ZM', name: 'Zambia', region: 'Africa' },
  { code: 'ZW', name: 'Zimbabwe', region: 'Africa' },
];

// Create a map for quick lookups
export const COUNTRY_MAP = new Map<string, string>();
COUNTRIES.forEach(country => {
  COUNTRY_MAP.set(country.code, country.name);
});

// Legacy mapping for backward compatibility with existing data
export const LEGACY_COUNTRY_MAP = new Map<string, string>([
  ['US', 'United States'],
  ['UK', 'United Kingdom'], // Note: Should be GB, but keeping UK for compatibility
  ['CA', 'Canada'],
  ['AU', 'Australia'],
  ['DE', 'Germany'],
  ['FR', 'France'],
  ['IN', 'India'],
  ['CN', 'China'],
  ['JP', 'Japan'],
  ['BR', 'Brazil'],
  ['MX', 'Mexico'],
  ['ZA', 'South Africa'],
  ['NG', 'Nigeria'],
  ['EG', 'Egypt'],
  ['SA', 'Saudi Arabia'],
  ['AE', 'United Arab Emirates'],
  ['SG', 'Singapore'],
  ['MY', 'Malaysia'],
  ['TH', 'Thailand'],
  ['PH', 'Philippines'],
  ['ID', 'Indonesia'],
  ['KR', 'South Korea'],
  ['OTHER', 'Other'],
]);

// Helper functions
export const getCountryName = (code: string): string => {
  // First try the comprehensive list
  const name = COUNTRY_MAP.get(code);
  if (name) return name;
  
  // Fall back to legacy mapping
  const legacyName = LEGACY_COUNTRY_MAP.get(code);
  if (legacyName) return legacyName;
  
  // Return the code itself if no mapping found
  return code;
};

export const getCountryCode = (name: string): string => {
  const country = COUNTRIES.find(c => c.name === name);
  return country ? country.code : name;
};

// For form dropdowns - store full names instead of codes
export const getCountryOptions = () => {
  return COUNTRIES.map(country => ({
    label: country.name,
    value: country.name, // Store full name instead of code
  }));
};

// For backward compatibility - convert codes to names
export const normalizeCountryValue = (value: string): string => {
  // If it's already a full country name, return as is
  if (COUNTRIES.some(c => c.name === value)) {
    return value;
  }

  // If it's a code, convert to name
  return getCountryName(value);
};

// Simple array of country names for form dropdowns
export const countries = COUNTRIES.map(country => country.name).sort();
