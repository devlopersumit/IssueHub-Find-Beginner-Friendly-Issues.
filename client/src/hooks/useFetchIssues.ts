import { useEffect, useRef, useState, useMemo } from 'react'
import { getDailyCached, setDailyCached } from '../utils/requestCache'
import { 
  isRateLimited, 
  updateRateLimitInfo, 
  waitForRateLimitReset,
  getRateLimitResetTime 
} from '../utils/rateLimitManager'

type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
  updated_at?: string
  comments?: number
}

type GithubSearchResponse = { 
  total_count: number
  incomplete_results: boolean
  items: GithubIssueItem[]
}

type UseFetchIssuesResult = {
  data: GithubSearchResponse | null
  isLoading: boolean
  error: Error | null
}

const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useFetchIssues(query: string, page: number = 1, perPage: number = 20): UseFetchIssuesResult {
  const [data, setData] = useState<GithubSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const cacheKey = useMemo(() => `issues_${query}_${page}_${perPage}`, [query, page, perPage])

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchIssues(retryCount = 0): Promise<void> {
      // Check if aborted
      if (controller.signal.aborted) return

      setIsLoading(true)
      setError(null)
      
      try {
        if (!query || query.trim() === '') {
          setData({ total_count: 0, incomplete_results: false, items: [] })
          setIsLoading(false)
          return
        }

        // Always check cache first
        const cached = getDailyCached<GithubSearchResponse>(cacheKey)
        if (cached) {
          setData(cached)
          setIsLoading(false)
          
          // If we have cached data, still try to refresh in background if not rate limited
          if (!isRateLimited()) {
            // Fetch fresh data in background without blocking UI
            fetchIssuesInBackground(controller)
          }
          return
        }

        // Check if we're rate limited before making request
        if (isRateLimited()) {
          const resetTime = getRateLimitResetTime()
          if (resetTime) {
            // Use any available cached data (even from previous days)
            const anyCached = getDailyCached<GithubSearchResponse>(cacheKey)
            if (anyCached) {
              setData(anyCached)
              setIsLoading(false)
            } else {
              // No cached data, wait for rate limit to reset and retry
              const waitTime = resetTime - Date.now()
              if (waitTime > 0 && waitTime < 3600000) { // Only wait up to 1 hour
                setIsLoading(false)
                retryTimeoutRef.current = setTimeout(() => {
                  if (!controller.signal.aborted) {
                    fetchIssues(0)
                  }
                }, waitTime + 1000) // Add 1 second buffer
                return
              }
            }
          }
        }

        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&page=${page}&per_page=${perPage}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          },
          signal: controller.signal
        })

        // Update rate limit info from response headers
        updateRateLimitInfo(response.headers)

        if (!response.ok) {
          if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
            const rateLimitReset = response.headers.get('X-RateLimit-Reset')
            
            if (rateLimitRemaining === '0' && rateLimitReset) {
              // Rate limited - use cached data if available, otherwise wait and retry
              const cached = getDailyCached<GithubSearchResponse>(cacheKey)
              if (cached) {
                setData(cached)
                setIsLoading(false)
                
                // Schedule automatic retry after rate limit resets
                const resetTime = parseInt(rateLimitReset, 10) * 1000
                const waitTime = resetTime - Date.now()
                if (waitTime > 0 && waitTime < 3600000) {
                  retryTimeoutRef.current = setTimeout(() => {
                    if (!controller.signal.aborted) {
                      fetchIssues(0)
                    }
                  }, waitTime + 1000)
                }
                return
              }
              
              // No cached data - wait and retry automatically
              const resetTime = parseInt(rateLimitReset, 10) * 1000
              const waitTime = resetTime - Date.now()
              if (waitTime > 0 && waitTime < 3600000) {
                setIsLoading(true) // Keep loading state
                retryTimeoutRef.current = setTimeout(() => {
                  if (!controller.signal.aborted) {
                    fetchIssues(0)
                  }
                }, waitTime + 1000)
                return
              }
            } else {
              // 403 but not rate limit - might be forbidden search
              throw new Error(`Access forbidden. Your search might be too complex. Try simplifying your filters.`)
            }
          }
          
          if (response.status === 422) {
            throw new Error(`Invalid search query. Try adjusting your filters.`)
          }
          
          if (response.status >= 500) {
            // Retry on server errors with exponential backoff
            if (retryCount < MAX_RETRIES) {
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
              await sleep(delay)
              if (!controller.signal.aborted) {
                return fetchIssues(retryCount + 1)
              }
            }
            throw new Error(`GitHub service is temporarily unavailable. Please try again later.`)
          }
          
          throw new Error(`Unable to fetch issues. Please try again.`)
        }

        const json: GithubSearchResponse = await response.json()
        setDailyCached(cacheKey, json)
        setData(json)
      } catch (err: unknown) {
        if ((err as any)?.name === 'AbortError') return
        
        // Check if we have cached data to fall back to
        const cached = getDailyCached<GithubSearchResponse>(cacheKey)
        if (cached) {
          setData(cached)
          setIsLoading(false)
          // Don't set error if we have cached data
          return
        }
        
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError(new Error('Network error. Please check your connection.'))
        } else {
          const errorMessage = (err as Error).message
          // Only show error if it's not a rate limit error (we handle those silently)
          if (!errorMessage.includes('Rate limit')) {
            setError(err as Error)
          } else {
            // Rate limit error - try to use any cached data or wait
            setIsLoading(false)
            return
          }
        }
        
        setData({ total_count: 0, incomplete_results: false, items: [] })
      } finally {
        setIsLoading(false)
      }
    }

    // Background fetch function that doesn't block UI
    async function fetchIssuesInBackground(controller: AbortController): Promise<void> {
      try {
        if (isRateLimited()) return
        
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&page=${page}&per_page=${perPage}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          },
          signal: controller.signal
        })

        updateRateLimitInfo(response.headers)

        if (response.ok) {
          const json: GithubSearchResponse = await response.json()
          setDailyCached(cacheKey, json)
          setData(json)
        }
      } catch {
        // Silently fail background updates
      }
    }

    fetchIssues()

    return () => {
      controller.abort()
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [query, page, perPage, cacheKey])

  return { data, isLoading, error }
}



