/**
 * Rate Limit Manager
 * Tracks GitHub API rate limit state and manages automatic retries
 */

const RATE_LIMIT_STORAGE_KEY = 'github_rate_limit_reset'
const RATE_LIMIT_REMAINING_KEY = 'github_rate_limit_remaining'

export interface RateLimitInfo {
  resetTime: number | null
  remaining: number | null
}

/**
 * Get the stored rate limit reset time
 */
export function getRateLimitResetTime(): number | null {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY)
    if (!stored) return null
    
    const resetTime = parseInt(stored, 10)
    const now = Date.now()
    
    // If reset time has passed, clear it
    if (resetTime <= now) {
      clearRateLimitInfo()
      return null
    }
    
    return resetTime
  } catch {
    return null
  }
}

/**
 * Get the remaining rate limit count
 */
export function getRateLimitRemaining(): number | null {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_REMAINING_KEY)
    if (!stored) return null
    return parseInt(stored, 10)
  } catch {
    return null
  }
}

/**
 * Check if we're currently rate limited
 */
export function isRateLimited(): boolean {
  const resetTime = getRateLimitResetTime()
  return resetTime !== null && Date.now() < resetTime
}

/**
 * Get time until rate limit resets (in milliseconds)
 */
export function getTimeUntilReset(): number {
  const resetTime = getRateLimitResetTime()
  if (!resetTime) return 0
  const now = Date.now()
  return Math.max(0, resetTime - now)
}

/**
 * Update rate limit info from API response headers
 */
export function updateRateLimitInfo(headers: Headers): void {
  try {
    const remaining = headers.get('X-RateLimit-Remaining')
    const reset = headers.get('X-RateLimit-Reset')
    
    if (remaining !== null) {
      localStorage.setItem(RATE_LIMIT_REMAINING_KEY, remaining)
    }
    
    if (reset !== null) {
      const resetTime = parseInt(reset, 10) * 1000 // Convert to milliseconds
      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, resetTime.toString())
    }
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Clear rate limit info
 */
export function clearRateLimitInfo(): void {
  try {
    localStorage.removeItem(RATE_LIMIT_STORAGE_KEY)
    localStorage.removeItem(RATE_LIMIT_REMAINING_KEY)
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Wait until rate limit resets
 */
export function waitForRateLimitReset(): Promise<void> {
  return new Promise((resolve) => {
    const resetTime = getRateLimitResetTime()
    if (!resetTime) {
      resolve()
      return
    }
    
    const now = Date.now()
    const waitTime = Math.max(0, resetTime - now)
    
    if (waitTime === 0) {
      clearRateLimitInfo()
      resolve()
      return
    }
    
    // Add a small buffer (1 second) to ensure rate limit has reset
    setTimeout(() => {
      clearRateLimitInfo()
      resolve()
    }, waitTime + 1000)
  })
}

