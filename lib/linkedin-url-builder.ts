/**
 * LinkedIn Job Search URL Builder
 * Builds LinkedIn job search URLs from user-selected filters
 */

export interface JobFilters {
  keywords: string;
  location?: string;
  f_TPR?: number; // Time posted in seconds
  f_WT?: number | number[]; // Work type (job type)
  f_WRA?: number | number[]; // Work arrangement (remote/on-site/hybrid)
  f_E?: number | number[]; // Experience level
  sortBy?: string; // DD = Date Descending, R = Relevance
}

/**
 * Job Type (Work Type) options for f_WT parameter
 */
export const JOB_TYPES = {
  FULL_TIME: { value: 1, label: 'Full-time' },
  PART_TIME: { value: 2, label: 'Part-time' },
  CONTRACT: { value: 3, label: 'Contract' },
  TEMPORARY: { value: 4, label: 'Temporary' },
  INTERNSHIP: { value: 5, label: 'Internship' },
  VOLUNTEER: { value: 6, label: 'Volunteer' },
} as const;

/**
 * Work Arrangement options for f_WRA parameter
 */
export const WORK_MODES = {
  REMOTE: { value: 1, label: 'Remote' },
  ON_SITE: { value: 2, label: 'On-site' },
  HYBRID: { value: 3, label: 'Hybrid' },
} as const;

/**
 * Experience Level options for f_E parameter
 */
export const EXPERIENCE_LEVELS = {
  INTERNSHIP: { value: 1, label: 'Internship' },
  ENTRY_LEVEL: { value: 2, label: 'Entry level' },
  ASSOCIATE: { value: 3, label: 'Associate' },
  MID_SENIOR: { value: 4, label: 'Mid-Senior level' },
  DIRECTOR: { value: 5, label: 'Director' },
  EXECUTIVE: { value: 6, label: 'Executive' },
} as const;

/**
 * Sort options
 */
export const SORT_OPTIONS = {
  RECENT: { value: 'DD', label: 'Most recent' },
  RELEVANCE: { value: 'R', label: 'Most relevant' },
} as const;

/**
 * Time presets for f_TPR parameter (in seconds)
 */
export const TIME_PRESETS = [
  { label: '1h', seconds: 3600 },
  { label: '2h', seconds: 7200 },
  { label: '6h', seconds: 21600 },
  { label: '12h', seconds: 43200 },
  { label: '24h', seconds: 86400 },
  { label: '3d', seconds: 259200 },
  { label: '7d', seconds: 604800 },
] as const;

/**
 * Builds a LinkedIn job search URL from filters
 * @param filters - Job search filters
 * @returns Complete LinkedIn job search URL
 * @throws Error if keywords are missing
 */
export function buildLinkedInJobURL(filters: JobFilters): string {
  if (!filters.keywords || filters.keywords.trim() === '') {
    throw new Error('Job designation/keywords are required');
  }

  const base = 'https://www.linkedin.com/jobs/search/';
  const params = new URLSearchParams();

  // Add keywords (required)
  const keywords = filters.keywords.trim();
  params.set('keywords', keywords);

  // Add location (optional)
  if (filters.location && filters.location.trim()) {
    params.set('location', filters.location.trim());
  }

  // Add time posted filter (f_TPR)
  if (filters.f_TPR && filters.f_TPR > 0) {
    params.set('f_TPR', `r${filters.f_TPR}`);
  }

  // Add work type (f_WT) - can be single or multiple values
  if (filters.f_WT !== undefined) {
    if (Array.isArray(filters.f_WT)) {
      if (filters.f_WT.length > 0) {
        params.set('f_WT', filters.f_WT.join(','));
      }
    } else if (filters.f_WT > 0) {
      params.set('f_WT', filters.f_WT.toString());
    }
  }

  // Add work arrangement (f_WRA) - can be single or multiple values
  if (filters.f_WRA !== undefined) {
    if (Array.isArray(filters.f_WRA)) {
      if (filters.f_WRA.length > 0) {
        params.set('f_WRA', filters.f_WRA.join(','));
      }
    } else if (filters.f_WRA > 0) {
      params.set('f_WRA', filters.f_WRA.toString());
    }
  }

  // Add experience level (f_E) - can be single or multiple values
  if (filters.f_E !== undefined) {
    if (Array.isArray(filters.f_E)) {
      if (filters.f_E.length > 0) {
        params.set('f_E', filters.f_E.join(','));
      }
    } else if (filters.f_E > 0) {
      params.set('f_E', filters.f_E.toString());
    }
  }

  // Add sort option
  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy);
  }

  return `${base}?${params.toString()}`;
}

/**
 * Validates job search filters
 * @param filters - Filters to validate
 * @returns Validation result with any errors
 */
export function validateFilters(filters: JobFilters): {
  isValid: boolean;
  error?: string;
} {
  if (!filters.keywords || filters.keywords.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a job designation or keywords',
    };
  }

  if (filters.keywords.trim().length < 2) {
    return {
      isValid: false,
      error: 'Keywords must be at least 2 characters long',
    };
  }

  return { isValid: true };
}

/**
 * Formats seconds to human-readable format
 * @param seconds - Number of seconds
 * @returns Human-readable string (e.g., "1 hour", "24 hours")
 */
export function formatTimePosted(seconds: number): string {
  const hours = seconds / 3600;
  const days = seconds / 86400;

  if (days >= 1 && days === Math.floor(days)) {
    return days === 1 ? '1 day' : `${days} days`;
  }
  if (hours >= 1 && hours === Math.floor(hours)) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  return 'Any time';
}

/**
 * Gets label for selected filters (for display purposes)
 */
export function getFilterSummary(filters: JobFilters): string {
  const parts: string[] = [];

  if (filters.keywords) {
    parts.push(`"${filters.keywords}"`);
  }

  if (filters.location) {
    parts.push(`in ${filters.location}`);
  }

  return parts.join(' ') || 'Job search';
}
