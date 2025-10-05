/**
 * Modifies a LinkedIn job search URL by setting or replacing the f_TPR parameter
 * @param originalUrl - The original LinkedIn URL
 * @param seconds - Number of seconds for the time filter
 * @returns Modified URL with f_TPR parameter set
 * @throws Error if URL is invalid or not a LinkedIn URL
 */
export function modifyLinkedInJobSearchURL(originalUrl: string, seconds: number): string {
  const fixedSeconds = Math.max(1, Math.floor(Number(seconds) || 0));
  let normalized = originalUrl.trim();
  
  // Add protocol if missing
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }
  
  // Parse URL - will throw if invalid
  let url: URL;
  try {
    url = new URL(normalized);
  } catch (e) {
    throw new Error('Invalid URL format. Please provide a valid URL.');
  }
  
  // Validate LinkedIn domain
  if (!url.hostname.includes('linkedin.com')) {
    throw new Error('Provided URL is not a LinkedIn URL.');
  }
  
  // Set the f_TPR parameter (replaces existing or adds new)
  url.searchParams.set('f_TPR', `r${fixedSeconds}`);
  
  return url.toString();
}

/**
 * Validates if a URL is a LinkedIn job search URL
 * @param url - URL to validate
 * @returns Object with validation result and optional warning
 */
export function validateLinkedInURL(url: string): { 
  isValid: boolean; 
  error?: string; 
  warning?: string;
  isJobSearchPath?: boolean;
} {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Please enter a URL' };
  }
  
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }
  
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalized);
  } catch (e) {
    return { isValid: false, error: 'Invalid URL format' };
  }
  
  if (!parsedUrl.hostname.includes('linkedin.com')) {
    return { isValid: false, error: 'Not a LinkedIn URL' };
  }
  
  const isJobSearchPath = parsedUrl.pathname.includes('/jobs/search');
  
  if (!isJobSearchPath) {
    return { 
      isValid: true, 
      warning: 'URL doesn\'t appear to be a job search page. It will still work, but results may vary.',
      isJobSearchPath: false
    };
  }
  
  return { isValid: true, isJobSearchPath: true };
}

/**
 * Converts seconds to human-readable format
 * @param seconds - Number of seconds
 * @returns Human-readable string (e.g., "1 hour", "30 minutes")
 */
export function formatSeconds(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (secs > 0 && parts.length === 0) parts.push(`${secs} second${secs > 1 ? 's' : ''}`);
  
  return parts.join(', ') || '0 seconds';
}

/**
 * Time presets for quick selection
 */
export const TIME_PRESETS = [
  { label: '15m', seconds: 900 },
  { label: '30m', seconds: 1800 },
  { label: '1h', seconds: 3600 },
  { label: '2h', seconds: 7200 },
  { label: '6h', seconds: 21600 },
  { label: '12h', seconds: 43200 },
  { label: '24h', seconds: 86400 },
  { label: '3d', seconds: 259200 },
  { label: '7d', seconds: 604800 },
] as const;

/**
 * Time units for conversion
 */
export const TIME_UNITS = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
} as const;

export type TimeUnit = keyof typeof TIME_UNITS;
