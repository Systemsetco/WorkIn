import { describe, it, expect } from 'vitest'
import { 
  buildLinkedInJobURL,
  validateFilters,
  formatTimePosted,
  getFilterSummary,
  JOB_TYPES,
  WORK_MODES,
  EXPERIENCE_LEVELS,
  type JobFilters
} from '@/lib/linkedin-url-builder'

describe('buildLinkedInJobURL', () => {
  it('should build basic URL with only keywords', () => {
    const filters: JobFilters = {
      keywords: 'Python Developer',
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('https://www.linkedin.com/jobs/search/')
    expect(result).toContain('keywords=Python+Developer')
  })

  it('should include location when provided', () => {
    const filters: JobFilters = {
      keywords: 'Developer',
      location: 'Karachi',
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('keywords=Developer')
    expect(result).toContain('location=Karachi')
  })

  it('should include time posted filter (f_TPR)', () => {
    const filters: JobFilters = {
      keywords: 'Engineer',
      f_TPR: 3600,
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('f_TPR=r3600')
  })

  it('should include job type (f_WT)', () => {
    const filters: JobFilters = {
      keywords: 'Designer',
      f_WT: JOB_TYPES.FULL_TIME.value,
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('f_WT=1')
  })

  it('should include work mode (f_WRA)', () => {
    const filters: JobFilters = {
      keywords: 'Manager',
      f_WRA: WORK_MODES.REMOTE.value,
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('f_WRA=1')
  })

  it('should include experience level (f_E)', () => {
    const filters: JobFilters = {
      keywords: 'Analyst',
      f_E: EXPERIENCE_LEVELS.ENTRY_LEVEL.value,
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('f_E=2')
  })

  it('should include sortBy option', () => {
    const filters: JobFilters = {
      keywords: 'Developer',
      sortBy: 'DD',
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('sortBy=DD')
  })

  it('should build complete URL with all filters', () => {
    const filters: JobFilters = {
      keywords: 'Python Developer',
      location: 'Karachi',
      f_TPR: 3600,
      f_WT: JOB_TYPES.FULL_TIME.value,
      f_WRA: WORK_MODES.REMOTE.value,
      f_E: EXPERIENCE_LEVELS.ENTRY_LEVEL.value,
      sortBy: 'DD',
    }
    const result = buildLinkedInJobURL(filters)
    
    expect(result).toContain('https://www.linkedin.com/jobs/search/')
    expect(result).toContain('keywords=Python+Developer')
    expect(result).toContain('location=Karachi')
    expect(result).toContain('f_TPR=r3600')
    expect(result).toContain('f_WT=1')
    expect(result).toContain('f_WRA=1')
    expect(result).toContain('f_E=2')
    expect(result).toContain('sortBy=DD')
  })

  it('should throw error when keywords are missing', () => {
    const filters: JobFilters = {
      keywords: '',
    }
    expect(() => buildLinkedInJobURL(filters)).toThrow('Job designation/keywords are required')
  })

  it('should handle keywords with special characters', () => {
    const filters: JobFilters = {
      keywords: 'UI/UX Designer',
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('keywords=UI%2FUX+Designer')
  })

  it('should trim whitespace from keywords and location', () => {
    const filters: JobFilters = {
      keywords: '  Developer  ',
      location: '  New York  ',
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('keywords=Developer')
    expect(result).toContain('location=New+York')
  })

  it('should handle multiple job types as array', () => {
    const filters: JobFilters = {
      keywords: 'Developer',
      f_WT: [JOB_TYPES.FULL_TIME.value, JOB_TYPES.PART_TIME.value],
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('f_WT=1%2C2')
  })

  it('should handle multiple work modes as array', () => {
    const filters: JobFilters = {
      keywords: 'Engineer',
      f_WRA: [WORK_MODES.REMOTE.value, WORK_MODES.HYBRID.value],
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('f_WRA=1%2C3')
  })

  it('should handle multiple experience levels as array', () => {
    const filters: JobFilters = {
      keywords: 'Manager',
      f_E: [EXPERIENCE_LEVELS.MID_SENIOR.value, EXPERIENCE_LEVELS.DIRECTOR.value],
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).toContain('f_E=4%2C5')
  })

  it('should omit optional filters when not provided', () => {
    const filters: JobFilters = {
      keywords: 'Developer',
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).not.toContain('location=')
    expect(result).not.toContain('f_TPR=')
    expect(result).not.toContain('f_WT=')
    expect(result).not.toContain('f_WRA=')
    expect(result).not.toContain('f_E=')
  })

  it('should not include f_TPR when set to 0', () => {
    const filters: JobFilters = {
      keywords: 'Developer',
      f_TPR: 0,
    }
    const result = buildLinkedInJobURL(filters)
    expect(result).not.toContain('f_TPR=')
  })
})

describe('validateFilters', () => {
  it('should validate correct filters', () => {
    const filters: JobFilters = {
      keywords: 'Developer',
    }
    const result = validateFilters(filters)
    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should return error for empty keywords', () => {
    const filters: JobFilters = {
      keywords: '',
    }
    const result = validateFilters(filters)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Please enter a job designation or keywords')
  })

  it('should return error for whitespace-only keywords', () => {
    const filters: JobFilters = {
      keywords: '   ',
    }
    const result = validateFilters(filters)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Please enter a job designation or keywords')
  })

  it('should return error for keywords shorter than 2 characters', () => {
    const filters: JobFilters = {
      keywords: 'A',
    }
    const result = validateFilters(filters)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Keywords must be at least 2 characters long')
  })
})

describe('formatTimePosted', () => {
  it('should format hours correctly', () => {
    expect(formatTimePosted(3600)).toBe('1 hour')
    expect(formatTimePosted(7200)).toBe('2 hours')
    expect(formatTimePosted(43200)).toBe('12 hours')
  })

  it('should format days correctly', () => {
    expect(formatTimePosted(86400)).toBe('1 day')
    expect(formatTimePosted(172800)).toBe('2 days')
    expect(formatTimePosted(604800)).toBe('7 days')
  })

  it('should return "Any time" for non-standard values', () => {
    expect(formatTimePosted(90)).toBe('Any time')
    expect(formatTimePosted(5000)).toBe('Any time')
  })
})

describe('getFilterSummary', () => {
  it('should return summary with keywords only', () => {
    const filters: JobFilters = {
      keywords: 'Developer',
    }
    const result = getFilterSummary(filters)
    expect(result).toBe('"Developer"')
  })

  it('should return summary with keywords and location', () => {
    const filters: JobFilters = {
      keywords: 'Python Developer',
      location: 'Karachi',
    }
    const result = getFilterSummary(filters)
    expect(result).toBe('"Python Developer" in Karachi')
  })

  it('should return default for empty filters', () => {
    const filters: JobFilters = {
      keywords: '',
    }
    const result = getFilterSummary(filters)
    expect(result).toBe('Job search')
  })
})

describe('Constants', () => {
  it('should have correct job type values', () => {
    expect(JOB_TYPES.FULL_TIME.value).toBe(1)
    expect(JOB_TYPES.PART_TIME.value).toBe(2)
    expect(JOB_TYPES.CONTRACT.value).toBe(3)
    expect(JOB_TYPES.TEMPORARY.value).toBe(4)
    expect(JOB_TYPES.INTERNSHIP.value).toBe(5)
    expect(JOB_TYPES.VOLUNTEER.value).toBe(6)
  })

  it('should have correct work mode values', () => {
    expect(WORK_MODES.REMOTE.value).toBe(1)
    expect(WORK_MODES.ON_SITE.value).toBe(2)
    expect(WORK_MODES.HYBRID.value).toBe(3)
  })

  it('should have correct experience level values', () => {
    expect(EXPERIENCE_LEVELS.INTERNSHIP.value).toBe(1)
    expect(EXPERIENCE_LEVELS.ENTRY_LEVEL.value).toBe(2)
    expect(EXPERIENCE_LEVELS.ASSOCIATE.value).toBe(3)
    expect(EXPERIENCE_LEVELS.MID_SENIOR.value).toBe(4)
    expect(EXPERIENCE_LEVELS.DIRECTOR.value).toBe(5)
    expect(EXPERIENCE_LEVELS.EXECUTIVE.value).toBe(6)
  })
})
