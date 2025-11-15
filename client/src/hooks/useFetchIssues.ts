import { useEffect, useRef, useState } from 'react'

type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
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

        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          },
          signal: controller.signal
        })

        if (!response.ok) {
          const errorText = await response.text()
          
          // Handle rate limiting (403) with better error message
          if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
            const rateLimitReset = response.headers.get('X-RateLimit-Reset')
            
            if (rateLimitRemaining === '0') {
              const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'soon'
              throw new Error(`GitHub API rate limit exceeded. Please try again after ${resetTime}.`)
            } else {
              throw new Error(`GitHub API access forbidden. This might be due to rate limiting or query complexity. Try simplifying your filters.`)
            }
          }
          
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        }

        const json: GithubSearchResponse = await response.json()
        setData(json)
      } catch (err: unknown) {
        if ((err as any)?.name === 'AbortError') return
        const error = err as Error
        setError(error)
        // Set empty data on error so UI shows error state
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


