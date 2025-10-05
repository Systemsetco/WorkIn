import { describe, it, expect } from 'vitest'
import { 
  modifyLinkedInJobSearchURL, 
  validateLinkedInURL, 
  formatSeconds 
} from '@/lib/url-modifier'

describe('modifyLinkedInJobSearchURL', () => {
  it('should add f_TPR parameter when missing', () => {
    const url = 'https://www.linkedin.com/jobs/search/?keywords=developer'
    const result = modifyLinkedInJobSearchURL(url, 3600)
    expect(result).toBe('https://www.linkedin.com/jobs/search/?keywords=developer&f_TPR=r3600')
  })

  it('should replace existing f_TPR parameter', () => {
    const url = 'https://www.linkedin.com/jobs/search/?f_TPR=r86400&keywords=developer'
    const result = modifyLinkedInJobSearchURL(url, 3600)
    expect(result).toContain('f_TPR=r3600')
    expect(result).not.toContain('f_TPR=r86400')
  })

  it('should preserve other query parameters', () => {
    const url = 'https://www.linkedin.com/jobs/search/?currentJobId=123&keywords=python&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON'
    const result = modifyLinkedInJobSearchURL(url, 7200)
    expect(result).toContain('currentJobId=123')
    expect(result).toContain('keywords=python')
    expect(result).toContain('origin=JOB_SEARCH_PAGE_SEARCH_BUTTON')
    expect(result).toContain('f_TPR=r7200')
  })

  it('should normalize URL without protocol', () => {
    const url = 'linkedin.com/jobs/search/?keywords=developer'
    const result = modifyLinkedInJobSearchURL(url, 1800)
    expect(result).toContain('https://')
    expect(result).toContain('f_TPR=r1800')
  })

  it('should preserve URL hash/fragment', () => {
    const url = 'https://www.linkedin.com/jobs/search/?keywords=developer#section'
    const result = modifyLinkedInJobSearchURL(url, 3600)
    expect(result).toContain('#section')
  })

  it('should floor decimal seconds to integer', () => {
    const url = 'https://www.linkedin.com/jobs/search/'
    const result = modifyLinkedInJobSearchURL(url, 3600.7)
    expect(result).toContain('f_TPR=r3600')
  })

  it('should enforce minimum of 1 second', () => {
    const url = 'https://www.linkedin.com/jobs/search/'
    const result = modifyLinkedInJobSearchURL(url, 0)
    expect(result).toContain('f_TPR=r1')
  })

  it('should handle negative seconds by using minimum', () => {
    const url = 'https://www.linkedin.com/jobs/search/'
    const result = modifyLinkedInJobSearchURL(url, -100)
    expect(result).toContain('f_TPR=r1')
  })

  it('should throw error for invalid URL', () => {
    expect(() => {
      modifyLinkedInJobSearchURL('not a valid url', 3600)
    }).toThrow('Invalid URL format')
  })

  it('should throw error for non-LinkedIn URL', () => {
    expect(() => {
      modifyLinkedInJobSearchURL('https://www.google.com/search', 3600)
    }).toThrow('Provided URL is not a LinkedIn URL')
  })

  it('should handle URLs with encoded characters', () => {
    const url = 'https://www.linkedin.com/jobs/search/?keywords=python%20developer&location=New%20York'
    const result = modifyLinkedInJobSearchURL(url, 43200)
    expect(result).toContain('keywords=python%20developer')
    expect(result).toContain('location=New%20York')
    expect(result).toContain('f_TPR=r43200')
  })

  it('should work with www and non-www LinkedIn URLs', () => {
    const url1 = 'https://www.linkedin.com/jobs/search/'
    const url2 = 'https://linkedin.com/jobs/search/'
    
    const result1 = modifyLinkedInJobSearchURL(url1, 3600)
    const result2 = modifyLinkedInJobSearchURL(url2, 3600)
    
    expect(result1).toContain('f_TPR=r3600')
    expect(result2).toContain('f_TPR=r3600')
  })

  it('should handle multiple existing f_TPR parameters (URLSearchParams normalizes)', () => {
    // Manually construct URL with duplicate params
    const url = 'https://www.linkedin.com/jobs/search/?f_TPR=r86400&f_TPR=r43200'
    const result = modifyLinkedInJobSearchURL(url, 1800)
    expect(result).toContain('f_TPR=r1800')
    // Should only have one f_TPR after set
    const matches = result.match(/f_TPR=r\d+/g)
    expect(matches?.length).toBe(1)
  })
})

describe('validateLinkedInURL', () => {
  it('should validate correct LinkedIn job search URL', () => {
    const result = validateLinkedInURL('https://www.linkedin.com/jobs/search/?keywords=developer')
    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.isJobSearchPath).toBe(true)
  })

  it('should return error for empty URL', () => {
    const result = validateLinkedInURL('')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Please enter a URL')
  })

  it('should return error for invalid URL format', () => {
    const result = validateLinkedInURL('not a valid url')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Invalid URL format')
  })

  it('should return error for non-LinkedIn URL', () => {
    const result = validateLinkedInURL('https://www.google.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Not a LinkedIn URL')
  })

  it('should return warning for non-job-search path', () => {
    const result = validateLinkedInURL('https://www.linkedin.com/feed/')
    expect(result.isValid).toBe(true)
    expect(result.warning).toBeDefined()
    expect(result.isJobSearchPath).toBe(false)
  })

  it('should handle URL without protocol', () => {
    const result = validateLinkedInURL('linkedin.com/jobs/search/')
    expect(result.isValid).toBe(true)
    expect(result.isJobSearchPath).toBe(true)
  })
})

describe('formatSeconds', () => {
  it('should format seconds correctly', () => {
    expect(formatSeconds(30)).toBe('30 seconds')
    expect(formatSeconds(1)).toBe('1 second')
  })

  it('should format minutes correctly', () => {
    expect(formatSeconds(60)).toBe('1 minute')
    expect(formatSeconds(120)).toBe('2 minutes')
    expect(formatSeconds(1800)).toBe('30 minutes')
  })

  it('should format hours correctly', () => {
    expect(formatSeconds(3600)).toBe('1 hour')
    expect(formatSeconds(7200)).toBe('2 hours')
  })

  it('should format days correctly', () => {
    expect(formatSeconds(86400)).toBe('1 day')
    expect(formatSeconds(172800)).toBe('2 days')
    expect(formatSeconds(604800)).toBe('7 days')
  })

  it('should format combined time units', () => {
    expect(formatSeconds(3661)).toBe('1 hour, 1 minute, 1 second')
    expect(formatSeconds(90061)).toBe('1 day, 1 hour, 1 minute, 1 second')
  })

  it('should handle zero seconds', () => {
    expect(formatSeconds(0)).toBe('0 seconds')
  })

  it('should not show seconds when larger units exist', () => {
    expect(formatSeconds(3660)).toBe('1 hour, 1 minute')
    expect(formatSeconds(86460)).toBe('1 day, 1 minute')
  })
})
