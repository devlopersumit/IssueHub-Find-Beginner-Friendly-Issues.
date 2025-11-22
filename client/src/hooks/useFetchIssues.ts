import { useEffect, useRef, useState, useMemo } from 'react'
import { getCached, setCached } from '../utils/requestCache'

type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
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

export function useFetchIssues(query: string, page: number = 1, perPage: number = 20): UseFetchIssuesResult {
  const [data, setData] = useState<GithubSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const cacheKey = useMemo(() => `issues_${query}_${page}_${perPage}`, [query, page, perPage])

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchIssues() {
      setIsLoading(true)
      setError(null)
      try {
        // Don't fetch if query is empty
        if (!query || query.trim() === '') {
          setData({ total_count: 0, incomplete_results: false, items: [] })
          setIsLoading(false)
          return
        }

        // Check cache first
        const cached = getCached<GithubSearchResponse>(cacheKey)
        if (cached) {
          setData(cached)
          setIsLoading(false)
          return
        }

        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          },
          signal: controller.signal
        })

        if (!response.ok) {
          if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
            const rateLimitReset = response.headers.get('X-RateLimit-Reset')
            
            if (rateLimitRemaining === '0') {
              const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'soon'
              throw new Error(`Rate limit exceeded. Try again after ${resetTime}.`)
            } else {
              throw new Error(`Access forbidden. Your search might be too complex. Try simplifying your filters.`)
            }
          }
          
          if (response.status === 422) {
            throw new Error(`Invalid search query. Try adjusting your filters.`)
          }
          
          if (response.status >= 500) {
            throw new Error(`GitHub service is temporarily unavailable. Please try again later.`)
          }
          
          throw new Error(`Unable to fetch issues. Please try again.`)
        }

        const json: GithubSearchResponse = await response.json()
        setCached(cacheKey, json)
        setData(json)
      } catch (err: unknown) {
        if ((err as any)?.name === 'AbortError') return
        
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError(new Error('Network error. Please check your connection.'))
        } else {
          setError(err as Error)
        }
        
        setData({ total_count: 0, incomplete_results: false, items: [] })
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()

    return () => {
      controller.abort()
    }
  }, [query, page, perPage])

  return { data, isLoading, error }
}



